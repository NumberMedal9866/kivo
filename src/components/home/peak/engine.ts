/**
 * Deterministic crowd simulations for the peak-hour compare section.
 *
 * Two scenes share one engine: a café where one till takes every order (a
 * queue forms and breathes), and the same café where three kiosks take
 * orders in parallel (nobody waits). Every journey is computed up front,
 * compiled to CSS @keyframes and played as pure CSS animations — JS runs
 * only at build time (and for the live counters, which read the same
 * schedule).
 *
 * Ported from the owner-supplied animation prototypes; geometry and timing
 * are kept verbatim so the choreography (gated queue shuffle, just-in-time
 * trays, doors that answer to walkers) survives intact. The kiosk scene's
 * arrival schedule is densified — with parallel ordering the same room
 * absorbs a busier stream, which is exactly the story the counters tell.
 *
 * Stage space is a fixed 900×1200 plan; components scale it to fit.
 */

export const SCENE_W = 900;
export const SCENE_H = 1200;

export type SimPoint = { x: number; y: number; o: number; rot: number; tray: number };
type Waypoint = { t: number } & SimPoint;

export type SimAgent = {
  /** Animation delay in sim-seconds (negative: the loop is already running). */
  delay: number;
  body: string;
  hair: string;
  move: string;
  face: string;
  tray: string;
};

export type Sim = {
  loopT: number;
  css: string;
  agents: SimAgent[];
  /** Keyframe names for ambient elements, keyed by logical id. */
  ambient: Record<string, string>;
  /** Global sim-times (0..loopT) at which a tray is handed over — one per guest served. */
  serveEvents: number[];
  /** Steady-state guests served per sim-minute. */
  ratePerMinute: number;
  /** Interpolated state of agent `i` at global sim-time `gt` (for snapshots + queue). */
  posAt: (i: number, gt: number) => SimPoint;
  agentCount: number;
  /** Cashier scene only: how many guests stand in the lane at global sim-time `gt`. */
  queueAt?: (gt: number) => number;
  /** A representative moment for static (SSR first-paint) snapshots. */
  snapshotT: number;
};

/** Guest palette: accent-coloured bodies use the scene accent variable. */
const ACCENT = "var(--pk-accent)";
const BODY = [
  ACCENT,
  "#8a93a6",
  "#c98b6b",
  "#7f9c8a",
  ACCENT,
  "#9488ad",
  "#b3a488",
  ACCENT,
  "#6d7480",
  "#8a93a6",
  ACCENT,
  "#c98b6b",
];
const HAIR = [
  "#20304f",
  "#3a3f4a",
  "#5a3a28",
  "#2f4238",
  "#20304f",
  "#3a3350",
  "#4a4230",
  "#20304f",
  "#2c3138",
  "#3a3f4a",
  "#20304f",
  "#5a3a28",
];

const dist = (a: number, b: number, c: number, d: number) => Math.hypot(c - a, d - b);

/**
 * Sample a scalar function of loop time into sparse keyframes: points are
 * kept only where the value changes, so long idle stretches stay cheap.
 */
function sampleKF(
  fn: (t: number) => number,
  fmt: (v: number) => string,
  tol: number,
  dt: number,
  loopT: number,
): string {
  const S: { p: number; v: number }[] = [];
  for (let t = 0; t <= loopT + 1e-9; t += dt) S.push({ p: (t / loopT) * 100, v: fn(t % loopT) });
  let out = "";
  for (let k = 0; k < S.length; k++) {
    const cur = S[k]!;
    const prev = S[k - 1];
    const next = S[k + 1];
    const keep = !prev || !next || Math.abs(cur.v - prev.v) > tol || Math.abs(cur.v - next.v) > tol;
    if (keep) out += cur.p.toFixed(4) + "%{" + fmt(cur.v) + "}";
  }
  return out;
}

