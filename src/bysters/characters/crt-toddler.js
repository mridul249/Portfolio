// Vendored from @banjobyster/bysters demo (demo/characters/crt-toddler.js).
// "Pip" - a Pixar-style CRT toddler: beige-gray monitor head, green pixel face,
// small blue chest, four ring-armored accordion legs. Character definitions are
// consumer-supplied assets; the engine itself is character-agnostic.

const COL = {
  bezel: 0xd3d7dc,
  bezelShade: 0xa8aeb7,
  bezelDetail: 0x8f969f,
  screenFrame: 0x394049,
  screen: 0x0b100d,
  blue: 0x5b9fe3,
  blueHi: 0x7ab5ee,
  blueDark: 0x2f5d8f,
  legNear: 0xc6cbd2,
  legNearCore: 0x2a2e33,
  legFar: 0x878e97,
  legFarCore: 0x1d2126,
  orange: 0xf08c3c,
  pix: [0, 0x3f8f55, 0x7de88a, 0xe2ffe4],
};

const PARAMS = {
  scale: 1.4,
  bodyW: 26,
  bodyH: 16,
  headW: 70,
  headH: 56,
  hipX: [10, 5.5, -5.5, -10],
  hipY: 7,
  footRestX: [13, 7, -7, -13],
  standH: 22,
  stepThresholdBase: 14,
  walkSpeed: 165,
  wanderSpeed: 95,
  accel: 720,
  bodySpring: 165,
  bodyDamp: 21,
  rotSpring: 140,
  rotDamp: 23,
  leanGain: 0.00034,
  leanMax: 0.052,
  headMass: 1.15,
};

const FACES = {
  idle(f) {
    f.eye(3, 3, 3, 4, true);
    f.eye(10, 3, 3, 4, true);
    f.block(7, 9, 2, 1, 1);
  },
  curious(f) {
    f.eye(2, 2, 4, 5, true);
    f.block(10, 5, 3, 2, 1);
    f.px(Math.min(Math.max(11 + Math.round(f.gazeX), 10), 12), 6, 2);
    f.block(10, 2, 3, 1, 1);
  },
  happy(f) {
    for (const c of [3, 10]) {
      f.px(c, 5, 2);
      f.px(c + 1, 4, 2);
      f.px(c + 2, 4, 2);
      f.px(c + 3, 5, 2);
    }
    f.px(5, 8, 2);
    f.block(6, 9, 4, 1, 2);
    f.px(10, 8, 2);
  },
  sync(f) {
    const c = Math.round((Math.sin(f.t * 5) * 0.5 + 0.5) * (f.w - 3));
    f.block(c, 4, 3, 4, 2);
    f.px(c + 1, 5, 3);
  },
  glitch(f) {
    for (const [c, r] of [
      [3, 3],
      [10, 3],
    ]) {
      for (let y = 0; y < 4; y++) {
        const shift = ((Math.random() * 5) | 0) - 2;
        f.block(Math.min(Math.max(c + shift, 0), f.w - 3), r + y, 3, 1, Math.random() < 0.7 ? 2 : 1);
      }
    }
    for (let i = 0; i < 14; i++) {
      f.px((Math.random() * f.w) | 0, (Math.random() * f.h) | 0, ((Math.random() * 3) | 0) + 1);
    }
  },
  sleepy(f) {
    f.block(3, 5, 3, 2, 1);
    f.block(10, 5, 3, 2, 1);
  },
  eager(f) {
    f.eye(2, 2, 4, 5, true);
    f.eye(10, 2, 4, 5, true);
    f.block(6, 8, 4, 2, 2);
    f.block(7, 9, 2, 1, 3);
  },
  vr(f) {
    f.block(1, 2, 14, 5, 1);
    f.block(2, 3, 12, 3, 2);
    f.px(0, 4, 1);
    f.px(15, 4, 1);
    const k = (f.t * 7) | 0;
    f.px(3 + ((k * 5) % 9), 3 + (k % 3), 3);
    f.px(12 - ((k * 3) % 9), 4, 3);
    if (Math.sin(f.t * 2.6) > 0.4) {
      f.block(6, 9, 4, 2, 2);
      f.block(7, 9, 2, 1, 3);
    } else {
      f.block(6, 9, 3, 1, 2);
    }
  },
  phone(f) {
    f.block(3, 2, 3, 3, 1);
    f.px(5, 4, 3);
    f.block(10, 2, 3, 3, 1);
    f.px(10, 4, 3);
    f.block(6, 7, 4, 5, 2);
    f.block(7, 8, 2, 3, 1);
    const k = (f.t * 2.5) | 0;
    f.px(7, 8 + (k % 3), 3);
    f.px(8, 8 + ((k + 1) % 3), 2);
  },
  surprise(f) {
    const gx = Math.round(f.gazeX);
    const gy = Math.round(f.gazeY * 0.8);
    for (const c of [2, 10]) {
      f.block(c, 2, 4, 4, 1);
      f.px(Math.min(Math.max(c + 1 + gx, c), c + 3), Math.min(Math.max(3 + gy, 2), 5), 3);
    }
    f.block(7, 8, 2, 2, 2);
  },
  puff(f) {
    f.block(3, 4, 3, 1, 1);
    f.block(10, 4, 3, 1, 1);
    const pant = Math.sin(f.t * 3.2) > 0 ? 1 : 0;
    f.block(6, 8, 4, 1 + pant, 1);
    const drop = ((f.t * 5) | 0) % 4;
    f.px(14, 1 + drop, 3);
  },
  excited(f) {
    const b = Math.sin(f.t * 10) > 0 ? 1 : 0;
    for (const c of [3, 10]) {
      f.px(c, 5 - b, 2);
      f.px(c + 1, 4 - b, 3);
      f.px(c + 2, 4 - b, 3);
      f.px(c + 3, 5 - b, 2);
    }
    f.block(6, 8, 4, 2, 2);
    f.block(7, 8, 2, 1, 3);
    const tw = ((f.t * 6) | 0) % 2;
    f.px(1, 2, tw ? 3 : 1);
    f.px(14, 6, tw ? 1 : 3);
    f.px(13, 1, tw ? 2 : 1);
  },
  suspicious(f) {
    const sl = Math.round(f.gazeX * 1.6);
    for (const c of [3, 10]) {
      f.block(c, 4, 3, 2, 1);
      f.px(Math.min(Math.max(c + 1 + sl, c), c + 2), 5, 3);
    }
    f.block(6, 9, 3, 1, 1);
  },
  wink(f) {
    f.eye(3, 3, 3, 4, true);
    f.px(9, 4, 1);
    f.block(10, 5, 3, 1, 2);
    f.px(13, 4, 1);
    f.px(5, 8, 2);
    f.block(6, 9, 4, 1, 2);
    f.px(10, 8, 2);
  },
};

