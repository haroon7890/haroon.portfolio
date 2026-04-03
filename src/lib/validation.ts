const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export function normalizeText(value: FormDataEntryValue | string | null | undefined, max = 500): string {
  const raw = typeof value === "string" ? value : value instanceof File ? value.name : "";
  return raw.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isSafeMessage(message: string): boolean {
  return message.length >= 10 && message.length <= 5000;
}

export function isAllowedAttachmentType(file: File): boolean {
  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
  ]);

  return allowedTypes.has(file.type);
}
