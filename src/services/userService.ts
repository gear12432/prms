import { 
  doc, setDoc, getDoc, runTransaction 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserPrivateDetails, RegistrationFormData } from '../types/user';
import { handleFirestoreError, OperationType } from '../lib/firebaseErrors';

/**
 * Generate unique PL + 5 digits ID (e.g., PL18753)
 */
export async function generateUniqueUserId(): Promise<string> {
  let isUnique = false;
  let generatedId = '';
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomFiveDigits = Math.floor(10000 + Math.random() * 90000);
    generatedId = `PL${randomFiveDigits}`;

    const ref = doc(db, 'userIds', generatedId);
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        isUnique = true;
      }
    } catch (err) {
      // If error occurs, retry
    }
  }

  if (!isUnique) {
    generatedId = `PL${Date.now().toString().slice(-5)}`;
  }

  return generatedId;
}

/**
 * Creates full user profile, private record, user ID lookup, and initial wallet in Firestore
 */
export async function createUserRecords(
  uid: string,
  email: string,
  userId: string,
  formData: RegistrationFormData,
  uploadedDocPaths: { panPath: string; aadhaarFrontPath: string; aadhaarBackPath: string; profilePhotoPath: string }
): Promise<{ userProfile: UserProfile; userId: string }> {
  const now = new Date().toISOString();

  const userProfile: UserProfile = {
    uid,
    userId,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    mobileNumber: formData.mobileNumber.trim(),
    email: email.trim(),
    profilePhotoPath: uploadedDocPaths.profilePhotoPath,
    registrationStatus: 'completed',
    accountStatus: 'active',
    kycStatus: 'pending',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  const userPrivate: UserPrivateDetails = {
    uid,
    address: formData.address.trim(),
    state: formData.state,
    district: formData.district,
    pinCode: formData.pinCode.trim(),
    city: formData.city.trim(),
    panNumber: formData.panNumber.trim().toUpperCase(),
    aadhaarNumber: formData.aadhaarNumber.trim(),
    panDocumentPath: uploadedDocPaths.panPath,
    aadhaarFrontPath: uploadedDocPaths.aadhaarFrontPath,
    aadhaarBackPath: uploadedDocPaths.aadhaarBackPath,
    updatedAt: now
  };

  try {
    // Write atomically using batch / transaction or sequential sets
    await setDoc(doc(db, 'users', uid), userProfile);
    await setDoc(doc(db, 'userPrivate', uid), userPrivate);
    await setDoc(doc(db, 'userIds', userId), {
      uid,
      userId,
      createdAt: now
    });
    await setDoc(doc(db, 'kycRecords', uid), {
      uid,
      userId,
      panNumber: formData.panNumber.trim().toUpperCase(),
      aadhaarNumber: formData.aadhaarNumber.trim(),
      panDocumentPath: uploadedDocPaths.panPath,
      aadhaarFrontPath: uploadedDocPaths.aadhaarFrontPath,
      aadhaarBackPath: uploadedDocPaths.aadhaarBackPath,
      kycStatus: 'pending',
      submittedAt: now
    });
    await setDoc(doc(db, 'wallets', uid), {
      uid,
      userId,
      coinBalance: 50, // Welcome bonus of 50 coins!
      createdAt: now,
      updatedAt: now
    });

    return { userProfile, userId };
  } catch (error) {
    throw handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

/**
 * Fetch public user profile
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Resolve PLxxxxx public User ID to Firebase UID and user profile
 */
export async function getUidFromUserId(publicUserId: string): Promise<{ uid: string; email?: string } | null> {
  const cleanId = publicUserId.trim().toUpperCase();
  const path = `userIds/${cleanId}`;
  try {
    const snap = await getDoc(doc(db, 'userIds', cleanId));
    if (snap.exists()) {
      const data = snap.data();
      return { uid: data.uid };
    }
    return null;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.GET, path);
  }
}
