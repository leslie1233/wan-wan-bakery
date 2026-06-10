const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferralCode(length = 8): string {
  let code = "";

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * REFERRAL_ALPHABET.length);
    code += REFERRAL_ALPHABET[randomIndex];
  }

  return code;
}

export function normalizeReferralCode(value: string): string {
  return value.trim().toUpperCase();
}
