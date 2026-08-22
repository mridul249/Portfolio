// Decode the base64-obfuscated contact address at runtime. Keeping the address
// encoded means the plaintext e-mail never appears in the
// shipped JS bundle or the served HTML, so naive harvesters find nothing to scrape. The address is only
// assembled in memory when the Contact section renders.
export function decodeEmail(enc) {
  try {
    return typeof enc === 'string' ? atob(enc) : '';
  } catch {
    return '';
  }
}

export function safeUrl(url) {
  if (typeof url !== 'string' || !url) return undefined;
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : undefined;
  } catch {
    return undefined;
  }
}
