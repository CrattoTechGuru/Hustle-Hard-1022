/**
 * Builds a wa.me deep link that pre-fills a WhatsApp message with listing
 * details, so a buyer can message the seller with one tap and no backend
 * chat system is needed.
 *
 * @param {string} sellerWhatsapp - digits only, country code first, e.g. "27720708648"
 * @param {string} itemName
 * @param {number|string} price
 * @returns {string} a wa.me URL safe to use in an <a href> or window.open
 */
export function buildWhatsAppLink(sellerWhatsapp, itemName, price) {
  const cleanNumber = String(sellerWhatsapp || '').replace(/\D/g, '')
  const priceText = price ? ` (R${price})` : ''
  const message = `Hi, I found your listing "${itemName}"${priceText} on Hustle Hard. Is it still available?`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

/**
 * Same idea, but for a buyer sending a custom counter-offer amount instead of
 * the default "is it still available" message.
 */
export function buildOfferLink(sellerWhatsapp, itemName, offerAmount) {
  const cleanNumber = String(sellerWhatsapp || '').replace(/\D/g, '')
  const message = `Hi, I'd like to offer R${offerAmount} for your listing "${itemName}" on Hustle Hard. Would you accept?`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

/**
 * Normalizes a locally-typed SA number (e.g. "0720708648") into the
 * international digits-only format wa.me expects ("27720708648").
 */
export function normalizeToInternational(localNumber) {
  const digits = String(localNumber || '').replace(/\D/g, '')
  if (digits.startsWith('0')) {
    return `27${digits.slice(1)}`
  }
  if (digits.startsWith('27')) {
    return digits
  }
  return digits
}
