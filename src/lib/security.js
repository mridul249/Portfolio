// Decode the base64-obfuscated contact address at runtime. Keeping the address
// encoded in content.json means the plaintext e-mail never appears in the
// shipped JS bundle or the served HTML, so naive harvesters (a regex sweep over
// the bundle / page source) find nothing to scrape. The address is only
// assembled in memory when the Contact section renders.
export function decodeEmail(enc) {
  try {
    return typeof enc === 'string' ? atob(enc) : '';
  } catch {
    return '';
  }
}

// Allow only http(s) links. Anything else — notably `javascript:`, `data:` or
// `vbscript:` URLs that could arrive from the external Articles API — is
// rejected, so a hostile/compromised feed can't smuggle a script URL into an
// href that would fire on click (DOM-based XSS).
export function safeUrl(url) {
  if (typeof url !== 'string' || !url) return undefined;
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : undefined;
  } catch {
    return undefined;
  }
}
