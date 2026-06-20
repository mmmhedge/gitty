export type SectionItem = {
  name: string;
  tag: string;
  url: string | null;
  icon: string;
  placeholder?: boolean;
};

export const STROKE = 'rgba(201,196,224,0.9)';
export const STROKE_DIM = 'rgba(157,151,184,0.5)';

// Each icon is a tiny hand-drawn glyph that represents what the card actually
// is (not a random/generative shape) — drawn into a 36x36 canvas at render time.
export const ICONS: Record<string, (ctx: CanvasRenderingContext2D) => void> = {
  // Ordered grid on the left vs. a jittered scatter on the right — a phase boundary in the middle.
  phase(ctx) {
    const ordered: [number, number][] = [[-3, -3], [3, -3], [-3, 3], [3, 3]];
    ctx.fillStyle = STROKE;
    for (const [dx, dy] of ordered) {
      ctx.beginPath();
      ctx.arc(12 + dx, 18 + dy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const scattered: [number, number][] = [[-4, -5], [3, -2], [-2, 4], [5, 3]];
    ctx.fillStyle = STROKE_DIM;
    for (const [dx, dy] of scattered) {
      ctx.beginPath();
      ctx.arc(24 + dx, 18 + dy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1;
    ctx.setLineDash([1.5, 2]);
    ctx.beginPath();
    ctx.moveTo(18, 6); ctx.lineTo(18, 30);
    ctx.stroke();
    ctx.setLineDash([]);
  },
  // Three linked blocks — a chain.
  blocks(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    const xs = [10, 18, 26];
    for (const x of xs) ctx.strokeRect(x - 3.5, 14.5, 7, 7);
    ctx.strokeStyle = STROKE_DIM;
    ctx.beginPath();
    ctx.moveTo(13.5, 18); ctx.lineTo(14.5, 18);
    ctx.moveTo(21.5, 18); ctx.lineTo(22.5, 18);
    ctx.stroke();
  },
  // A trend line over a small row of candlesticks — market-making.
  candles(ctx) {
    const bars: [number, number, number][] = [[9, 20, 27], [17, 17, 24], [25, 21, 28]];
    for (const [x, top, bottom] of bars) {
      ctx.strokeStyle = STROKE_DIM;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 2, top - 2); ctx.lineTo(x + 2, bottom + 2); ctx.stroke();
      ctx.fillStyle = STROKE_DIM;
      ctx.fillRect(x, top, 4, bottom - top);
    }
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(8, 14); ctx.lineTo(15, 10); ctx.lineTo(20, 13); ctx.lineTo(28, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(28, 7, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = STROKE;
    ctx.fill();
  },
  // A shield with a checkmark — credit / lending trust.
  shield(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(18, 7);
    ctx.lineTo(26, 10.5);
    ctx.lineTo(26, 18);
    ctx.quadraticCurveTo(26, 25, 18, 29);
    ctx.quadraticCurveTo(10, 25, 10, 18);
    ctx.lineTo(10, 10.5);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(14.5, 18); ctx.lineTo(17, 21); ctx.lineTo(22, 14.5);
    ctx.stroke();
  },
  // Five connected nodes — a distributed compute network.
  network(ctx) {
    const nodes: [number, number][] = [[18, 18], [10, 10], [26, 10], [10, 26], [26, 26]];
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1;
    for (let i = 1; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.moveTo(nodes[0][0], nodes[0][1]);
      ctx.lineTo(nodes[i][0], nodes[i][1]);
      ctx.stroke();
    }
    ctx.fillStyle = STROKE;
    for (const [x, y] of nodes) {
      ctx.beginPath();
      ctx.arc(x, y, x === 18 && y === 18 ? 2.4 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  // A dashed plus — open slot for a project not yet listed.
  plus(ctx) {
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(18, 18, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(13, 18); ctx.lineTo(23, 18);
    ctx.moveTo(18, 13); ctx.lineTo(18, 23);
    ctx.stroke();
  },
  // A small page with text lines — notes / long-form writing.
  lines(ctx) {
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(11, 7, 14, 22);
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1;
    for (const [y, x2] of [[13, 22], [17, 22], [21, 22], [25, 19]]) {
      ctx.beginPath();
      ctx.moveTo(14, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
  },
  // Two quotation marks — essays / opinion pieces.
  quote(ctx) {
    ctx.fillStyle = STROKE;
    for (const x of [13, 22]) {
      ctx.beginPath();
      ctx.arc(x, 14, 3, Math.PI, Math.PI * 1.85, false);
      ctx.lineTo(x - 1, 22);
      ctx.closePath();
      ctx.fill();
    }
  },
  // A sparkle — short-form notes / ideas.
  spark(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(18, 7); ctx.lineTo(18, 29);
    ctx.moveTo(7, 18); ctx.lineTo(29, 18);
    ctx.stroke();
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(11, 11); ctx.lineTo(25, 25);
    ctx.moveTo(25, 11); ctx.lineTo(11, 25);
    ctx.stroke();
  },
  // An envelope — email.
  mail(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.3;
    ctx.strokeRect(8, 11, 20, 14);
    ctx.beginPath();
    ctx.moveTo(8, 11.5); ctx.lineTo(18, 20); ctx.lineTo(28, 11.5);
    ctx.stroke();
  },
  // Nested brackets — code / GitHub.
  code(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(15, 11); ctx.lineTo(9, 18); ctx.lineTo(15, 25);
    ctx.moveTo(21, 11); ctx.lineTo(27, 18); ctx.lineTo(21, 25);
    ctx.stroke();
  },
  // A cross mark — X / social.
  xmark(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(11, 11); ctx.lineTo(25, 25);
    ctx.moveTo(25, 11); ctx.lineTo(11, 25);
    ctx.stroke();
  },
};

// ---- Minimal project grid: each card gets a small hand-drawn icon that
// actually represents what the project is, not a random glyph. ----
export const PROJECTS: SectionItem[] = [
  { name: 'LLMPhaseTransition', tag: 'research · python', url: 'https://github.com/ppo6/LLMPhaseTransition', icon: 'phase' },
  { name: 'BlockRock', tag: 'ETHBrussels 🥇 · solidity', url: 'https://github.com/ppo6/BlockRock_ETHBrussels', icon: 'blocks' },
  { name: 'HEDGy', tag: 'top 10 · optiver', url: 'https://github.com/ppo6/HEDGy', icon: 'candles' },
  { name: 'vouch-finance', tag: 'finalist · solidity', url: 'https://github.com/ppo6/vouch-finance', icon: 'shield' },
  { name: 'ex2.1', tag: 'AI Hack finalist', url: 'https://github.com/ppo6/ex2.1', icon: 'network' },
  { name: '+ Add project', tag: '', url: null, placeholder: true, icon: 'plus' },
];

// ---- Writing: same card language, blank links until real posts exist. ----
export const WRITING: SectionItem[] = [
  { name: 'Phase Transitions in LLMs', tag: 'essay · draft', url: '#', icon: 'spark' },
  { name: 'Market Making as Physics', tag: 'notes', url: '#', icon: 'lines' },
  { name: 'On Building in Public', tag: 'essay', url: '#', icon: 'quote' },
  { name: '+ Add post', tag: '', url: null, placeholder: true, icon: 'plus' },
];

// ---- Contact: same card language instead of a persistent footer bar. ----
export const CONTACT: SectionItem[] = [
  { name: 'Email', tag: 'mmmhedge@gmail.com', url: 'mailto:mmmhedge@gmail.com', icon: 'mail' },
  { name: 'GitHub', tag: 'github.com/ppo6', url: 'https://github.com/ppo6', icon: 'code' },
  { name: 'X', tag: '@mmmhedge', url: 'https://x.com/mmmhedge', icon: 'xmark' },
];