function interpolate(wp: Waypoint[], rel: number): SimPoint {
  let j = 0;
  while (j < wp.length - 1 && !(rel >= wp[j]!.t && rel <= wp[j + 1]!.t)) j++;
  const a = wp[j]!;
  const b = wp[j + 1] ?? a;
  const f = (rel - a.t) / (b.t - a.t || 1);
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    o: a.o + (b.o - a.o) * f,
    rot: a.rot + (b.rot - a.rot) * f,
    tray: a.tray + (b.tray - a.tray) * f,
  };
}

function agentKeyframes(prefix: string, i: number, wp: Waypoint[], loopT: number): string {
  const pct = (v: number) => ((v / loopT) * 100).toFixed(4) + "%";
  let css = `@keyframes ${prefix}m${i}{`;
  css += wp
    .map(
      (k) =>
        `${pct(k.t)}{transform:translate(${k.x.toFixed(1)}px,${k.y.toFixed(1)}px);opacity:${k.o}}`,
    )
    .join("");
  css += `}@keyframes ${prefix}f${i}{`;
  css += wp.map((k) => `${pct(k.t)}{transform:rotate(${k.rot}deg)}`).join("");
  css += `}@keyframes ${prefix}t${i}{`;
  css += wp.map((k) => `${pct(k.t)}{opacity:${k.tray}}`).join("");
  css += "}";
  return css;
}

/** Signed offset from a scheduled event time, wrapped into ±half a loop. */
const wrapRel = (t: number, e: number, loopT: number) => {
  const d = (((t - e) % loopT) + loopT) % loopT;
  return d > loopT / 2 ? d - loopT : d;
};

/* ======================================================================
   Scene 1 — one till. Irregular arrivals against a rigid service cadence
   make the queue grow and shrink; the gated shuffle keeps it single-file.
   ====================================================================== */

