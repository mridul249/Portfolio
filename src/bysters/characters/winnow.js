// Vendored from @banjobyster/bysters demo (demo/characters/winnow.js).
// "Winnow" - a faint, tall-narrow portable-TV ghost byster that drifts on low
// gravity, hangs under surfaces, and shies away from the cursor.

const COL = {
  shell: 0xcfd8d4,
  shellHi: 0xe6efe9,
  shellShade: 0x9fb0aa,
  screenFrame: 0x2a3a38,
  screen: 0x0d1614,
  chest: 0x8b9a96,
  antenna: 0x9aa6b8,
  bloom: 0x9fe6da,
  legNear: 0x7fd6cc,
  legNearCore: 0x2b524e,
  legFar: 0x5aa7a0,
  legFarCore: 0x1c3835,
  pix: [0, 0x3f7d75, 0x8fded0, 0xe8fff9],
};

const PARAMS = {
  scale: 1.1,
  bodyW: 18,
  bodyH: 12,
  headW: 40,
  headH: 48,
  hipX: [8, 4.5, -4.5, -8],
  hipY: 6,
  footRestX: [10, 5.5, -5.5, -10],
  standH: 24,
  stepThresholdBase: 10,
  walkSpeed: 90,
  wanderSpeed: 60,
  accel: 300,
  bodySpring: 110,
  bodyDamp: 16,
  rotSpring: 90,
  rotDamp: 18,
  leanGain: 0.0002,
  leanMax: 0.04,
  headMass: 0.4,
};

const FACES = {
  idle(f) {
    const roll = ((f.t * 1.4) | 0) % f.h;
    f.block(0, roll, f.w, 1, 1);
    for (let i = 0; i < 5; i++) f.px((Math.random() * f.w) | 0, (Math.random() * f.h) | 0, 1);
    for (let i = 0; i < 2; i++) f.px((Math.random() * f.w) | 0, (Math.random() * f.h) | 0, 3);
    f.block(4, 5, 2, 2, 1);
    f.block(10, 5, 2, 2, 1);
  },
  peek(f) {
    const gx = Math.round(f.gazeX * 1.6);
    const pr = Math.min(Math.max(4 + Math.round(f.gazeY * 0.8), 3), 5);
    f.block(2, 3, 4, 4, 2);
    f.block(Math.min(Math.max(3 + gx, 2), 4), pr, 2, 2, 0);
    f.px(6, 5, 1);
    f.block(10, 3, 4, 4, 2);
    f.block(Math.min(Math.max(11 + gx, 10), 12), pr, 2, 2, 0);
    f.px(14, 5, 1);
    f.block(6, 9, 4, 1, 2);
  },
  lookaway(f) {
    const band = f.h - 1 - (((f.t * 4) | 0) % f.h);
    f.block(0, band, f.w, 1, 2);
    const g = Math.round(f.gazeX * 2);
    f.block(3, 5, 3, 2, 1);
    f.block(Math.min(Math.max(4 + g, 3), 4), 5, 2, 2, 3);
    f.block(10, 5, 3, 2, 1);
    f.block(Math.min(Math.max(11 + g, 10), 11), 5, 2, 2, 3);
  },
  dream(f) {
    const v = Math.sin(f.t * 1.5) > 0.2 ? 2 : 1;
    f.block(5, 4, 6, 1, 1);
    f.block(5, 5, 6, 1, v);
    f.block(5, 6, 6, 1, 1);
  },
  dim(f) {
    f.block(0, Math.floor(f.h / 2), f.w, 1, 2);
    const on = ((f.t * 2) | 0) % 2;
    if (on) {
      f.px(4, 4, 1);
      f.px(11, 4, 1);
    }
  },
  curious(f) {
    FACES.peek(f);
  },
  happy(f) {
    FACES.peek(f);
  },
  sleepy(f) {
    FACES.dim(f);
  },
  glitch(f) {
    FACES.idle(f);
  },
};

export const WINNOW = {
  name: 'winnow',
  params: PARAMS,
  palette: COL,
  legs: {
    rings: 4,
    near: { core: COL.legNearCore, ring: COL.legNear, width: 3.4 },
    far: { core: COL.legFarCore, ring: COL.legFar, width: 3.0 },
  },
  face: {
    w: 16,
    h: 12,
    animated: ['idle', 'lookaway', 'dim', 'dream', 'peek'],
    exprs: FACES,
  },

  buildBody(g) {
    const P = PARAMS;
    g.circle(0, 0, P.bodyW * 0.65).fill({ color: COL.bloom, alpha: 0.06 });
    g.roundRect(-P.bodyW / 2, -P.bodyH / 2, P.bodyW, P.bodyH, 4).fill(COL.chest);
    g.roundRect(-P.bodyW / 2 + 2, -P.bodyH / 2 + 1, P.bodyW - 4, 2.4, 1.2).fill(COL.shellHi);
  },

  buildHead(g) {
    const w = PARAMS.headW;
    const h = PARAMS.headH;
    g.circle(0, -2, w * 0.72).fill({ color: COL.bloom, alpha: 0.05 });
    g.circle(0, -2, w * 0.55).fill({ color: COL.bloom, alpha: 0.05 });
    g.moveTo(-w / 2 + 6, -h / 2 + 1).lineTo(-w / 2 - 3, -h / 2 - 16).stroke({ width: 1.6, color: COL.antenna });
    g.circle(-w / 2 - 3, -h / 2 - 17, 2.4).stroke({ width: 1.2, color: COL.antenna });
    g.roundRect(-w / 2 + 2, -h / 2 + 2.5, w, h, 10).fill(COL.shellShade);
    g.roundRect(-w / 2, -h / 2, w, h, 10).fill(COL.shell);
    g.roundRect(-w / 2 + 5, -h / 2 + 3, w - 10, 3, 1.5).fill(COL.shellHi);

    const sw = 26;
    const sh = 26;
    const sy = -h / 2 + 8;
    g.roundRect(-sw / 2 - 2.5, sy - 2.5, sw + 5, sh + 5, 6).fill(COL.screenFrame);
    g.roundRect(-sw / 2, sy, sw, sh, 4).fill(COL.screen);
    return { x: -sw / 2, y: sy, w: sw, h: sh };
  },

  buildHeadGloss(g, box) {
    const { x: gx, y: gy, w: sw, h: sh } = box;
    g.poly([
      { x: gx + sw * 0.5, y: gy },
      { x: gx + sw * 0.66, y: gy },
      { x: gx + sw * 0.3, y: gy + sh },
      { x: gx + sw * 0.14, y: gy + sh },
    ]).fill({ color: 0xffffff, alpha: 0.05 });
    for (let i = 1; i < 4; i++) g.rect(gx, gy + (sh * i) / 4, sw, 0.5).fill({ color: 0xffffff, alpha: 0.03 });
  },
};
