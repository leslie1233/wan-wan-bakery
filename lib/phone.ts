export type SiteContactSettings = {
  phone: string;
  phoneE164: string;
  whatsappNumber: string;
};

export function parsePhoneInput(raw: string): SiteContactSettings | null {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 8) {
    return {
      phone: digits,
      phoneE164: `+65${digits}`,
      whatsappNumber: `65${digits}`,
    };
  }

  if (digits.length === 10 && digits.startsWith("65")) {
    const local = digits.slice(2);
    return {
      phone: local,
      phoneE164: `+${digits}`,
      whatsappNumber: digits,
    };
  }

  if (digits.length === 11 && digits.startsWith("65")) {
    return {
      phone: digits.slice(2),
      phoneE164: `+${digits}`,
      whatsappNumber: digits,
    };
  }

  return null;
}

export function formatCallLabel(label: string, phone: string): string {
  return label
    .replace(/\{\{phone\}\}/g, phone)
    .replace(/81571573/g, phone)
    .replace(/\+6581571573/g, phone);
}
