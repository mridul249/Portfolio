// Vendored from @banjobyster/bysters demo (demo/characters/glitch-imp.js).
// "Byte" — a mischievous little CRT gremlin: smaller, quicker, warm cherry-red,
// glowing amber eyes and a cheeky grin.

const COL = {
  bezel: 0xb84a4a,
  bezelHi: 0xd76d64,
  bezelShade: 0x8c3638,
  bezelDetail: 0x6d2a2c,
  screenFrame: 0x2a1416,
  screen: 0x140b0c,
  chest: 0x4c3742,
  chestHi: 0x6d525e,
  chestDark: 0x2c1e26,
  ember: 0xff9a3c,
  legNear: 0xcaa8aa,
  legNearCore: 0x241618,
  legFar: 0x9c8082,
  legFarCore: 0x160e0f,
  pix: [0, 0xc25e2f, 0xff9a3c, 0xffe3bc],
};

const PARAMS = {
  scale: 1.05,
  bodyW: 20,
  bodyH: 12,
  headW: 44,
  headH: 37,
  hipX: [8, 4.5, -4.5, -8],
  hipY: 6,
  footRestX: [10.5, 5.5, -5.5, -10.5],
  standH: 17,
  stepThresholdBase: 8,
  walkSpeed: 330,
  wanderSpeed: 175,
  accel: 2200,
  bodySpring: 215,
  bodyDamp: 23,
  rotSpring: 185,
  rotDamp: 25,
  leanGain: 0.0004,
  leanMax: 0.06,
  headMass: 0.12,
  nav: { hopMaxX: 190, hopMaxY: 125, climbMax: 155, dropMax: 440 },
};

const FACES = {
  idle(f) {
    const gx = Math.round(f.gazeX * 1.5);
    const gy = Math.round(f.gazeY * 0.8);
    for (const c of [3, 9]) {
      f.block(c, 3, 4, 4, 1);
      const ic = Math.min(Math.max(c + 2 + gx, c), c + 2);
      const ir = Math.min(Math.max(4 + gy, 3), 5);
      f.block(ic, ir, 2, 2, 2);
      f.px(ic + 1, ir, 3);
    }
    f.block(6, 9, 4, 1, 2);
    f.px(9, 8, 2);
  },
  grin(f) {
    f.block(2, 2, 4, 1, 2);
    f.block(10, 2, 4, 1, 2);
    f.block(3, 4, 3, 2, 2);
    f.px(4, 4, 3);
    f.block(10, 4, 3, 2, 2);
    f.px(11, 4, 3);
    for (let x = 4; x <= 11; x++) f.px(x, 8, 2);
    f.block(5, 9, 6, 1, 3);
    f.px(4, 7, 2);
    f.px(11, 7, 2);
  },
  mischief(f) {
    FACES.grin(f);
  },
  cackle(f) {
    const open = Math.sin(f.t * 16) > 0 ? 1 : 0;
    for (const c of [3, 10]) {
      f.px(c, 4, 2);
      f.px(c + 1, 3, 3);
      f.px(c + 2, 3, 3);
      f.px(c + 3, 4, 2);
    }
    f.block(5, 6, 6, 2 + open, 2);
    f.block(6, 6, 4, 1, 3);
    const tw = ((f.t * 8) | 0) % 2;
    f.px(1, 2, tw ? 3 : 1);
    f.px(14, 3, tw ? 1 : 3);
  },
  panic(f) {
    const j = ((f.t * 18) | 0) % 2;
    const gx = Math.round(f.gazeX);
    const gy = Math.round(f.gazeY * 0.8);
    for (const c of [2 + j, 10 - j]) {
      f.block(c, 2, 4, 5, 1);
      f.block(Math.min(Math.max(c + 1 + gx, c), c + 2), Math.min(Math.max(3 + gy, 2), 5), 2, 2, 3);
    }
    f.block(7, 9, 2, 1, 2);
  },
  fumble(f) {
    const k = (f.t * 10) | 0;
    f.block(3, 3, 4, 4, 1);
    f.px(4 + (k % 2), 4, 3);
    f.px(5, 5, 3);
    f.block(9, 3, 4, 4, 1);
    f.px(11 - (k % 2), 4, 3);
    f.px(10, 5, 3);
    for (let x = 5; x <= 10; x++) f.px(x, 9 + ((x + k) % 2), 2);
  },
  glitch(f) {
    for (const [c, r] of [
      [3, 3],
      [10, 3],
    ]) {
      for (let y = 0; y < 4; y++) {
        const s = ((Math.random() * 5) | 0) - 2;
        f.block(Math.min(Math.max(c + s, 0), f.w - 3), r + y, 3, 1, Math.random() < 0.7 ? 2 : 1);
      }
    }
    for (let i = 0; i < 12; i++) {
      f.px((Math.random() * f.w) | 0, (Math.random() * f.h) | 0, ((Math.random() * 3) | 0) + 1);
    }
  },
  curious(f) {
    f.eye(3, 3, 4, 5, true);
    f.block(10, 4, 3, 2, 1);
    f.px(11, 3, 2);
    f.block(6, 9, 4, 1, 2);
  },
  happy(f) {
    FACES.grin(f);
  },
  sleepy(f) {
    f.block(3, 5, 4, 1, 1);
    f.block(9, 5, 4, 1, 1);
    f.px(7, 8, 1);
  },
};

