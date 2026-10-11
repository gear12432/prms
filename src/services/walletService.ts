import { 
  doc, getDoc, setDoc, onSnapshot, runTransaction 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserWallet, SendCoinsRequest, BuyCoinsRequest } from '../types/wallet';
import { WalletTransaction } from '../types/transaction';
import { handleFirestoreError, OperationType } from '../lib/firebaseErrors';
import { getUidFromUserId } from './userService';

/**
 * Fetch current user wallet balance
 */
export async function getUserWallet(uid: string): Promise<UserWallet | null> {
  const path = `wallets/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'wallets', uid));
    if (snap.exists()) {
      return snap.data() as UserWallet;
    }
    return null;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Subscribe real-time listener to user wallet
 */
export function subscribeUserWallet(
  uid: string, 
  onUpdate: (wallet: UserWallet) => void,
  onError?: (err: Error) => void
) {
  const path = `wallets/${uid}`;
  return onSnapshot(
    doc(db, 'wallets', uid),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserWallet);
      }
    },
    (error) => {
      const formattedErr = handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(formattedErr);
    }
  );
}

/**
 * Buy Coins - Adds coins to wallet and records transaction
 */
export async function buyCoins(
  uid: string, 
  userPublicId: string, 
  req: BuyCoinsRequest
): Promise<WalletTransaction> {
  const now = new Date().toISOString();
  const txId = `TX_BUY_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const tx: WalletTransaction = {
    transactionId: txId,
    senderUid: 'SYSTEM',
    senderUserId: 'phoneG Treasury',
    recipientUid: uid,
    recipientUserId: userPublicId,
    transactionType: 'buy',
    coinAmount: req.coinAmount,
    fee: 0,
    amountInINR: req.amountInINR,
    paymentMethod: req.paymentMethod,
    status: 'completed',
    createdAt: now,
    description: `Purchased ${req.coinAmount} phoneG Coins via ${req.paymentMethod}`,
    referenceNo: txId
  };

  try {
    await runTransaction(db, async (transaction) => {
      const walletRef = doc(db, 'wallets', uid);
      const walletSnap = await transaction.get(walletRef);

      const currentBalance = walletSnap.exists() ? (walletSnap.data()?.coinBalance || 0) : 0;
      const newBalance = currentBalance + req.coinAmount;

      transaction.set(walletRef, {
        uid,
        userId: userPublicId,
        coinBalance: newBalance,
        updatedAt: now,
        createdAt: walletSnap.exists() ? (walletSnap.data()?.createdAt || now) : now
      }, { merge: true });

      const txRef = doc(db, 'transactions', txId);
      transaction.set(txRef, tx);
    });

    return tx;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.WRITE, `wallets/${uid}`);
  }
}

/**
 * Send Coins - Atomic client transaction debiting sender and crediting recipient
 */
export async function sendCoins(
  senderUid: string,
  senderPublicId: string,
  req: SendCoinsRequest
): Promise<WalletTransaction> {
  const { recipientUserId, coinAmount, description } = req;
  const cleanRecipientId = recipientUserId.trim().toUpperCase();

  if (cleanRecipientId === senderPublicId.trim().toUpperCase()) {
    throw new Error('You cannot send coins to your own User ID.');
  }

  // Lookup recipient UID from public PLxxxxx ID
  const recipientMatch = await getUidFromUserId(cleanRecipientId);
  if (!recipientMatch || !recipientMatch.uid) {
    throw new Error(`User ID "${cleanRecipientId}" was not found. Please verify the ID and try again.`);
  }

  const recipientUid = recipientMatch.uid;
  const now = new Date().toISOString();
  const txId = `TX_SEND_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const tx: WalletTransaction = {
    transactionId: txId,
    senderUid,
    senderUserId: senderPublicId,
    recipientUid,
    recipientUserId: cleanRecipientId,
    transactionType: 'send',
    coinAmount,
    fee: 0,
    status: 'completed',
    createdAt: now,
    description: description || `Sent ${coinAmount} Coins to ${cleanRecipientId}`,
    referenceNo: txId
  };

  try {
    await runTransaction(db, async (transaction) => {
      const senderWalletRef = doc(db, 'wallets', senderUid);
      const recipientWalletRef = doc(db, 'wallets', recipientUid);

      const senderSnap = await transaction.get(senderWalletRef);
      if (!senderSnap.exists()) {
        throw new Error('Sender wallet record not found.');
      }

      const senderBalance = senderSnap.data()?.coinBalance || 0;
      if (senderBalance < coinAmount) {
        throw new Error(`Insufficient coin balance. Your current balance is ${senderBalance} Coins.`);
      }

      const recipientSnap = await transaction.get(recipientWalletRef);
      const recipientBalance = recipientSnap.exists() ? (recipientSnap.data()?.coinBalance || 0) : 0;

      // Deduct from sender
      transaction.update(senderWalletRef, {
        coinBalance: senderBalance - coinAmount,
        updatedAt: now
      });

      // Add to recipient
      if (recipientSnap.exists()) {
        transaction.update(recipientWalletRef, {
          coinBalance: recipientBalance + coinAmount,
          updatedAt: now
        });
      } else {
        transaction.set(recipientWalletRef, {
          uid: recipientUid,
          userId: cleanRecipientId,
          coinBalance: coinAmount,
          createdAt: now,
          updatedAt: now
        });
      }

      // Record transaction
      const txRef = doc(db, 'transactions', txId);
      transaction.set(txRef, tx);
    });

    return tx;
  } catch (error: any) {
    if (error.message && !error.message.includes('{')) {
      throw error;
    }
    throw handleFirestoreError(error, OperationType.WRITE, `transactions/${txId}`);
  }
}
