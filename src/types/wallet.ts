export interface UserWallet {
  uid: string;
  userId: string;
  coinBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuyCoinsRequest {
  coinAmount: number;
  amountInINR: number;
  paymentMethod: string;
}

export interface SendCoinsRequest {
  recipientUserId: string; // e.g. PL18753
  coinAmount: number;
  description?: string;
}
