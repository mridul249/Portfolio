import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Content-Security-Policy for the deployed site (GitHub Pages cannot set HTTP
// headers, so it ships as a <meta> tag). Injected at build time only: the dev
// server needs websockets (HMR) and inline style injection that this policy
// would block.
//
// - script-src 'self'            - only our own bundles; no inline/eval.
// - style-src  'unsafe-inline'   - Google Fonts stylesheet + injected styles
//                                  (low risk; scripts stay locked down).
// - font-src   fonts.gstatic.com - the font files themselves.
// - worker-src blob:             - pixi.js spawns blob-URL workers.
// - img/media  data: blob:       - generated textures (three/pixi canvases).
// - object-src 'none', base-uri 'self', form-action 'none' - no plugins,
//   no <base> hijacking, no form exfiltration (the site has no forms).
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://mricrawler.onrender.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

function injectCsp() {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
            injectTo: 'head-prepend',
          },
        ],
      };
    },
  };
}

// Custom-domain deploy (see CNAME) -> served from root.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), injectCsp()],
});
