import { Transaction } from '../types';

// Helper to generate a date within the last 72 hours
const randomDate = () => {
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 72));
  return date.toISOString();
};

export const generateDemoData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // 1. Create a Smurfing Pattern (Fan-In)
  // "Smurf King" receives from 12 mules
  const smurfKing = 'ACC_KINGPIN_01';
  for (let i = 1; i <= 12; i++) {
    transactions.push({
      id: `TX_SMURF_${i}`,
      timestamp: randomDate(),
      sender_id: `ACC_MULE_${i}`,
      receiver_id: smurfKing,
      amount: 4900 + Math.random() * 100 // Just under reporting limit (5000)
    });
  }

  // 2. Create a Structuring Cycle (Layering)
  // A -> B -> C -> D -> A
  const cycleNodes = ['ACC_LAYER_A', 'ACC_LAYER_B', 'ACC_LAYER_C', 'ACC_LAYER_D'];
  cycleNodes.forEach((node, idx) => {
    const nextNode = cycleNodes[(idx + 1) % cycleNodes.length];
    transactions.push({
      id: `TX_CYCLE_${idx}`,
      timestamp: randomDate(),
      sender_id: node,
      receiver_id: nextNode,
      amount: 100000
    });
  });

  // 3. Create Shell/Pass-through
  // Source -> Shell -> Destination
  const shells = ['ACC_SHELL_X', 'ACC_SHELL_Y', 'ACC_SHELL_Z'];
  shells.forEach((shell, idx) => {
    transactions.push({
      id: `TX_SHELL_IN_${idx}`,
      timestamp: randomDate(),
      sender_id: `ACC_ORIGIN_${idx}`,
      receiver_id: shell,
      amount: 50000
    });
    transactions.push({
      id: `TX_SHELL_OUT_${idx}`,
      timestamp: randomDate(),
      sender_id: shell,
      receiver_id: `ACC_FINAL_${idx}`,
      amount: 49500 // Taking a small cut
    });
  });

  // 4. Random Noise (Legit transactions)
  for (let i = 0; i < 50; i++) {
    transactions.push({
      id: `TX_LEGIT_${i}`,
      timestamp: randomDate(),
      sender_id: `ACC_USER_${Math.floor(Math.random() * 20)}`,
      receiver_id: `ACC_MERCHANT_${Math.floor(Math.random() * 5)}`,
      amount: Math.random() * 200
    });
  }

  return transactions;
};