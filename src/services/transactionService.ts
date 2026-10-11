import { 
  collection, query, where, onSnapshot, getDocs, orderBy, limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { WalletTransaction } from '../types/transaction';
import { handleFirestoreError, OperationType } from '../lib/firebaseErrors';

/**
 * Real-time listener for user's transactions (where sender or recipient)
 */
export function subscribeUserTransactions(
  uid: string,
  onUpdate: (transactions: WalletTransaction[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'transactions';

  // We perform queries for senderUid and recipientUid and merge or listen to both
  const qSender = query(
    collection(db, 'transactions'),
    where('senderUid', '==', uid)
  );

  const qRecipient = query(
    collection(db, 'transactions'),
    where('recipientUid', '==', uid)
  );

  let senderTxs: WalletTransaction[] = [];
  let recipientTxs: WalletTransaction[] = [];

  const mergeAndEmit = () => {
    const map = new Map<string, WalletTransaction>();
    senderTxs.forEach(t => map.set(t.transactionId, t));
    recipientTxs.forEach(t => map.set(t.transactionId, t));

    const combined = Array.from(map.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    onUpdate(combined);
  };

  const unsub1 = onSnapshot(
    qSender,
    (snap) => {
      senderTxs = snap.docs.map(doc => doc.data() as WalletTransaction);
      mergeAndEmit();
    },
    (err) => {
      const formatted = handleFirestoreError(err, OperationType.LIST, path);
      if (onError) onError(formatted);
    }
  );

  const unsub2 = onSnapshot(
    qRecipient,
    (snap) => {
      recipientTxs = snap.docs.map(doc => doc.data() as WalletTransaction);
      mergeAndEmit();
    },
    (err) => {
      const formatted = handleFirestoreError(err, OperationType.LIST, path);
      if (onError) onError(formatted);
    }
  );

  return () => {
    unsub1();
    unsub2();
  };
}
