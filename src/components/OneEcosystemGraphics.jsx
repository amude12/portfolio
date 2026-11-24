// One Ecosystem, Five Domains: illustrations for the Validation and Outcome cards.
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const C = { blue: '#125bfb', indigo: '#3d4ccb', ink: '#0f1222', body: '#4a5068', line: '#d2deeb', tint: '#eaf0ff', mint: '#eaf0ff', soft: '#92b2dc', green: '#3cac47' };
const font = { fontFamily: 'Poppins, sans-serif' };
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } };
const rise = (d = 0) => ({ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease } } });
const draw = (d = 0) => ({ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1, delay: d, ease } } });
const NAV = ['Home', 'Courses', 'Staffing', 'Journal', 'Platform'];

function Header({ x, y, w, active, d = 0 }) {
  const step = (w - 70) / NAV.length;
  return (
    <motion.g variants={rise(d)}>
      <rect x={x} y={y} width={w} height="26" rx="6" fill="#fff" stroke={C.line} />
      <text x={x + 10} y={y + 17} fontSize="9" fontWeight="600" fill={C.ink} style={font}>medtigo</text>
      {NAV.map((n, i) => (
        <g key={n}>
          <text x={x + 62 + i * step + step / 2} y={y + 17} textAnchor="middle" fontSize="7" fontWeight={i === active ? 600 : 500} fill={i === active ? C.blue : C.body} style={font}>{n.toUpperCase()}</text>
          {i === active && <rect x={x + 62 + i * step + 4} y={y + 23} width={step - 8} height="2" rx="1" fill={C.blue} />}
        </g>
      ))}
    </motion.g>
  );
}

// Validation: moving between products through the header, and knowing where you are.
export function OeTestGraphic() {
  return (
    <motion.svg viewBox="0 0 320 180" role="img" aria-label="A user moves from Courses to Staffing through the shared header and can say which product they are in" {...inView}>
      <Header x={16} y={30} w={288} active={1} d={0.05} />
      <motion.text x="16" y="20" fontSize="8" fill={C.body} style={font} variants={rise(0)}>courses.medtigo.com</motion.text>
      {/* path from Courses to Staffing */}
      <motion.path d="M118 64 C 130 92, 160 92, 172 64" fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="3 3" variants={draw(0.35)} />
      <motion.g variants={rise(0.8)}>
        <circle cx="172" cy="62" r="4" fill={C.blue} />
        <path d="M176 66 l9 9 l-4 1 l3 5 l-2 1 l-3 -5 l-3 3z" fill={C.ink} />
      </motion.g>
      <Header x={16} y={104} w={288} active={2} d={1.0} />
      <motion.text x="16" y="96" fontSize="8" fill={C.body} style={font} variants={rise(1.0)}>staffing.medtigo.com</motion.text>
      {/* "where am I?" answered */}
      <motion.g variants={rise(1.35)}>
        <rect x="150" y="142" width="154" height="26" rx="13" fill={C.tint} stroke={C.soft} />
        <circle cx="166" cy="155" r="7" fill={C.green} />
        <path d="M162.5 155 l2.5 2.5 l4.5 -4.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="180" y="158" fontSize="8.5" fontWeight="500" fill={C.indigo} style={font}>“I’m in Staffing”</text>
      </motion.g>
    </motion.svg>
  );
}

// Outcome: five separate domains, one shared header frame.
export function OeOutcomeGraphic() {
  const doms = ['medtigo.com', 'courses.', 'staffing.', 'journal.', 'connect.'];
  return (
    <motion.svg viewBox="0 0 320 180" role="img" aria-label="Five products on five domains, each showing the same shared header" {...inView}>
      {doms.map((d, i) => {
        const x = 18 + i * 58;
        return (
          <motion.g key={d} variants={rise(0.08 * i)}>
            <rect x={x} y="44" width="50" height="96" rx="6" fill="#fff" stroke={C.line} strokeDasharray="3 2" />
            <rect x={x} y="44" width="50" height="14" rx="6" fill={C.indigo} />
            <rect x={x} y="52" width="50" height="6" fill={C.indigo} />
            <rect x={x + 5} y={49} width="16" height="3" rx="1.5" fill="#fff" opacity="0.9" />
            <rect x={x + 6} y="68" width="38" height="5" rx="2.5" fill={C.line} />
            <rect x={x + 6} y="79" width="28" height="5" rx="2.5" fill={C.line} />
            <rect x={x + 6} y="94" width="38" height="20" rx="3" fill={C.mint} />
            <text x={x + 25} y="154" textAnchor="middle" fontSize="7" fill={C.body} style={font}>{d}</text>
          </motion.g>
        );
      })}
      {/* the one shared frame */}
      <motion.path d="M14 40 H 306 V 62 H 14 Z" fill="none" stroke={C.blue} strokeWidth="1.6" variants={draw(0.5)} />
      <motion.text x="160" y="28" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.blue} style={font} variants={rise(0.9)}>One shared header · five domains</motion.text>
    </motion.svg>
  );
}
