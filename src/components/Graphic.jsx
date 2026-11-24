// Decorative, animated illustrations used where the Figma file had placeholder slots.
// Purely visual: they make no claims (no numbers, no results).
import { motion } from 'framer-motion';
import { PlatformMap, ChallengeMap, ApproachSteps, OutcomeStack, LearnedStack } from './MedtigoGraphics.jsx';
import MedtigoDesignSystem from './MedtigoDesignSystem.jsx';
import { FeeFlow, FeeScreens } from './StudentFees.jsx';
import { OeTestGraphic, OeOutcomeGraphic } from './OneEcosystemGraphics.jsx';
import { LicenseOutcomeGraphic, RoleOutcomeGraphic } from './LicenseGraphics.jsx';

const ease = [0.22, 1, 0.36, 1];
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } };
const draw = (delay = 0) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, delay, ease } },
});
const pop = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, delay, ease } },
});

// Six-step approach path (matches the six steps listed beside it).
function Process() {
  const pts = [[60, 210], [150, 120], [250, 175], [340, 80], [430, 140], [500, 50]];
  const d = 'M60 210 C 95 160, 115 125, 150 120 S 215 185, 250 175 S 305 85, 340 80 S 400 150, 430 140 S 480 70, 500 50';
  return (
    <motion.svg viewBox="0 0 560 260" role="img" aria-label="Six-step approach, from understanding the gap to reusable components" {...inView}>
      <defs>
        <linearGradient id="pg" x1="0" x2="1">
          <stop offset="0" stopColor="#92b2dc" />
          <stop offset="1" stopColor="#125bfb" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="260" rx="16" fill="#ffffff" stroke="#d2deeb" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="24" x2="536" y1={60 + i * 50} y2={60 + i * 50} stroke="#eef3fb" strokeDasharray="4 6" />
      ))}
      <motion.path d={d} fill="none" stroke="url(#pg)" strokeWidth="3" strokeLinecap="round" variants={draw(0.1)} />
      {pts.map(([x, y], i) => (
        <motion.g key={i} variants={pop(0.25 + i * 0.16)} style={{ transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r="19" fill={i === pts.length - 1 ? '#125bfb' : '#ffffff'} stroke="#125bfb" strokeWidth="2" />
          <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="600" fontFamily="Poppins, sans-serif" fill={i === pts.length - 1 ? '#ffffff' : '#125bfb'}>
            {String(i + 1).padStart(2, '0')}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}

// Layered product cards with checkmarks: "work delivered" without inventing metrics.
function Outcome({ compact = false }) {
  return (
    <motion.svg viewBox="0 0 560 300" role="img" aria-label="Illustration of delivered product views" {...inView} preserveAspectRatio="xMidYMid meet">
      <motion.circle cx="430" cy="90" r="80" fill="#eaf0ff" variants={pop(0)} />
      <motion.circle cx="120" cy="230" r="54" fill="#eaf0ff" variants={pop(0.1)} />
      {/* back card */}
      <motion.g variants={pop(0.15)}>
        <rect x="190" y="40" width="300" height="190" rx="14" fill="#ffffff" stroke="#d2deeb" />
        <rect x="210" y="62" width="90" height="10" rx="5" fill="#d2deeb" />
        <rect x="210" y="90" width="260" height="56" rx="8" fill="#eef3fb" />
        <rect x="210" y="158" width="122" height="52" rx="8" fill="#eef3fb" />
        <rect x="348" y="158" width="122" height="52" rx="8" fill="#eef3fb" />
      </motion.g>
      {/* front card */}
      <motion.g variants={pop(0.3)}>
        <rect x="70" y="88" width="250" height="176" rx="14" fill="#ffffff" stroke="#92b2dc" />
        <rect x="70" y="88" width="250" height="38" rx="14" fill="#3d4ccb" />
        <rect x="70" y="112" width="250" height="14" fill="#3d4ccb" />
        <circle cx="92" cy="107" r="6" fill="#ffffff" opacity="0.9" />
        <rect x="106" y="102" width="70" height="10" rx="5" fill="#ffffff" opacity="0.7" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <motion.circle cx="98" cy={152 + i * 36} r="11" fill="#e8f5ea" variants={pop(0.5 + i * 0.15)} />
            <motion.path d={`M92 ${152 + i * 36} l4 4 l8 -8`} fill="none" stroke="#3cac47" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" variants={draw(0.6 + i * 0.15)} />
            <rect x="120" y={146 + i * 36} width={i === 1 ? 120 : 160} height="12" rx="6" fill="#e9edf4" />
          </g>
        ))}
      </motion.g>
      {!compact && (
        <motion.g variants={pop(0.8)}>
          <rect x="360" y="210" width="150" height="44" rx="22" fill="#125bfb" />
          <path d="M384 232 l6 6 l12 -12" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="412" y="226" width="78" height="12" rx="6" fill="#ffffff" opacity="0.85" />
        </motion.g>
      )}
      <motion.path d="M520 40 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6z" fill="#92b2dc" variants={pop(0.9)} />
    </motion.svg>
  );
}

const SECTION_ART = {
  'medtigo-platform': PlatformMap,
  'medtigo-challenge': ChallengeMap,
  'medtigo-approach': ApproachSteps,
  'medtigo-outcome': OutcomeStack,
  'medtigo-learned': LearnedStack,
  'medtigo-design-system': MedtigoDesignSystem,
  'sm-fee-flow': FeeFlow,
  'sm-fee-screens': FeeScreens,
  'oe-test': OeTestGraphic,
  'oe-outcome': OeOutcomeGraphic,
  'lt-outcome': LicenseOutcomeGraphic,
  'rb-outcome': RoleOutcomeGraphic,
};

export default function Graphic({ node }) {
  const Art = SECTION_ART[node.kind];
  if (Art) return <div className="fg-graphic" style={node.s}><Art /></div>;
  const card = node.kind === 'outcome-card';
  return (
    <div
      className={`fg-graphic${card ? ' fg-graphic--card' : ''}`}
      style={{ ...node.s, ...(card ? { alignSelf: 'stretch' } : {}) }}
    >
      {node.kind === 'process' ? <Process /> : <Outcome compact={card} />}
    </div>
  );
}
