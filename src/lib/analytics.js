import content from '../data/content.json';

// First-party visitor analytics for the site owner. Builds a lightweight
// browser fingerprint + a stable visitor id and POSTs it to a configurable
// endpoint (content.analytics.endpoint).

const SESSION_FLAG = 'mk-analytics-sent';
const VISITOR_KEY = 'mk-visitor-id';

// FNV-1a 32-bit -> short hex, for a stable per-browser visitor id.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// A canvas raster fingerprint: rendering differs subtly across GPU/driver/OS.
function canvasSignature() {
  try {
    const c = document.createElement('canvas');
    c.width = 200;
    c.height = 40;
    const ctx = c.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 60, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('mk-portfolio-☁️', 2, 4);
    ctx.strokeStyle = 'rgba(120,180,255,0.6)';
    ctx.arc(50, 20, 15, 0, Math.PI * 2);
    ctx.stroke();
    return fnv1a(c.toDataURL());
  } catch {
    return 'na';
  }
}

// GPU vendor/renderer via the debug-renderer-info extension.
function webglInfo() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return { vendor: 'na', renderer: 'na' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : 'na',
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'na',
    };
  } catch {
    return { vendor: 'na', renderer: 'na' };
  }
}

function collect() {
  const nav = navigator;
  const scr = window.screen;
  const gl = webglInfo();

  const fp = {
    userAgent: nav.userAgent,
    language: nav.language,
    languages: (nav.languages || []).join(','),
    platform: nav.platform,
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    deviceMemory: nav.deviceMemory ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    screen: `${scr.width}x${scr.height}x${scr.colorDepth}`,
    pixelRatio: window.devicePixelRatio || 1,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    canvas: canvasSignature(),
    gpuVendor: gl.vendor,
    gpuRenderer: gl.renderer,
    cookiesEnabled: nav.cookieEnabled,
  };

  // Stable id: hash of the durable (non-viewport) signals.
  const stable = [
    fp.userAgent,
    fp.language,
    fp.platform,
    fp.timezone,
    fp.screen,
    fp.canvas,
    fp.gpuRenderer,
  ].join('|');
  let visitorId = fnv1a(stable);
  try {
    visitorId = localStorage.getItem(VISITOR_KEY) || visitorId;
    localStorage.setItem(VISITOR_KEY, visitorId);
  } catch {
    /* storage blocked - fall back to the derived id */
  }

  return {
    visitorId,
    fingerprint: fp,
    page: { url: location.href, path: location.pathname + location.hash, referrer: document.referrer || null },
    ts: new Date().toISOString(),
  };
}

function dntEnabled() {
  const v = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  return v === '1' || v === 'yes' || navigator.globalPrivacyControl === true;
}

// Fire once per session. Safe to call on every load.
export function trackVisit() {
  const endpoint = content.analytics?.endpoint;
  if (!endpoint) return; // disabled until configured
  if (dntEnabled()) return;
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, '1');
  } catch {
    /* if sessionStorage is unavailable, still send once per load */
  }

  const payload = collect();
  try {
    const body = JSON.stringify(payload);
    // sendBeacon survives the page unloading; fall back to keepalive fetch.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(
        () => {}
      );
    }
  } catch {
    /* never let analytics break the page */
  }
}
