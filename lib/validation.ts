// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'E-posta adresi gereklidir' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Geçerli bir e-posta adresi giriniz' }
  }

  return { isValid: true }
}

// Phone validation (Turkish format)
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: 'Telefon numarası gereklidir' }
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '')

  // Turkish phone format: starts with 0 or +90, followed by 10 digits
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Geçerli bir telefon numarası giriniz (örn: 0532 123 4567)' }
  }

  return { isValid: true }
}

// Price validation
export function validatePrice(price: string | number): { isValid: boolean; error?: string } {
  if (!price && price !== 0) {
    return { isValid: false, error: 'Fiyat gereklidir' }
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Geçerli bir fiyat giriniz' }
  }

  if (numPrice < 0) {
    return { isValid: false, error: 'Fiyat negatif olamaz' }
  }

  if (numPrice > 999999999) {
    return { isValid: false, error: 'Fiyat çok yüksek' }
  }

  return { isValid: true }
}

// License plate validation (Turkish format)
export function validateLicensePlate(plate: string): { isValid: boolean; error?: string } {
  if (!plate) {
    return { isValid: false, error: 'Plaka numarası gereklidir' }
  }

  // Turkish license plate format: 2 digits + 1-3 letters + 2-4 digits
  // Example: 34 ABC 1234 or 06 A 12345
  const plateRegex = /^[0-9]{2}\s?[A-Z]{1,3}\s?[0-9]{2,4}$/i
  if (!plateRegex.test(plate.trim())) {
    return { isValid: false, error: 'Geçerli bir plaka giriniz (örn: 34 ABC 1234)' }
  }

  return { isValid: true }
}

// Required field validation
export function validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} gereklidir` }
  }

  return { isValid: true }
}

// Year validation
export function validateYear(year: string | number): { isValid: boolean; error?: string } {
  if (!year) {
    return { isValid: false, error: 'Yıl gereklidir' }
  }

  const numYear = typeof year === 'string' ? parseInt(year) : year
  const currentYear = new Date().getFullYear()

  if (isNaN(numYear)) {
    return { isValid: false, error: 'Geçerli bir yıl giriniz' }
  }

  if (numYear < 1900 || numYear > currentYear + 1) {
    return { isValid: false, error: `Yıl 1900 ile ${currentYear + 1} arasında olmalıdır` }
  }

  return { isValid: true }
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('90')) {
    const digits = cleaned.slice(2)
    return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  if (cleaned.startsWith('0')) {
    const digits = cleaned.slice(1)
    return `0 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  return `0 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
}

// Format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
