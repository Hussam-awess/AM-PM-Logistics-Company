import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a WhatsApp Click-to-Chat URL using wa.me format.
 * - Cleans phone numbers by removing non-digits
 * - If number starts with 0, converts leading 0(s) to Tanzania code 255
 * - Encodes message with encodeURIComponent
 */
export function generateWhatsAppUrl(phone: string | null | undefined, customerName: string, jobId: string) {
  if (!phone) return "#"

  let cleaned = String(phone).replace(/[^0-9]/g, "")
  if (!cleaned) return "#"

  if (cleaned.startsWith("0")) {
    // remove all leading zeros then prefix with Tanzania country code
    cleaned = `255${cleaned.replace(/^0+/, "")}`
  }

  const message = `Hello ${customerName}, we received your job request (ID: ${jobId}). Our management team will assist you shortly.`

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}
