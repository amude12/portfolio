// Section illustrations for the Medtigo case study. Each one visualises facts stated in its
// section (no invented metrics). Animated on scroll, sized to sit under the section title.
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const C = { blue: '#125bfb', indigo: '#3d4ccb', ink: '#0f1222', body: '#4a5068', line: '#d2deeb', tint: '#eaf0ff', mint: '#eaf0ff', soft: '#92b2dc', green: '#3cac47', amber: '#c27a12', red: '#ca4444' };
const font = { fontFamily: 'Poppins, sans-serif' };
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.35 } };
const draw = (d = 0) => ({ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, delay: d, ease } } });
const pop = (d = 0) => ({ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { duration: 0.55, delay: d, ease } } });
const rise = (d = 0) => ({ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease } } });

function Frame({ children, label, h = 360 }) {
  return (
    <motion.svg viewBox={`0 0 480 ${h}`} role="img" aria-label={label} {...inView}>
      <rect x="0.5" y="0.5" width="479" height={h - 1} rx="16" fill="#fff" stroke={C.line} />
      {children}
    </motion.svg>
  );
}

function Chip({ x, y, w, text, fill = '#fff', stroke = C.line, color = C.ink, d = 0, weight = 500 }) {
  return (
    <motion.g variants={rise(d)}>
      <rect x={x} y={y} width={w} height="34" rx="17" fill={fill} stroke={stroke} />
      <text x={x + w / 2} y={y + 21.5} textAnchor="middle" fontSize="12.5" fontWeight={weight} fill={color} style={font}>{text}</text>
    </motion.g>
  );
}

// 01 — About the Platform: one platform, two views, five areas.
export function PlatformMap() {
  const mods = [
    { t: 'Monitoring', x: 24, y: 232 }, { t: 'Acquisition', x: 114, y: 272 }, { t: 'Compliance', x: 198, y: 292 },
    { t: 'Billing', x: 282, y: 272 }, { t: 'Education', x: 372, y: 232 },
  ];
  return (
    <Frame label="One Medtigo platform with an Admin View and a provider view, covering monitoring, acquisition, compliance, billing and education">
      <Chip x={40} y={28} w={176} text="Admin View · new" fill={C.blue} stroke={C.blue} color="#fff" d={0.1} weight={600} />
      <Chip x={264} y={28} w={176} text="Provider view · redesigned" fill={C.tint} stroke={C.soft} color={C.indigo} d={0.2} weight={600} />
      <motion.path d="M128 62 C 128 100, 240 92, 240 112" fill="none" stroke={C.soft} strokeWidth="2" variants={draw(0.35)} />
      <motion.path d="M352 62 C 352 100, 240 92, 240 112" fill="none" stroke={C.soft} strokeWidth="2" variants={draw(0.45)} />
      {/* connectors sit behind the hub */}
      {mods.map((m, i) => (
        <motion.path key={m.t} d={`M240 160 L ${m.x + 42} ${m.y + 17}`} stroke={C.line} strokeWidth="1.5" strokeDasharray="4 4" variants={draw(0.7 + i * 0.06)} />
      ))}
      <motion.g variants={pop(0.55)} style={{ transformOrigin: '240px 160px' }}>
        <circle cx="240" cy="160" r="56" fill={C.tint} />
        <circle cx="240" cy="160" r="44" fill={C.indigo} />
        <path d="M234 136 h12 v8 h8 v12 h-8 v8 h-12 v-8 h-8 v-12 h8z" fill="#fff" />
        <text x="240" y="186" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff" style={font}>medtigo</text>
      </motion.g>
      {mods.map((m, i) => <Chip key={m.t} x={m.x} y={m.y} w={84} text={m.t} d={0.8 + i * 0.08} />)}
      <motion.text x="240" y="352" textAnchor="middle" fontSize="12" fill={C.body} style={font} variants={rise(1.2)}>Permissions decide what each person sees</motion.text>
    </Frame>
  );
}