export const GLITCH_IMP = {
  name: 'glitch-imp',
  params: PARAMS,
  palette: COL,
  legs: {
    rings: 4,
    near: { core: COL.legNearCore, ring: COL.legNear, width: 5.0 },
    far: { core: COL.legFarCore, ring: COL.legFar, width: 4.4 },
  },
  face: {
    w: 16,
    h: 12,
    animated: ['cackle', 'panic', 'fumble', 'glitch'],
    exprs: FACES,
  },

  buildBody(g) {
    const P = PARAMS;
    g.roundRect(-P.bodyW / 2, -P.bodyH / 2, P.bodyW, P.bodyH, 5).fill(COL.chest);
    g.roundRect(-P.bodyW / 2 + 2.6, -P.bodyH / 2 + 1.3, P.bodyW - 5.2, 3.6, 2).fill(COL.chestHi);
    g.roundRect(-4.5, -1.6, 9, 5, 1.5).fill(COL.chestDark);
    g.circle(0, 1, 2.4).fill({ color: COL.ember, alpha: 0.3 });
    g.circle(0, 1, 1.4).fill(COL.ember);
  },

  buildHead(g) {
    const w = PARAMS.headW;
    const h = PARAMS.headH;
    g.roundRect(-w / 2 - 3, -6, 6, 12, 3).fill(COL.bezelShade);
    g.roundRect(w / 2 - 3, -6, 6, 12, 3).fill(COL.bezelShade);
    g.roundRect(-w / 2 + 1.8, -h / 2 + 2.4, w, h, 10).fill(COL.bezelShade);
    g.roundRect(-w / 2, -h / 2, w, h, 10).fill(COL.bezel);
    g.roundRect(-w / 2 + 6, -h / 2 + 2.6, w - 12, 3.6, 2).fill(COL.bezelHi);
    g.roundRect(-w / 2 + 5.5, -h / 2 + 5.2, w - 11, h - 13.5, 7).fill(COL.screenFrame);
    g.roundRect(-w / 2 + 7.5, -h / 2 + 7.2, w - 15, h - 17.5, 5).fill(COL.screen);
    g.circle(-w / 2 + 10, h / 2 - 4.6, 3).fill({ color: COL.ember, alpha: 0.32 });
    g.circle(-w / 2 + 10, h / 2 - 4.6, 1.7).fill(COL.ember);
    g.circle(w / 2 - 10, h / 2 - 4.6, 1.6).fill(COL.bezelDetail);
    g.circle(w / 2 - 15, h / 2 - 4.6, 1.6).fill(COL.bezelDetail);
    const sw = w - 15;
    const sh = h - 17.5;
    return { x: -sw / 2, y: -h / 2 + 7.2, w: sw, h: sh };
  },

  buildHeadGloss(g, box) {
    const { x: gx, y: gy, w: sw, h: sh } = box;
    g.poly([
      { x: gx + sw * 0.5, y: gy },
      { x: gx + sw * 0.68, y: gy },
      { x: gx + sw * 0.32, y: gy + sh },
      { x: gx + sw * 0.14, y: gy + sh },
    ]).fill({ color: 0xffffff, alpha: 0.06 });
  },
};