export function buildCashierSim(prefix: string): Sim {
  const ORDER_TIME = 12;
  const EAT = 18;
  const WALK_SPEED = 110;
  const ARRIVAL_FRAC = [
    1 / 24,
    1 / 9,
    5 / 36,
    1 / 6,
    5 / 24,
    3 / 8,
    13 / 24,
    11 / 18,
    91 / 144,
    47 / 72,
    19 / 24,
    23 / 24,
  ];
  const N = ARRIVAL_FRAC.length;
  const LOOP_T = N * ORDER_TIME;
  const PHASE = 3.5 * ORDER_TIME;
  const ARRIVALS = ARRIVAL_FRAC.map((f) => f * LOOP_T);
  const GATE = 2.6,
    DWELL = 1.4,
    ROT = 1.2;

  const doorY = 1150,
    ENTER_X = 496,
    EXIT_X = 404,
    INY = 1080;
  const laneX = 430,
    REG_Y = 310,
    SLOT = 100;
  const laneY = (s: number) => REG_Y + s * SLOT;
  const STEP = { x: 530, y: 350 };
  const PK = { x: 720, y: 316 };
  const RC = 545,
    LC = 345,
    CONC = 940;
  const OUTY = 1020;

  const tables = {
    A: { x: 120, y: 470, w: 120, h: 100 },
    B: { x: 140, y: 760, w: 140, h: 120 },
    C: { x: 650, y: 470, w: 120, h: 100 },
    D: { x: 620, y: 760, w: 140, h: 120 },
  };
  const faceCentre = (
    sx: number,
    sy: number,
    T: { x: number; y: number; w: number; h: number },
  ) => {
    const cx = T.x + T.w / 2,
      cy = T.y + T.h / 2;
    return Math.round((Math.atan2(cx - sx, -(cy - sy)) * 180) / Math.PI);
  };
  type XY = [number, number];
  const RIN: XY[] = [[RC, 400]];
  const LIN: XY[] = [
    [RC, 400],
    [RC, CONC],
    [LC, CONC],
  ];
  const mk = (t: keyof typeof tables, sx: number, sy: number, inV: XY[], outV: XY[]) => ({
    x: sx,
    y: sy,
    rot: faceCentre(sx, sy, tables[t]),
    in: inV,
    out: outV,
  });
  const seats = [
    mk(
      "C",
      710,
      449,
      [],
      [
        [RC, 449],
        [RC, OUTY],
      ],
    ),
    mk(
      "C",
      710,
      591,
      [
        [820, 400],
        [820, 591],
      ],
      [
        [RC, 591],
        [RC, OUTY],
      ],
    ),
    mk(
      "D",
      690,
      739,
      [...RIN, [RC, 739]],
      [
        [RC, 739],
        [RC, OUTY],
      ],
    ),
    mk(
      "D",
      599,
      820,
      [...RIN, [RC, 820]],
      [
        [RC, 820],
        [RC, OUTY],
      ],
    ),
    mk("D", 690, 901, [...RIN, [RC, CONC], [690, CONC]], [[690, OUTY]]),
    mk(
      "D",
      781,
      820,
      [
        [820, 400],
        [820, 820],
      ],
      [[781, OUTY]],
    ),
    mk(
      "A",
      180,
      449,
      [...LIN, [LC, 449]],
      [
        [LC, 449],
        [LC, OUTY],
      ],
    ),
    mk(
      "A",
      180,
      591,
      [...LIN, [LC, 591]],
      [
        [LC, 591],
        [LC, OUTY],
      ],
    ),
    mk(
      "B",
      210,
      739,
      [...LIN, [LC, 739]],
      [
        [LC, 739],
        [LC, OUTY],
      ],
    ),
    mk(
      "B",
      301,
      820,
      [...LIN, [LC, 820]],
      [
        [LC, 820],
        [LC, OUTY],
      ],
    ),
    mk("B", 119, 820, [...LIN, [LC, CONC], [119, CONC]], [[119, OUTY]]),
    mk("B", 210, 901, [...LIN, [LC, CONC], [210, CONC]], [[210, OUTY]]),
  ];
  const seatOf = [4, 9, 11, 0, 3, 6, 1, 10, 8, 2, 5, 7];

  const journeys: Waypoint[][] = [];
  const pArrive: number[] = [];

  // Longest journey excluding the meal; trim the meal so every journey
  // still finishes inside one loop.
  let worst = 0;
  for (let a = 0; a < N; a++) {
    const S = seats[seatOf[a]!]!;
    const path: XY[] = [
      [ENTER_X, INY],
      [laneX, laneY(0)],
      [STEP.x, STEP.y],
      [PK.x, PK.y],
      ...S.in,
      [S.x, S.y],
      ...S.out,
      [EXIT_X, INY],
      [EXIT_X, doorY],
    ];
    let d = dist(ENTER_X, doorY, path[0]![0], path[0]![1]);
    for (let i = 1; i < path.length; i++)
      d += dist(path[i - 1]![0], path[i - 1]![1], path[i]![0], path[i]![1]);
    worst = Math.max(worst, PHASE + a * ORDER_TIME + ORDER_TIME - ARRIVALS[a]! + d / WALK_SPEED);
  }
  const EAT_T = Math.max(4, Math.min(EAT, LOOP_T - worst - DWELL - 2 * ROT - 6));

  for (let a = 0; a < N; a++) {
    const arr = ARRIVALS[a]!;
    const S = seats[seatOf[a]!]!;
    const orderEnd = PHASE + a * ORDER_TIME + ORDER_TIME - arr; // agent-local
    const wp: Waypoint[] = [];
    let t = 0,
      cx = ENTER_X,
      cy = doorY;
    const at = (x: number, y: number, o: number, rot: number, tray: number) => {
      wp.push({ t, x, y, o, rot, tray });
      cx = x;
      cy = y;
    };
    const leg = (x: number, y: number, o: number, rot: number, tray: number) => {
      t += dist(cx, cy, x, y) / WALK_SPEED;
      at(x, y, o, rot, tray);
    };

    at(ENTER_X, doorY, 0, 0, 0);
    leg(ENTER_X, INY, 1, 0, 0);
    // Join at the back of the line, reading the slot off the same gated
    // clock the shuffle uses; walk time depends on the slot, so solve the
    // two together by iteration.
    const walked = t;
    const STEP_T = SLOT / WALK_SPEED;
    let frontAtJoin = 0,
      slot = 0;
    for (let it = 0; it < 4; it++) {
      const reach = arr + walked + dist(ENTER_X, INY, laneX, laneY(slot)) / WALK_SPEED;
      frontAtJoin = Math.floor((reach - PHASE - GATE - STEP_T) / ORDER_TIME);
      slot = Math.max(0, a - frontAtJoin);
    }
    leg(laneX, laneY(slot), 1, 0, 0);
    // Gated shuffle: advance one slot only once the person ahead is clear.
    for (let k = frontAtJoin + 1; k <= a; k++) {
      const trig = PHASE + k * ORDER_TIME + GATE - arr;
      t = Math.max(t, trig);
      at(laneX, laneY(slot), 1, 0, 0);
      slot -= 1;
      leg(laneX, laneY(slot), 1, 0, 0);
    }
    t = Math.max(t, orderEnd);
    at(laneX, REG_Y, 1, 0, 0);
    leg(STEP.x, STEP.y, 1, 0, 0);
    leg(PK.x, PK.y, 1, 0, 0);
    pArrive[a] = t;
    t += DWELL - 0.35;
    at(PK.x, PK.y, 1, 0, 0);
    t += 0.35;
    at(PK.x, PK.y, 1, 0, 1);
    for (const v of S.in) leg(v[0], v[1], 1, 0, 1);
    leg(S.x, S.y, 1, 0, 1);
    t += ROT;
    at(S.x, S.y, 1, S.rot, 1);
    t += EAT_T;
    at(S.x, S.y, 1, S.rot, 1);
    t += ROT;
    at(S.x, S.y, 1, 0, 0);
    for (const v of S.out) leg(v[0], v[1], 1, 0, 0);
    leg(EXIT_X, INY, 1, 0, 0);
    leg(EXIT_X, doorY, 0, 0, 0);
    t = LOOP_T;
    at(ENTER_X, doorY, 0, 0, 0);
    journeys.push(wp);
  }

  let css = "";
  const agents: SimAgent[] = [];
  for (let a = 0; a < N; a++) {
    css += agentKeyframes(prefix, a, journeys[a]!, LOOP_T);
    agents.push({
      delay: ARRIVALS[a]! - LOOP_T,
      body: BODY[a % BODY.length]!,
      hair: HAIR[a % HAIR.length]!,
      move: `${prefix}m${a}`,
      face: `${prefix}f${a}`,
      tray: `${prefix}t${a}`,
    });
  }

  const posAt = (a: number, gt: number): SimPoint =>
    interpolate(journeys[a]!, (((gt - ARRIVALS[a]!) % LOOP_T) + LOOP_T) % LOOP_T);

  const pkEvents = pArrive.map((v, a) => (ARRIVALS[a]! + v) % LOOP_T);
  const orderEvents = journeys.map((_, a) => (PHASE + a * ORDER_TIME) % LOOP_T);

  const ping = (t: number) => {
    for (const e of orderEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= 0 && r <= ORDER_TIME) return 0.55;
    }
    return 0.16;
  };
  css += `@keyframes ${prefix}ping{${sampleKF(ping, (v) => "opacity:" + v, 0.01, 0.3, LOOP_T)}}`;
  const cashierBob = (t: number) => {
    for (const e of orderEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= 1 && r <= 3) return 5 * (1 - Math.abs(r - 2));
    }
    return 0;
  };
  css += `@keyframes ${prefix}cash{${sampleKF(cashierBob, (v) => `transform:translateY(${v.toFixed(1)}px)`, 0.3, 0.2, LOOP_T)}}`;

  // Tray slides out and lands just as the customer reaches the counter.
  const shelfY = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -1.6 && r <= -0.25) return -60 * (1 - (r + 1.6) / 1.35);
      if (r > -0.25 && r <= DWELL + 0.3) return 0;
    }
    return -60;
  };
  const shelfOp = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -1.6 && r < -1.3) return (r + 1.6) / 0.3;
      if (r >= -1.3 && r <= DWELL - 0.35) return 1;
      if (r > DWELL - 0.35 && r <= DWELL) return 1 - (r - (DWELL - 0.35)) / 0.35;
    }
    return 0;
  };
  const serverY = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -2.1 && r <= -0.7) return 7 * (1 - Math.abs((r + 1.4) / 0.7));
    }
    return 0;
  };
  css += `@keyframes ${prefix}shm{${sampleKF(shelfY, (v) => `transform:translateY(${v.toFixed(1)}px)`, 1, 0.2, LOOP_T)}}`;
  css += `@keyframes ${prefix}shf{${sampleKF(shelfOp, (v) => "opacity:" + v.toFixed(2), 0.05, 0.15, LOOP_T)}}`;
  css += `@keyframes ${prefix}srv{${sampleKF(serverY, (v) => `transform:translateY(${v.toFixed(1)}px)`, 0.4, 0.2, LOOP_T)}}`;

  // Each door panel answers to its own half of the doorway.
  const openNear = (lane: number) => (t: number) => {
    let m = 0;
    for (let a = 0; a < N; a++) {
      const p = posAt(a, t);
      if (p.o > 0.05 && Math.abs(p.x - lane) < 40)
        m = Math.max(m, Math.min(1, Math.max(0, (170 - Math.abs(p.y - doorY)) / 100)));
    }
    return m;
  };
  css += `@keyframes ${prefix}dl{${sampleKF(openNear(EXIT_X), (v) => `transform:translateX(${(-46 * v).toFixed(1)}px)`, 0.03, 0.3, LOOP_T)}}`;
  css += `@keyframes ${prefix}dr{${sampleKF(openNear(ENTER_X), (v) => `transform:translateX(${(46 * v).toFixed(1)}px)`, 0.03, 0.3, LOOP_T)}}`;

  const queueAt = (gt: number) => {
    let n = 0;
    for (let a = 0; a < N; a++) {
      const p = posAt(a, gt);
      if (p.o > 0.5 && Math.abs(p.x - laneX) < 8 && p.y >= REG_Y - 8 && p.y <= INY) n++;
    }
    return n;
  };

  // Snapshot: the moment the lane is deepest.
  let snapshotT = 0,
    deepest = -1;
  for (let t = 0; t < LOOP_T; t += 0.5) {
    const q = queueAt(t);
    if (q > deepest) {
      deepest = q;
      snapshotT = t;
    }
  }

  const serveEvents = pkEvents.map((e) => (e + DWELL) % LOOP_T).sort((a, b) => a - b);

  return {
    loopT: LOOP_T,
    css,
    agents,
    ambient: {
      ping: `${prefix}ping`,
      cashier: `${prefix}cash`,
      shelfMove: `${prefix}shm`,
      shelfFade: `${prefix}shf`,
      server: `${prefix}srv`,
      doorL: `${prefix}dl`,
      doorR: `${prefix}dr`,
    },
    serveEvents,
    ratePerMinute: (N / LOOP_T) * 60,
    posAt,
    agentCount: N,
    queueAt,
    snapshotT,
  };
}

