import { Component, memo, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Fullscreen Bayer-dithered pixel field:
//  - a grayscale fbm source drifts slowly UPWARD (antigravity)
//  - every cell is binarized through a 4x4 Bayer threshold matrix into
//    dark / lit square dots
//  - the mouse position feeds the shader as a uniform: inside its radius the
//    brightness is boosted (spotlight-reveal - dots the threshold would kill
//    become visible) and lit dots shift from grey toward the cyan accent.
const vertex = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;    // drawing buffer size (device px)
  uniform vec2 uMouse;  // smoothed pointer, device px, y-up (gl_FragCoord space)
  uniform float uPx;    // dither cell size in device px

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  // 2x2 base Bayer cell: [[0,2],[3,1]]
  float b2(vec2 p) {
    return 2.0 * p.x + 3.0 * p.y - 4.0 * p.x * p.y;
  }
  // 4x4 Bayer threshold in [0,1)
  float bayer4(vec2 cell) {
    float hi = b2(mod(cell, 2.0));
    float lo = b2(mod(floor(cell / 2.0), 2.0));
    return (4.0 * hi + lo + 0.5) / 16.0;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 cell = floor(frag / uPx);
    vec2 center = (cell + 0.5) * uPx;

    // Grayscale source: fbm field sliding upward forever, kept mostly dark
    // so the resting page stays near-black with sparse dots.
    vec2 p = center / uRes.y;
    float g = fbm(p * 2.8 + vec2(0.0, -uTime * 0.05));
    g = g * 0.55 - 0.14;

    // Mouse spotlight: gaussian falloff, ~140px radius.
    float d = distance(center, uMouse);
    float k = exp(-(d * d) / (2.0 * 140.0 * 140.0));

    // Threshold-radius modulation around the cursor.
    float v = g + k * 0.62;
    float on = step(bayer4(cell), v);

    // Square dot inside each cell (small gap keeps the matrix readable).
    vec2 f = fract(frag / uPx) - 0.5;
    float dotMask = step(max(abs(f.x), abs(f.y)), 0.34);

    vec3 bg = vec3(0.055);
    vec3 grey = vec3(0.16 + g * 0.2);
    vec3 cyan = vec3(0.765, 1.0, 0.988);
    vec3 lit = mix(grey, cyan, k * k * 0.9 + k * 0.1);

    vec3 col = mix(bg, lit, on * dotMask);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function DitherPlane() {
  const mat = useRef();
  const gl = useThree((s) => s.gl);
  const target = useRef(new THREE.Vector2(-1e4, -1e4));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-1e4, -1e4) },
      uPx: { value: 6 },
    }),
    []
  );

  useEffect(() => {
    const move = (e) => {
      const dpr = gl.getPixelRatio();
      // Pointer relative to the canvas box; gl_FragCoord is y-up from its
      // bottom-left corner.
      const rect = gl.domElement.getBoundingClientRect();
      target.current.set((e.clientX - rect.left) * dpr, (rect.bottom - e.clientY) * dpr);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [gl]);

  useFrame((_, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    const size = gl.getDrawingBufferSize(new THREE.Vector2());
    u.uRes.value.copy(size);
    u.uPx.value = 6 * gl.getPixelRatio();
    // Ease the spotlight toward the pointer for a heavier, deliberate feel.
    u.uMouse.value.lerp(target.current, Math.min(1, delta * 9));
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// A failed WebGL context creation throws from inside the React tree and would
// otherwise take the whole app down - contain it and fall back to the flat bg.
class GlBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Probe WebGL support AT MOST ONCE for the whole page lifetime. Creating a
// context here and forgetting it (as a per-render check would) leaks a real
// WebGL context every render - and this component re-renders on every scroll
// (parent `active` state), so aggressive scrolling used to exhaust the
// browser's context budget ("Too many active WebGL contexts. Oldest context
// will be lost."), killing the live canvas. Cache the result and immediately
// release the probe context.
let _webglOK;
function webglAvailable() {
  if (_webglOK !== undefined) return _webglOK;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    _webglOK = !!gl;
    gl?.getExtension?.('WEBGL_lose_context')?.loseContext();
  } catch {
    _webglOK = false;
  }
  return _webglOK;
}

// Fills its nearest positioned ancestor - mounted inside the hero section
// only, so the pixel field stays behind the name lockup and ends at the fold.
// memo() so parent re-renders (scroll-driven `active` state) never re-render
// this subtree or its <Canvas> - the WebGL context is created exactly once.
function DitherBackground() {
  // Static dark base is plenty under reduced motion or without WebGL.
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !webglAvailable()
  ) {
    return null;
  }
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <GlBoundary>
        <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }} frameloop="always">
          <DitherPlane />
        </Canvas>
      </GlBoundary>
    </div>
  );
}

export default memo(DitherBackground);