export const CRT_TODDLER = {
  name: 'crt-toddler',
  params: PARAMS,
  palette: COL,
  legs: {
    rings: 4,
    near: { core: COL.legNearCore, ring: COL.legNear, width: 5.4 },
    far: { core: COL.legFarCore, ring: COL.legFar, width: 4.8 },
  },
  face: {
    w: 16,
    h: 12,
    animated: ['glitch', 'sync', 'excited', 'suspicious', 'puff', 'vr', 'phone'],
    exprs: FACES,
  },

  buildBody(g) {
    const P = PARAMS;
    g.roundRect(-P.bodyW / 2, -P.bodyH / 2, P.bodyW, P.bodyH, 5).fill(COL.blue);
    g.roundRect(-P.bodyW / 2 + 2.8, -P.bodyH / 2 + 1.4, P.bodyW - 5.6, 4.2, 2).fill(COL.blueHi);
    g.roundRect(-5, -1.5, 10, 5.5, 1.5).fill(COL.blueDark);
  },

  buildHead(g) {
    const w = PARAMS.headW;
    const h = PARAMS.headH;
    g.roundRect(-w / 2 + 1.7, -h / 2 + 2.5, w, h, 10).fill(COL.bezelShade);
    g.roundRect(-w / 2, -h / 2, w, h, 10).fill(COL.bezel);
    g.roundRect(-w / 2 - 4, -8.5, 6.5, 17, 2).fill(COL.bezelShade);
    g.roundRect(-w / 2 + 5.5, -h / 2 + 4.2, w - 11, h - 13.5, 7).fill(COL.screenFrame);
    g.roundRect(-w / 2 + 7.5, -h / 2 + 6.2, w - 15, h - 17.5, 5).fill(COL.screen);
    g.circle(w / 2 - 10, h / 2 - 4.6, 1.8).fill(COL.bezelDetail);
    g.circle(w / 2 - 16, h / 2 - 4.6, 1.8).fill(COL.bezelDetail);
    g.circle(-w / 2 + 10, h / 2 - 4.6, 3).fill({ color: COL.orange, alpha: 0.3 });
    g.circle(-w / 2 + 10, h / 2 - 4.6, 1.7).fill(COL.orange);
    const sw = w - 15;
    const sh = h - 17.5;
    return { x: -sw / 2, y: -h / 2 + 6.2, w: sw, h: sh };
  },

  buildHeadGloss(g, box) {
    const { x: gx, y: gy, w: sw, h: sh } = box;
    g.poly([
      { x: gx + sw * 0.52, y: gy },
      { x: gx + sw * 0.72, y: gy },
      { x: gx + sw * 0.34, y: gy + sh },
      { x: gx + sw * 0.14, y: gy + sh },
    ]).fill({ color: 0xffffff, alpha: 0.07 });
    g.poly([
      { x: gx + sw * 0.8, y: gy },
      { x: gx + sw * 0.87, y: gy },
      { x: gx + sw * 0.62, y: gy + sh },
      { x: gx + sw * 0.55, y: gy + sh },
    ]).fill({ color: 0xffffff, alpha: 0.05 });
  },
};
