import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a document or image file to Firebase Storage under the user's private folder
 */
export async function uploadUserDocument(
  uid: string,
  docType: 'pan' | 'aadhaar_front' | 'aadhaar_back' | 'profile_photo',
  fileOrBase64: File | string
): Promise<string> {
  if (!fileOrBase64) return '';

  const filename = `${docType}_${Date.now()}`;
  const storageRef = ref(storage, `kyc/${uid}/${filename}`);

  try {
    if (fileOrBase64 instanceof File) {
      const snapshot = await uploadBytes(storageRef, fileOrBase64);
      return await getDownloadURL(snapshot.ref);
    } else if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      // Base64 string preview/upload
      const res = await fetch(fileOrBase64);
      const blob = await res.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      return await getDownloadURL(snapshot.ref);
    }
    return '';
  } catch (error) {
    console.warn(`Storage upload for ${docType} failed or fallback to data URL:`, error);
    // If Firebase Storage is uninitialized in dev emulator, return data URL as fallback
    if (typeof fileOrBase64 === 'string') return fileOrBase64;
    return '';
  }
}
