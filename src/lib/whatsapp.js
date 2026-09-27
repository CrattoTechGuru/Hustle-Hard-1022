export function buildWhatsAppLink(sellerWhatsapp, itemName, price) {
  const cleanNumber = String(sellerWhatsapp || '').replace(/\D/g, '')
  const priceText = price ? ` (R${price})` : ''
  const message = `Hi, I found your listing "${itemName}"${priceText} on Hustle Hard. Is it still available?`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

export function buildOfferLink(sellerWhatsapp, itemName, offerAmount) {
  const cleanNumber = String(sellerWhatsapp || '').replace(/\D/g, '')
  const message = `Hi, I'd like to offer R${offerAmount} for your listing "${itemName}" on Hustle Hard. Would you accept?`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

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
