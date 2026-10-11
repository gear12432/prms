export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateMobile(mobile: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile.trim());
}

export function validatePan(pan: string): boolean {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan.trim().toUpperCase());
}

export function validateAadhaar(aadhaar: string): boolean {
  const clean = aadhaar.replace(/\s+/g, '');
  return /^\d{12}$/.test(clean);
}

export function validatePinCode(pin: string): boolean {
  return /^\d{6}$/.test(pin.trim());
}

export function validateUserIdFormat(userId: string): boolean {
  return /^PL\d{5}$/i.test(userId.trim());
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}
