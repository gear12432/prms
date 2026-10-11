export type TransactionType = 'buy' | 'send' | 'receive';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransaction {
  transactionId: string;
  senderUid: string;
  senderUserId?: string;
  recipientUid: string;
  recipientUserId?: string;
  transactionType: TransactionType;
  coinAmount: number;
  fee: number;
  amountInINR?: number;
  paymentMethod?: string;
  status: TransactionStatus;
  createdAt: string;
  description?: string;
  referenceNo?: string;
}