// 02 — Understanding the Challenge: a single-provider tool vs. many providers tracked by hand.
export function ChallengeMap() {
  return (
    <Frame label="Before: one provider per account, while hospitals needed many providers and analysts tracked work in spreadsheets and emails">
      <motion.text x="32" y="44" fontSize="12" fontWeight="500" fill={C.body} style={font} variants={rise(0)}>BEFORE THE REDESIGN</motion.text>
      {/* single provider account */}
      <motion.g variants={rise(0.1)}>
        <rect x="32" y="64" width="160" height="118" rx="12" fill={C.mint} stroke={C.line} />
        <circle cx="72" cy="104" r="18" fill="#fff" stroke={C.soft} strokeWidth="2" />
        <circle cx="72" cy="99" r="6" fill={C.soft} />
        <path d="M61 115 a11 8 0 0 1 22 0" fill={C.soft} />
        <rect x="100" y="94" width="72" height="9" rx="4.5" fill={C.line} />
        <rect x="100" y="110" width="50" height="9" rx="4.5" fill={C.line} />
        <text x="52" y="160" fontSize="12.5" fontWeight="600" fill={C.ink} style={font}>One user, one provider</text>
      </motion.g>
      {/* hospital with many providers */}
      <motion.g variants={rise(0.25)}>
        <rect x="288" y="64" width="160" height="118" rx="12" fill="#fff" stroke={C.line} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={318 + (i % 3) * 30} cy={96 + Math.floor(i / 3) * 30} r="10" fill={i < 1 ? C.soft : '#e9edf4'} stroke={i < 1 ? C.soft : C.line} />
        ))}
        <text x="368" y="160" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={C.ink} style={font}>Many providers</text>
      </motion.g>
      <motion.g variants={pop(0.45)} style={{ transformOrigin: '240px 123px' }}>
        <circle cx="240" cy="123" r="20" fill="#fdecec" />
        <path d="M232 115 l16 16 M248 115 l-16 16" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" />
      </motion.g>
      {/* manual work */}
      <motion.path d="M110 182 C 110 230, 160 236, 196 252" fill="none" stroke={C.soft} strokeWidth="1.8" strokeDasharray="5 5" variants={draw(0.6)} />
      <motion.path d="M368 182 C 368 230, 320 236, 284 252" fill="none" stroke={C.soft} strokeWidth="1.8" strokeDasharray="5 5" variants={draw(0.65)} />
      <motion.g variants={rise(0.8)}>
        <rect x="132" y="236" width="104" height="72" rx="10" fill="#fff" stroke={C.line} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={144 + c * 28} y={248 + r * 16} width="24" height="11" rx="2" fill={r === 0 ? '#d7f0da' : '#eef3fb'} />
        )))}
        <text x="184" y="330" textAnchor="middle" fontSize="12" fill={C.body} style={font}>Spreadsheets</text>
      </motion.g>
      <motion.g variants={rise(0.9)}>
        <rect x="248" y="236" width="104" height="72" rx="10" fill="#fff" stroke={C.line} />
        <rect x="268" y="252" width="64" height="42" rx="5" fill={C.tint} stroke={C.soft} />
        <path d="M268 254 l32 22 l32 -22" fill="none" stroke={C.indigo} strokeWidth="1.8" />
        <text x="300" y="330" textAnchor="middle" fontSize="12" fill={C.body} style={font}>Emails</text>
      </motion.g>
    </Frame>
  );
}

// 04 — From Gaps to Structure: the six steps listed beside it.
export function ApproachSteps() {
  const steps = ['Understand the gap', 'Review flows', 'Define modules', 'Redesign acquisition', 'Design Admin View', 'Build components'];
  return (
    <Frame label="Six steps: understand the gap, review flows, define modules, redesign acquisition, design the Admin View, build components" h={380}>
      <motion.path d="M56 50 V 330" stroke={C.line} strokeWidth="2" variants={draw(0.1)} />
      <motion.path d="M56 50 V 330" stroke={C.blue} strokeWidth="2" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.8, delay: 0.3, ease } } }} />
      {steps.map((s, i) => {
        const y = 50 + i * 56;
        const last = i === steps.length - 1;
        return (
          <motion.g key={s} variants={rise(0.3 + i * 0.15)}>
            <circle cx="56" cy={y} r="17" fill={last ? C.blue : '#fff'} stroke={C.blue} strokeWidth="2" />
            <text x="56" y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="600" fill={last ? '#fff' : C.blue} style={font}>{String(i + 1).padStart(2, '0')}</text>
            <rect x="92" y={y - 18} width={i % 2 ? 300 : 340} height="36" rx="10" fill={last ? C.tint : '#f7f9fc'} stroke={last ? C.soft : C.line} />
            <text x="110" y={y + 4.5} fontSize="13" fontWeight="500" fill={C.ink} style={font}>{s}</text>
          </motion.g>
        );
      })}
    </Frame>
  );
}