/* ======================================================================
   Scene 2 — three kiosks. Ordering parallelises, so a denser arrival
   stream flows through with no line: round-robin A→B→C, quick taps,
   trays waiting at pickup.
   ====================================================================== */

export function buildKioskSim(prefix: string): Sim {
  const OT = 4;
  const EAT = 16;
  const SPEED = 110;
  const DWELL = 1.4,
    ROT = 1.2;
  const LOOP_T = 126;
  // Twice the prototype's density: one guest every 7s. Each kiosk still
  // only sees a guest every 21s (order takes 4s), so no line ever forms,
  // and seat turns (~50s) clear well before the same seat repeats (63s).
  const N = 18;
  const ARRIVALS = Array.from({ length: N }, (_, i) => i * (LOOP_T / N));

  const doorX = 450,
    doorY = 1150,
    ENTER_X = 500,
    EXIT_X = 400,
    INY = 1080;
  const kiosks = [
    { x: 180, y: 222 },
    { x: 350, y: 222 },
    { x: 520, y: 222 },
  ];
  const PK = { x: 760, y: 262 };

  type XY = [number, number];
  const seats: { x: number; y: number; rot: number; via: XY[] }[] = [
    {
      x: 210,
      y: 901,
      rot: 0,
      via: [
        [340, 950],
        [210, 950],
      ],
    },
    {
      x: 781,
      y: 830,
      rot: -90,
      via: [
        [560, 950],
        [781, 950],
      ],
    },
    {
      x: 210,
      y: 759,
      rot: 180,
      via: [
        [340, 720],
        [210, 720],
      ],
    },
    { x: 599, y: 830, rot: 90, via: [[560, 830]] },
    {
      x: 695,
      y: 479,
      rot: 180,
      via: [
        [560, 440],
        [695, 440],
      ],
    },
    { x: 301, y: 830, rot: -90, via: [[340, 830]] },
    {
      x: 205,
      y: 611,
      rot: 0,
      via: [
        [340, 660],
        [205, 660],
      ],
    },
    {
      x: 119,
      y: 830,
      rot: 90,
      via: [
        [340, 950],
        [119, 950],
      ],
    },
    {
      x: 690,
      y: 901,
      rot: 0,
      via: [
        [560, 950],
        [690, 950],
      ],
    },
  ];

  const journeys: Waypoint[][] = [];
  const reach: number[] = [];
  const pArrive: number[] = [];

  for (let i = 0; i < N; i++) {
    const K = kiosks[i % 3]!;
    const S = seats[i % seats.length]!;
    const wp: Waypoint[] = [];
    let t = 0,
      cx = doorX,
      cy = doorY;
    const at = (x: number, y: number, o: number, rot: number, tray: number) => {
      wp.push({ t, x, y, o, rot, tray });
      cx = x;
      cy = y;
    };
    const leg = (x: number, y: number, o: number, rot: number, tray: number) => {
      t += dist(cx, cy, x, y) / SPEED;
      at(x, y, o, rot, tray);
    };

    at(doorX, doorY, 0, 0, 0);
    leg(ENTER_X, INY, 1, 0, 0);
    leg(K.x, K.y, 1, 0, 0);
    reach[i] = t;
    t += OT;
    at(K.x, K.y, 1, 0, 0);
    leg(K.x, 300, 1, 0, 0);
    leg(700, 300, 1, 0, 0);
    leg(PK.x, PK.y, 1, 0, 0);
    pArrive[i] = t;
    t += DWELL - 0.35;
    at(PK.x, PK.y, 1, 0, 0);
    t += 0.35;
    at(PK.x, PK.y, 1, 0, 1);
    for (const v of S.via) leg(v[0], v[1], 1, 0, 1);
    leg(S.x, S.y, 1, 0, 1);
    t += ROT;
    at(S.x, S.y, 1, S.rot, 1);
    t += EAT;
    at(S.x, S.y, 1, S.rot, 1);
    t += ROT;
    at(S.x, S.y, 1, 0, 0);
    for (let k = S.via.length - 1; k >= 0; k--) leg(S.via[k]![0], S.via[k]![1], 1, 0, 0);
    leg(EXIT_X, INY, 1, 0, 0);
    leg(doorX, doorY, 0, 0, 0);
    t = LOOP_T;
    at(doorX, doorY, 0, 0, 0);
    journeys.push(wp);
  }

  let css = "";
  const agents: SimAgent[] = [];
  for (let i = 0; i < N; i++) {
    css += agentKeyframes(prefix, i, journeys[i]!, LOOP_T);
    agents.push({
      delay: ARRIVALS[i]! - LOOP_T,
      body: BODY[i % BODY.length]!,
      hair: HAIR[i % HAIR.length]!,
      move: `${prefix}m${i}`,
      face: `${prefix}f${i}`,
      tray: `${prefix}t${i}`,
    });
  }

  const posAt = (i: number, gt: number): SimPoint =>
    interpolate(journeys[i]!, (((gt - ARRIVALS[i]!) % LOOP_T) + LOOP_T) % LOOP_T);

  const pkEvents = pArrive.map((v, i) => (ARRIVALS[i]! + v) % LOOP_T);

  for (let k = 0; k < 3; k++) {
    const on = (t: number) => {
      for (let i = k; i < N; i += 3) {
        const r = wrapRel(t, (ARRIVALS[i]! + reach[i]!) % LOOP_T, LOOP_T);
        if (r >= 0 && r <= OT) return 0.72;
      }
      return 0.18;
    };
    css += `@keyframes ${prefix}k${k}{${sampleKF(on, (v) => "opacity:" + v, 0.01, 0.25, LOOP_T)}}`;
  }

  // The tray slides out from the kitchen side and lands just before the
  // customer reaches the counter — just-in-time, never waiting.
  const shelfY = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -1.5 && r <= -0.2) return -58 * (1 - (r + 1.5) / 1.3);
      if (r > -0.2 && r <= DWELL + 0.3) return 0;
    }
    return -58;
  };
  const shelfOp = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -1.5 && r < -1.2) return (r + 1.5) / 0.3;
      if (r >= -1.2 && r <= DWELL - 0.35) return 1;
      if (r > DWELL - 0.35 && r <= DWELL) return 1 - (r - (DWELL - 0.35)) / 0.35;
    }
    return 0;
  };
  const serverY = (t: number) => {
    for (const e of pkEvents) {
      const r = wrapRel(t, e, LOOP_T);
      if (r >= -2 && r <= -0.6) return 7 * (1 - Math.abs((r + 1.3) / 0.7));
    }
    return 0;
  };
  css += `@keyframes ${prefix}shm{${sampleKF(shelfY, (v) => `transform:translateY(${v.toFixed(1)}px)`, 1, 0.2, LOOP_T)}}`;
  css += `@keyframes ${prefix}shf{${sampleKF(shelfOp, (v) => "opacity:" + v.toFixed(2), 0.05, 0.15, LOOP_T)}}`;
  css += `@keyframes ${prefix}srv{${sampleKF(serverY, (v) => `transform:translateY(${v.toFixed(1)}px)`, 0.4, 0.2, LOOP_T)}}`;

  const openness = (t: number) => {
    let m = 0;
    for (let i = 0; i < N; i++) {
      const p = posAt(i, t);
      if (p.o > 0.12)
        m = Math.max(
          m,
          Math.min(1, Math.max(0, (150 - Math.hypot(p.x - doorX, p.y - doorY)) / 90)),
        );
    }
    return m;
  };
  css += `@keyframes ${prefix}dl{${sampleKF(openness, (v) => `transform:translateX(${(-46 * v).toFixed(1)}px)`, 0.04, 0.4, LOOP_T)}}`;
  css += `@keyframes ${prefix}dr{${sampleKF(openness, (v) => `transform:translateX(${(46 * v).toFixed(1)}px)`, 0.04, 0.4, LOOP_T)}}`;

  const serveEvents = pkEvents.map((e) => (e + DWELL) % LOOP_T).sort((a, b) => a - b);

  return {
    loopT: LOOP_T,
    css,
    agents,
    ambient: {
      k0: `${prefix}k0`,
      k1: `${prefix}k1`,
      k2: `${prefix}k2`,
      shelfMove: `${prefix}shm`,
      shelfFade: `${prefix}shf`,
      server: `${prefix}srv`,
      doorL: `${prefix}dl`,
      doorR: `${prefix}dr`,
    },
    serveEvents,
    ratePerMinute: (N / LOOP_T) * 60,
    posAt,
    agentCount: N,
    snapshotT: 30,
  };
}

/**
 * Guests served after `elapsed` sim-seconds of watching (the loop's phase
 * at t=0 matches the CSS animations, which also start at the loop origin).
 */
export function servedCount(sim: Sim, elapsed: number): number {
  let n = 0;
  for (const e of sim.serveEvents) {
    if (elapsed >= e) n += Math.floor((elapsed - e) / sim.loopT) + 1;
  }
  return n;
}
