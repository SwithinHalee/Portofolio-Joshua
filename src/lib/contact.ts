import { cleanEmail, isValidEmail } from "@/lib/portfolio-store";

/**
 * Opens the OS mail client for the given address. Copies the address to
 * clipboard as a seamless backup so users on systems without a configured
 * desktop email client are never stranded.
 */
export function openMailClient(rawEmail: string): "launched" | "invalid" {
  const email = cleanEmail(rawEmail);
  if (!isValidEmail(email)) return "invalid";

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
  } catch {
    // Clipboard unavailable
  }

  try {
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${email}`;
    }
  } catch {
    // Navigation fallback
  }

  return "launched";
}
