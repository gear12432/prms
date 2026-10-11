import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function to atomically transfer coins from sender to recipient
 */
export const sendCoins = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const senderUid = context.auth.uid;
  const { recipientUserId, amount, description } = data;

  if (!recipientUserId || typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid recipient or coin amount.');
  }

  // Lookup recipient UID
  const userIdSnap = await db.collection('userIds').doc(recipientUserId).get();
  if (!userIdSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Recipient User ID not found.');
  }

  const recipientUid = userIdSnap.data()?.uid;
  if (!recipientUid) {
    throw new functions.https.HttpsError('not-found', 'Recipient UID invalid.');
  }

  if (senderUid === recipientUid) {
    throw new functions.https.HttpsError('invalid-argument', 'Cannot send coins to yourself.');
  }

  return db.runTransaction(async (transaction) => {
    const senderWalletRef = db.collection('wallets').doc(senderUid);
    const recipientWalletRef = db.collection('wallets').doc(recipientUid);

    const senderWalletSnap = await transaction.get(senderWalletRef);
    const recipientWalletSnap = await transaction.get(recipientWalletRef);

    if (!senderWalletSnap.exists) {
      throw new functions.https.HttpsError('failed-precondition', 'Sender wallet does not exist.');
    }

    const senderBalance = senderWalletSnap.data()?.coinBalance || 0;
    if (senderBalance < amount) {
      throw new functions.https.HttpsError('failed-precondition', 'Insufficient coin balance.');
    }

    const recipientBalance = recipientWalletSnap.exists ? (recipientWalletSnap.data()?.coinBalance || 0) : 0;

    // Update balances
    transaction.update(senderWalletRef, {
      coinBalance: senderBalance - amount,
      updatedAt: new Date().toISOString()
    });

    if (recipientWalletSnap.exists) {
      transaction.update(recipientWalletRef, {
        coinBalance: recipientBalance + amount,
        updatedAt: new Date().toISOString()
      });
    } else {
      transaction.set(recipientWalletRef, {
        uid: recipientUid,
        userId: recipientUserId,
        coinBalance: amount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Record transactions
    const txId = `TX_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const txRef = db.collection('transactions').doc(txId);

    transaction.set(txRef, {
      transactionId: txId,
      senderUid,
      senderUserId: senderWalletSnap.data()?.userId || '',
      recipientUid,
      recipientUserId,
      transactionType: 'send',
      coinAmount: amount,
      fee: 0,
      status: 'completed',
      createdAt: new Date().toISOString(),
      description: description || 'Coin transfer',
      referenceNo: txId
    });

    return { success: true, transactionId: txId, newBalance: senderBalance - amount };
  });
});
