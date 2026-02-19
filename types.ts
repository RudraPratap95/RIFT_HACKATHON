export interface Transaction {
  id: string; // transaction_id
  timestamp: string; // YYYY-MM-DD HH:MM:SS
  sender_id: string;
  receiver_id: string;
  amount: number;
}

export enum DetectionType {
  CYCLE = 'cycle',
  SMURFING = 'smurfing', // fan-in or fan-out
  SHELL = 'shell',
  HIGH_VELOCITY = 'high_velocity',
  SAFE = 'safe'
}

export interface SuspiciousAccount {
  account_id: string;
  suspicion_score: number; // 0-100
  detected_patterns: string[];
  ring_id?: string;
}

export interface FraudRingJSON {
  ring_id: string;
  member_accounts: string[];
  pattern_type: string;
  risk_score: number;
}

export interface SummaryStats {
  total_accounts_analyzed: number;
  suspicious_accounts_flagged: number;
  fraud_rings_detected: number;
  processing_time_seconds: number;
}

export interface ForensicReport {
  suspicious_accounts: SuspiciousAccount[];
  fraud_rings: FraudRingJSON[];
  summary: SummaryStats;
}

// Internal app state combining visualization data and the official report
export interface AnalysisResult {
  nodes: AccountNode[];
  edges: Transaction[];
  report: ForensicReport;
}

export interface AccountNode {
  account_id: string;
  suspicion_score: number;
  flags: string[];
  in_degree: number;
  out_degree: number;
  total_volume: number;
  ring_id?: string;
}
