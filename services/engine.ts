import { Transaction, AnalysisResult, AccountNode, DetectionType, ForensicReport, FraudRingJSON, SuspiciousAccount } from '../types';

/**
 * Core Detection Engine for RIFT 2026 Hackathon
 * Implements Graph Theory analysis to detect Money Muling Rings.
 */
export const runDetectionEngine = (transactions: Transaction[]): AnalysisResult => {
  const startTime = performance.now();
  
  const accountMap = new Map<string, AccountNode>();
  const adjacency: Record<string, string[]> = {};
  const reverseAdjacency: Record<string, string[]> = {};
  
  // 1. Ingest Data & Build Graph
  transactions.forEach(tx => {
    if (!accountMap.has(tx.sender_id)) initAccount(accountMap, tx.sender_id);
    if (!accountMap.has(tx.receiver_id)) initAccount(accountMap, tx.receiver_id);

    const sender = accountMap.get(tx.sender_id)!;
    const receiver = accountMap.get(tx.receiver_id)!;

    sender.out_degree++;
    sender.total_volume += tx.amount;
    
    receiver.in_degree++;
    receiver.total_volume += tx.amount;

    if (!adjacency[tx.sender_id]) adjacency[tx.sender_id] = [];
    adjacency[tx.sender_id].push(tx.receiver_id);

    if (!reverseAdjacency[tx.receiver_id]) reverseAdjacency[tx.receiver_id] = [];
    reverseAdjacency[tx.receiver_id].push(tx.sender_id);
  });

  const rings: FraudRingJSON[] = [];
  let ringCounter = 1;
  const generateRingId = () => `RING_${String(ringCounter++).padStart(3, '0')}`;

  // Helper to assign ring IDs to accounts
  const assignRing = (accounts: string[], type: string, score: number) => {
    const ringId = generateRingId();
    const ringMembers: string[] = [];

    accounts.forEach(accId => {
      const node = accountMap.get(accId);
      if (node) {
        // Only assign if not already part of a higher priority ring or merge
        if (!node.ring_id) {
            node.ring_id = ringId;
        }
        if (!node.flags.includes(type)) {
            node.flags.push(type);
        }
        node.suspicion_score = Math.max(node.suspicion_score, score);
        ringMembers.push(accId);
      }
    });

    // Only add if we actually have members
    if (ringMembers.length > 0) {
        rings.push({
            ring_id: ringId,
            member_accounts: [...new Set(ringMembers)],
            pattern_type: type,
            risk_score: score
        });
    }
  };

  // 2. Algorithm: Smurfing (Fan-In / Fan-Out)
  // Logic: 
  // Fan-in: 10+ senders -> 1 receiver
  // Fan-out: 1 sender -> 10+ receivers
  // Time Window: Ideally 72h, here we assume dataset is relevant window or check basic connectivity
  
  accountMap.forEach(node => {
    const uniqueSenders = new Set(reverseAdjacency[node.account_id] || []).size;
    const uniqueReceivers = new Set(adjacency[node.account_id] || []).size;

    // False Positive Check: Merchant
    // High In-Degree but near zero Out-Degree is likely a merchant.
    const isLikelyMerchant = uniqueSenders > 10 && uniqueReceivers === 0;
    
    // False Positive Check: Payroll
    // High Out-Degree but near zero In-Degree is likely payroll.
    const isLikelyPayroll = uniqueReceivers > 10 && uniqueSenders === 0;

    if (uniqueSenders >= 10 && !isLikelyMerchant) {
        // Fan-In Smurfing (Aggregator)
        // Check if money moves OUT (Mule Aggregator)
        if (node.out_degree > 0) {
            assignRing([node.account_id, ...(reverseAdjacency[node.account_id] || [])], 'smurfing_fan_in', 85);
        }
    }

    if (uniqueReceivers >= 10 && !isLikelyPayroll) {
        // Fan-Out Smurfing (Distributor)
        // Check if money came IN (Mule Distributor)
        if (node.in_degree > 0) {
             assignRing([node.account_id, ...(adjacency[node.account_id] || [])], 'smurfing_fan_out', 85);
        }
    }
  });

  // 3. Algorithm: Cycle Detection (DFS)
  // Length 3-5
  const visited = new Set<string>();
  
  // Optimization: Only run on nodes that have both in and out degrees
  const potentialCycleNodes = Array.from(accountMap.values())
    .filter(n => n.in_degree > 0 && n.out_degree > 0)
    .map(n => n.account_id);

  const detectCycle = (curr: string, start: string, path: string[], depth: number) => {
    if (depth > 5) return;
    
    const neighbors = adjacency[curr] || [];
    for (const neighbor of neighbors) {
      if (neighbor === start && depth >= 3) {
        // Found Cycle
        const cycleMembers = [...path]; // Don't include neighbor again as it is start
        assignRing(cycleMembers, `cycle_length_${depth}`, 95);
        return;
      }
      if (!path.includes(neighbor) && depth < 5) {
        detectCycle(neighbor, start, [...path, neighbor], depth + 1);
      }
    }
  };

  // Limit cycle detection to avoid browser freeze on large datasets
  // In production, this runs on backend with optimized C++ graph libs
  const maxCycleChecks = 200; 
  let cycleChecks = 0;

  for (const nodeId of potentialCycleNodes) {
      if (cycleChecks++ > maxCycleChecks) break;
      detectCycle(nodeId, nodeId, [nodeId], 1);
  }

  // 4. Algorithm: Layered Shells
  // Chain of 3+ hops where intermediate nodes have In=1, Out=1
  // A -> B -> C -> D
  // B and C are shells.
  // We look for linear paths of low-degree nodes.
  
  const shellCandidates = Array.from(accountMap.values())
     .filter(n => n.in_degree === 1 && n.out_degree === 1 && n.total_volume > 0);

  // Simple heuristic: if a shell points to another shell
  shellCandidates.forEach(node => {
      const target = adjacency[node.account_id]?.[0];
      if (target) {
          const targetNode = accountMap.get(target);
          if (targetNode && targetNode.in_degree === 1 && targetNode.out_degree === 1) {
              // Found connected shells
              assignRing([node.account_id, target], 'layered_shell', 75);
          }
      }
  });

  // Finalize Report Data
  const endTime = performance.now();
  const processingTime = (endTime - startTime) / 1000;

  const suspiciousAccounts: SuspiciousAccount[] = Array.from(accountMap.values())
    .filter(n => n.suspicion_score > 0)
    .sort((a, b) => b.suspicion_score - a.suspicion_score)
    .map(n => ({
        account_id: n.account_id,
        suspicion_score: n.suspicion_score,
        detected_patterns: n.flags,
        ring_id: n.ring_id
    }));

  const report: ForensicReport = {
      suspicious_accounts: suspiciousAccounts,
      fraud_rings: rings.sort((a, b) => b.risk_score - a.risk_score),
      summary: {
          total_accounts_analyzed: accountMap.size,
          suspicious_accounts_flagged: suspiciousAccounts.length,
          fraud_rings_detected: rings.length,
          processing_time_seconds: parseFloat(processingTime.toFixed(4))
      }
  };

  return {
    nodes: Array.from(accountMap.values()),
    edges: transactions,
    report
  };
};

function initAccount(map: Map<string, AccountNode>, id: string) {
  map.set(id, {
    account_id: id,
    suspicion_score: 0,
    flags: [],
    in_degree: 0,
    out_degree: 0,
    total_volume: 0
  });
}
