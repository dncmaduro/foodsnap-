/**
 * Save a value to cookies
 * @param name Cookie name
 * @param value Cookie value
 * @param days Number of days until expiration (default: 7)
 */
export function saveToCookies(name: string, value: string, days = 7): void {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

/**
 * Get a value from cookies
 * @param name Cookie name
 * @returns Cookie value or empty string if not found
 */
export function getFromCookies(name: string): string {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return ''
}

/**
 * Remove a cookie
 * @param name Cookie name
 */
export function removeCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`
}
