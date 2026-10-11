export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCoins(coins: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2
  }).format(coins);
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length !== 12) return aadhaar;
  return `XXXX XXXX ${clean.substring(8)}`;
}

export function maskPan(pan: string): string {
  const clean = pan.trim().toUpperCase();
  if (clean.length !== 10) return pan;
  return `${clean.substring(0, 2)}XXXXXX${clean.substring(8)}`;
}
