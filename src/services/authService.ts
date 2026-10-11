import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './firebase';
import { getUidFromUserId, getUserProfile } from './userService';
import { parseAuthError } from '../lib/firebaseErrors';

/**
 * Sign in using User ID (PL18753) or Gmail address
 */
export async function loginWithUserIdOrEmail(identifier: string, password: string) {
  const clean = identifier.trim();
  let emailToAuth = clean;

  if (!clean.includes('@')) {
    // Identifier is public PLxxxxx User ID
    const resolved = await getUidFromUserId(clean.toUpperCase());
    if (!resolved || !resolved.uid) {
      throw new Error('Invalid User ID. Please check your PL number or register a new account.');
    }

    const profile = await getUserProfile(resolved.uid);
    if (!profile || !profile.email) {
      throw new Error('Account details not found for this User ID.');
    }

    emailToAuth = profile.email;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(parseAuthError(error));
  }
}

/**
 * Register Firebase Auth user with email and password
 */
export async function registerAuthUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(parseAuthError(error));
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(parseAuthError(error));
  }
}
