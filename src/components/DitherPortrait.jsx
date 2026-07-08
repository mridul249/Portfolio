import { useEffect, useRef } from 'react';

// Interactive Bayer-dithered block:
//   1. a grayscale source (photo at /portrait.jpg, else procedural noise)
//   2. a 4x4 Bayer threshold matrix binarizes each cell into dark / lit dots
//   3. the pointer acts as a spotlight: inside its radius the brightness is
//      boosted (revealing dots the threshold would otherwise kill) and lit
//      dots shift from grey toward the cyan accent.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const W = 96;
const H = 128;
const RADIUS = 34; // spotlight radius, in cell units

// Accent #c3fffc vs the resting grey/dark cells.
const LIT = [118, 118, 118];
const CYAN = [195, 255, 252];
const DARK = 16;

function vnoise(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smoothNoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = vnoise(xi, yi);
  const b = vnoise(xi + 1, yi);
  const c = vnoise(xi, yi + 1);
  const d = vnoise(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export default function DitherPortrait() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(W, H);
    const gray = new Float32Array(W * H);
    let raf = 0;
    let mx = -1e3;
    let my = -1e3;

    const render = () => {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          // Spotlight falloff around the cursor (cell space).
          const dx = x - mx;
          const dy = y - my;
          const k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
          const spot = k * k;

          const v = gray[idx] + spot * 0.4; // threshold-radius modulation
          const on = v > (BAYER[y % 4][x % 4] + 0.5) / 16;

          const i = idx * 4;
          if (on) {
            // Lit dot: grey at rest, cyan inside the spotlight.
            img.data[i] = LIT[0] + (CYAN[0] - LIT[0]) * spot;
            img.data[i + 1] = LIT[1] + (CYAN[1] - LIT[1]) * spot;
            img.data[i + 2] = LIT[2] + (CYAN[2] - LIT[2]) * spot;
          } else {
            const d = DARK + spot * 14;
            img.data[i] = d;
            img.data[i + 1] = d;
            img.data[i + 2] = d;
          }
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const schedule = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          render();
        });
      }
    };

    const fillProcedural = () => {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x / W;
          const ny = y / H;
          const blob = Math.max(0, 1 - Math.hypot(nx - 0.62, ny - 0.42) * 1.7);
          const n = smoothNoise(nx * 7, ny * 9) * 0.55 + smoothNoise(nx * 19, ny * 23) * 0.25;
          gray[y * W + x] = Math.min(1, blob * 0.85 + n * 0.45) * 0.75;
        }
      }
      render();
    };

    const image = new Image();
    image.onload = () => {
      const tmp = document.createElement('canvas');
      tmp.width = W;
      tmp.height = H;
      const tctx = tmp.getContext('2d');
      tctx.drawImage(image, 0, 0, W, H);
      const data = tctx.getImageData(0, 0, W, H).data;
      for (let i = 0; i < W * H; i++) {
        gray[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
      }
      render();
    };
    image.onerror = fillProcedural;
    image.src = '/portrait.jpg';

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * W;
      const ny = ((e.clientY - rect.top) / rect.height) * H;
      const inside = nx > -RADIUS && nx < W + RADIUS && ny > -RADIUS && ny < H + RADIUS;
      const wasInside = mx > -1e2;
      if (inside) {
        mx = nx;
        my = ny;
        schedule();
      } else if (wasInside) {
        mx = -1e3;
        my = -1e3;
        schedule(); // one last pass to clear the spotlight
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="h-full w-full object-cover opacity-80"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}
