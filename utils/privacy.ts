export const redactPII = (text: string): string => {
  // Regex to detect email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // Regex to detect phone numbers (supports various formats like +39..., 02..., 333...)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

  let redacted = text.replace(emailRegex, '[EMAIL_REDACTED]');
  redacted = redacted.replace(phoneRegex, '[PHONE_REDACTED]');

  return redacted;
};