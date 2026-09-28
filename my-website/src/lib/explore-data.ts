export type SectionItem = {
  name: string;
  tag: string;
  url: string | null;
  icon: string;
  placeholder?: boolean;
  // Real context shown when the card unwraps in place (no blind external links).
  detail?: string;
  links?: { label: string; url: string }[];
  // Optional photo shown inside the unwrapped panel (path under public/).
  img?: { src: string; alt: string };
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
  // A boxy head with an antenna — an AI agent.
  bot(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(11, 14, 14, 11);
    ctx.beginPath();
    ctx.moveTo(18, 14); ctx.lineTo(18, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(18, 8.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = STROKE;
    ctx.fill();
    for (const x of [15, 21]) {
      ctx.beginPath();
      ctx.arc(x, 18.5, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(15, 22); ctx.lineTo(21, 22);
    ctx.stroke();
  },
  // A dial with a needle — a pricing engine.
  gauge(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(18, 22, 10, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(9.5, 22); ctx.lineTo(11.5, 22);
    ctx.moveTo(26.5, 22); ctx.lineTo(24.5, 22);
    ctx.moveTo(18, 12.5); ctx.lineTo(18, 14.5);
    ctx.stroke();
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(18, 22); ctx.lineTo(24, 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(18, 22, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = STROKE;
    ctx.fill();
  },
  // A heartbeat trace — med-tech.
  pulse(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(7, 18);
    ctx.lineTo(13, 18); ctx.lineTo(15, 12); ctx.lineTo(18, 24);
    ctx.lineTo(21, 15); ctx.lineTo(23, 18); ctx.lineTo(29, 18);
    ctx.stroke();
  },
  // A leaf with a midrib — ESG / green fintech.
  leaf(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(18, 8);
    ctx.quadraticCurveTo(28, 14, 18, 28);
    ctx.quadraticCurveTo(8, 14, 18, 8);
    ctx.stroke();
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(18, 11); ctx.lineTo(18, 25);
    ctx.stroke();
  },
  // A circle of dots — a community.
  ring(ctx) {
    ctx.fillStyle = STROKE;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(18 + 9 * Math.cos(a), 18 + 9 * Math.sin(a), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = STROKE_DIM;
    ctx.beginPath();
    ctx.arc(18, 18, 1.8, 0, Math.PI * 2);
    ctx.fill();
  },
  // A microphone — talks and mentoring.
  mic(ctx) {
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(15, 8, 6, 10);
    ctx.strokeStyle = STROKE_DIM;
    ctx.beginPath();
    ctx.arc(18, 17, 7, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18, 24); ctx.lineTo(18, 28);
    ctx.moveTo(14, 28); ctx.lineTo(22, 28);
    ctx.stroke();
  },
  // A play triangle in a circle — a shipped demo.
  play(ctx) {
    ctx.strokeStyle = STROKE_DIM;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(18, 18, 10.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = STROKE;
    ctx.beginPath();
    ctx.moveTo(15.5, 12.5); ctx.lineTo(24, 18); ctx.lineTo(15.5, 23.5);
    ctx.closePath();
    ctx.fill();
  },
};

// ---- Minimal project grid: each card gets a small hand-drawn icon that
// actually represents what the project is, not a random glyph. ----
// ---- Two sections split out of one body of work. `EXPERIENCE` is roles and
// ventures; `PROJECTS` is hackathon builds and research. Each card carries its
// real story (`detail`) and the public trail (`links`); on the main page a
// click unwraps the card in place instead of jumping to a bare external link. ----
export const EXPERIENCE: SectionItem[] = [
  {
    name: 'Flow', tag: 'quant researcher · ML pricing engine', url: 'https://www.flowtraders.com/', icon: 'gauge',
    detail: 'Modular ML pricing engine for quoting outside market hours: Kubernetes-hosted model clusters that fold weather, news, and sentiment data into price. Cut system downtime by 75%, improved price accuracy by 7%.\n\nHigh frequency taking strategy deployment: created scalable infrastructure to model and deploy active taking strategies for coins across all market caps, based on XGB/NN based models.',
    links: [{ label: 'flowtraders.com', url: 'https://www.flowtraders.com/' }],
  },
  {
    name: 'Journey @ EF', tag: 'founder in residence · med-tech CTO', url: 'https://journeytotherapy.online/', icon: 'pulse',
    img: { src: '/img/work/ef-reid-hoffman.jpg', alt: 'The Entrepreneur First founder cohort at a private lunch with Reid Hoffman' },
    detail: 'Selected for Entrepreneur First (<10% acceptance). Built a therapist-matching ML platform on journal and mood semantics: 20+ therapists, 100+ beta users, and 23% better retention than TalkSpace and BetterHelp comparables. Named a standout CTO of the 50+ founder cohort and invited to a private lunch with Reid Hoffman.',
    links: [
      { label: 'journey', url: 'https://journeytotherapy.online/' },
      { label: 'EF', url: 'https://www.joinef.com/' },
    ],
  },
  {
    name: 'Fair', tag: 'co-founder & CTO · ESG fintech', url: 'https://www.linkedin.com/company/hellofair/', icon: 'leaf',
    detail: 'ESG fintech: a hyper-realistic trading simulator with historical scenario replay plus six proprietary ML-driven ESG metrics. Led a team of 7 engineers; 1st place in the UCL EFS Startup Competition; backed by a former Deutsche Bank MD.',
    links: [
      { label: 'company', url: 'https://www.linkedin.com/company/hellofair/' },
    ],
  },
  {
    name: 'Three Courses', tag: 'community co-founder · 20+ founders', url: 'https://www.threecourses.xyz/', icon: 'ring',
    detail: 'UK-wide community for technical female founders, now 20+ strong and sponsored by Merantix. Project Europe came to the first London event.',
  },
  {
    name: 'Talks & mentoring', tag: 'EthOxford · Avalanche · ABC', url: 'https://www.eventbrite.co.uk/e/oxford-blockchain-conference-2023-tickets-596700275587', icon: 'mic',
    detail: 'Speaker & panelist at EthOxford (500+ attendees, alongside the founders of Tezos, Aave, Starkware). Mentor at the African Blockchain Championship (800+ participants; mentored teams placed 2nd and 4th) and the Avalanche Summit London.',
    links: [
      { label: 'EthOxford', url: 'https://www.eventbrite.co.uk/e/oxford-blockchain-conference-2023-tickets-596700275587' },
      { label: 'ABC', url: 'https://www.africanblockchamp.com/' },
    ],
  },
];

export const PROJECTS: SectionItem[] = [
  // Temporarily hidden — t3 card commented out.
  // {
  //   name: 't3', tag: 'co-founder & CTO · AI-agent lending', url: 'https://www.trustinweb3.xyz/', icon: 'bot',
  //   img: { src: '/img/work/t3-agent.jpg', alt: 'The t3 AI agent chat handling a live undercollateralised loan' },
  //   detail: 'Undercollateralised lending on blockchain: a proprietary AI risk agent tracks each portfolio’s distance to liquidation and manages margins live, making loans ~120% more capital-efficient than the Aave/Compound model. Token launch reached a $20M market cap with 6,000+ holders; 500+ waitlist signups; a16z partners engaged as mentors.',
  //   links: [
  //     { label: 'product', url: 'https://www.trustinweb3.xyz/' },
  //     { label: 'docs', url: 'https://3p0.gitbook.io/t3' },
  //   ],
  // },
  {
    name: 'LLMPhaseTransition', tag: 'research · python', url: 'https://github.com/ppo6/LLMPhaseTransition', icon: 'phase',
    detail: 'Evaluating LLM accuracy collapse under noisy context systems. Tracks attention weights and output entropy (models tend to go confidently wrong rather than uncertain), reproduces the lost-in-the-middle effect, and runs steering-vector and attention-ablation experiments in transformer_lens and torch.',
    links: [{ label: 'code', url: 'https://github.com/ppo6/LLMPhaseTransition' }],
  },
  {
    name: 'vouch-finance', tag: 'ETHDenver 🥇×2 · lending', url: 'https://github.com/ppo6/vouch-finance', icon: 'shield',
    detail: 'Social-vouching take on overcollateralised DeFi lending, built at EthDenver against 1,000+ hackers and won two bounties.',
    links: [
      { label: 'code', url: 'https://github.com/ppo6/vouch-finance' },
      { label: 'showcase', url: 'https://app.buidlbox.io/projects/vouch-finance' },
      { label: 'winners post', url: 'https://ethereumdenver.medium.com/ethdenver-2023-track-and-bounty-winners-1d9cbeda1dc8' },
    ],
  },
  {
    name: 'ex2.1', tag: '2nd @ a16z AI Hack · compute mkt', url: 'https://github.com/ppo6/ex2.1', icon: 'network',
    img: { src: '/img/work/a16z-podium.jpg', alt: 'Presenting ex2.1 as a finalist at the a16z AI Hack in London' },
    detail: 'GPU/CPU compute marketplace with a proprietary pricing algorithm and on-chain payments, cutting compute cost per user by up to 40%. Placed 2nd of 1,000+ applicants at the a16z AI Hack, which opened incubation talks with Improbable’s CEO.',
    links: [
      { label: 'code', url: 'https://github.com/ppo6/ex2.1' },
      { label: 'a16z post', url: 'https://www.linkedin.com/posts/elizabeth-harkavy_this-past-weekend-andreessen-horowitz-hosted-activity-7250188345903919107-urzl/' },
    ],
  },
  {
    name: 'Edzy', tag: 'ETHTokyo 🥇 · on-chain education', url: 'https://ethglobal.com/showcase/edzy-cv0pg', icon: 'play',
    detail: 'On-chain education platform with encrypted video messaging and integrated payments, built in 36 hours in Tokyo (3,500+ lines of code). Track winner among 1,000+ participants.',
    links: [{ label: 'showcase', url: 'https://ethglobal.com/showcase/edzy-cv0pg' }],
  },
  {
    name: 'BlockRock', tag: 'ETHBrussels 🥇×2 · solidity', url: 'https://github.com/ppo6/BlockRock_ETHBrussels', icon: 'blocks',
    detail: 'On-chain fund management built at ETHBrussels against 1,000+ developers, took home two bounties. BlockRock packages crypto into transparent, fee-free ETFs: pick a risk tolerance and get matching broad-market exposure, with a Python VaR model sizing each portfolio and Solidity contracts running the funds on-chain.',
    links: [{ label: 'code', url: 'https://github.com/ppo6/BlockRock_ETHBrussels' }],
  },
  {
    name: 'HEDGy', tag: '2nd @ Hex Cambridge · optiver', url: 'https://github.com/ppo6/HEDGy', icon: 'candles',
    detail: 'Optiver market-making track. The low-latency backend for continuous position management, about 37% of the codebase, kept the book profitable. Finished 2nd of 350+ participants.',
    links: [
      { label: 'code', url: 'https://github.com/ppo6/HEDGy' },
      { label: 'devpost', url: 'https://hex-cambridge.devpost.com/' },
    ],
  },
];

// Combined list — kept for the test suite and the variant pages, which render
// the whole body of work as a single grid.
export const WORK: SectionItem[] = [...EXPERIENCE, ...PROJECTS];

// ---- Writing: intentionally empty until real posts exist — no fake drafts.
// When the first real post ships, add it here and re-add the Writing section
// to the pages (git history has the removed wiring). ----
export const WRITING: SectionItem[] = [];

// ---- Contact: same card language instead of a persistent footer bar. ----
export const CONTACT: SectionItem[] = [
  { name: 'Email', tag: 'mmmhedge@gmail.com', url: 'mailto:mmmhedge@gmail.com', icon: 'mail' },
  { name: 'GitHub', tag: 'github.com/ppo6', url: 'https://github.com/ppo6', icon: 'code' },
  { name: 'X', tag: '@mmmhedge', url: 'https://x.com/mmmhedge', icon: 'xmark' },
];