// 11 — Outcome and Learnings: the three things delivered.
export function OutcomeStack() {
  const items = [
    { t: 'Admin View', s: 'New · hospitals and organisations', c: C.blue },
    { t: 'Provider experience', s: 'Redesigned · incl. license application flow', c: C.indigo },
    { t: 'Shared patterns', s: 'One set of components across both views', c: C.green },
  ];
  return (
    <Frame label="Delivered: a new Admin View, a redesigned provider experience and one shared set of patterns" h={340}>
      <motion.text x="32" y="44" fontSize="12" fontWeight="500" fill={C.body} style={font} variants={rise(0)}>WHAT I DELIVERED</motion.text>
      {items.map((it, i) => {
        const y = 66 + i * 84;
        return (
          <motion.g key={it.t} variants={rise(0.2 + i * 0.18)}>
            <rect x="32" y={y} width="416" height="68" rx="12" fill="#fff" stroke={C.line} />
            <rect x="32" y={y} width="6" height="68" rx="3" fill={it.c} />
            <rect x="56" y={y + 16} width="36" height="36" rx="10" fill={C.tint} />
            <motion.path d={`M65 ${y + 34} l6 6 l12 -12`} fill="none" stroke={it.c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" variants={draw(0.5 + i * 0.18)} />
            <text x="108" y={y + 31} fontSize="14" fontWeight="600" fill={C.ink} style={font}>{it.t}</text>
            <text x="108" y={y + 50} fontSize="12" fill={C.body} style={font}>{it.s}</text>
          </motion.g>
        );
      })}
    </Frame>
  );
}

// 11 — Outcome and Learnings: the three lessons, paired with what was delivered.
export function LearnedStack() {
  const items = [
    { t: 'Structure first', s: 'Scaling up is mostly an information-structure problem' },
    { t: 'Reuse buys time', s: 'One table and filter pattern made the deadline work' },
    { t: 'End on a next step', s: 'A clear next action beats a good-looking list' },
  ];
  return (
    <Frame label="What I learned: structure first, reuse buys time, end every flow on a next step" h={340}>
      <motion.text x="32" y="44" fontSize="12" fontWeight="500" fill={C.body} style={font} variants={rise(0)}>WHAT I LEARNED</motion.text>
      {items.map((it, i) => {
        const y = 66 + i * 84;
        return (
          <motion.g key={it.t} variants={rise(0.2 + i * 0.18)}>
            <rect x="32" y={y} width="416" height="68" rx="12" fill="#fff" stroke={C.line} />
            <rect x="32" y={y} width="6" height="68" rx="3" fill={C.amber} />
            <rect x="56" y={y + 16} width="36" height="36" rx="10" fill="#fdf3e3" />
            {/* light bulb */}
            <motion.g variants={pop(0.5 + i * 0.18)} style={{ transformOrigin: `74px ${y + 34}px` }}>
              <path d={`M74 ${y + 23} a8 8 0 0 0 -4.6 14.6 c0.9 0.7 1.4 1.6 1.4 2.6 v1.3 h6.4 v-1.3 c0 -1 0.5 -1.9 1.4 -2.6 A8 8 0 0 0 74 ${y + 23}z`} fill="none" stroke={C.amber} strokeWidth="2" strokeLinejoin="round" />
              <path d={`M71.2 ${y + 45} h5.6`} stroke={C.amber} strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            <text x="108" y={y + 31} fontSize="14" fontWeight="600" fill={C.ink} style={font}>{it.t}</text>
            <text x="108" y={y + 50} fontSize="12" fill={C.body} style={font}>{it.s}</text>
          </motion.g>
        );
      })}
    </Frame>
  );
}
