// License Tracking: outcome illustration — the five-stage application timeline next to its tasks.
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const C = { blue: '#125bfb', indigo: '#3d4ccb', ink: '#0f1222', body: '#4a5068', line: '#d2deeb', tint: '#eaf0ff', mint: '#eaf0ff', green: '#3cac47', amber: '#c27a12' };
const font = { fontFamily: 'Poppins, sans-serif' };
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } };
const rise = (d = 0) => ({ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease } } });
const grow = (d = 0) => ({ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.2, delay: d, ease } } });
const STAGES = ['Initiated', 'Submitted', 'Verified', 'Active', 'Approval'];

export function LicenseOutcomeGraphic() {
  return (
    <motion.svg viewBox="0 0 320 180" role="img" aria-label="Tasks beside a five-stage timeline from Initiated to Approval, with the current stage highlighted" {...inView}>
      {/* tasks */}
      {[['Sign form', 'Done', C.green], ['Upload ID', 'Overdue', '#ca4444'], ['Fill details', 'To do', C.amber]].map(([t, s, c], i) => (
        <motion.g key={t} variants={rise(0.1 + i * 0.12)}>
          <rect x="14" y={22 + i * 36} width="128" height="28" rx="6" fill="#fff" stroke={C.line} />
          <text x="24" y={40 + i * 36} fontSize="8.5" fontWeight="500" fill={C.ink} style={font}>{t}</text>
          <rect x="94" y={30 + i * 36} width="40" height="12" rx="6" fill={c} opacity="0.14" />
          <text x="114" y={39 + i * 36} textAnchor="middle" fontSize="6.5" fontWeight="600" fill={c} style={font}>{s}</text>
        </motion.g>
      ))}
      {/* timeline */}
      <path d="M180 30 V 150" stroke={C.line} strokeWidth="2" />
      <motion.path d="M180 30 V 90" stroke={C.blue} strokeWidth="2" variants={grow(0.4)} />
      {STAGES.map((st, i) => {
        const y = 30 + i * 30;
        const done = i < 2;
        const cur = i === 2;
        return (
          <motion.g key={st} variants={rise(0.5 + i * 0.1)}>
            <circle cx="180" cy={y} r={cur ? 7 : 5.5} fill={done ? C.blue : '#fff'} stroke={done || cur ? C.blue : C.line} strokeWidth="2" />
            {cur && <circle cx="180" cy={y} r="2.5" fill={C.blue} />}
            <text x="194" y={y + 3} fontSize="8.5" fontWeight={cur ? 600 : 500} fill={cur ? C.blue : done ? C.ink : C.body} style={font}>{st}</text>
            {cur && <text x="244" y={y + 3} fontSize="7" fill={C.body} style={font}>· in progress</text>}
          </motion.g>
        );
      })}
    </motion.svg>
  );
}

// Role-Based Dashboards: outcome illustration — one data source, two dashboards with different scope.
export function RoleOutcomeGraphic() {
  const tile = (x, y, w, label, val, col, d) => (
    <motion.g variants={rise(d)}>
      <rect x={x} y={y} width={w} height="34" rx="5" fill="#fff" stroke={C.line} />
      <text x={x + 7} y={y + 12} fontSize="6" fill={C.body} style={font}>{label}</text>
      <text x={x + 7} y={y + 27} fontSize="11" fontWeight="700" fill={col} style={font}>{val}</text>
    </motion.g>
  );
  return (
    <motion.svg viewBox="0 0 320 180" role="img" aria-label="One credential data source feeding an Admin dashboard for the organisation and a Provider dashboard for one person" {...inView}>
      <motion.g variants={rise(0)}>
        <rect x="116" y="10" width="88" height="26" rx="13" fill={C.indigo} />
        <text x="160" y="27" textAnchor="middle" fontSize="8" fontWeight="600" fill="#fff" style={font}>Credential data</text>
      </motion.g>
      <motion.path d="M160 36 C 160 52, 82 46, 82 60" fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="3 3" variants={grow(0.25)} />
      <motion.path d="M160 36 C 160 52, 238 46, 238 60" fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="3 3" variants={grow(0.3)} />
      {/* Admin dashboard: organisation-wide */}
      <motion.g variants={rise(0.45)}>
        <rect x="12" y="60" width="140" height="108" rx="8" fill={C.mint} stroke={C.line} />
        <text x="22" y="76" fontSize="8" fontWeight="600" fill={C.ink} style={font}>Admin · 20,000 providers</text>
      </motion.g>
      {tile(20, 84, 60, 'Expired', '1,650', '#ca4444', 0.6)}
      {tile(84, 84, 60, 'At risk', '3,400', C.amber, 0.66)}
      <motion.g variants={rise(0.75)}>{[0.7, 0.55, 0.85].map((v, i) => <g key={i}><rect x="20" y={128 + i * 12} width="124" height="5" rx="2.5" fill={C.line} /><rect x="20" y={128 + i * 12} width={124 * v} height="5" rx="2.5" fill={C.green} /></g>)}</motion.g>
      {/* Provider dashboard: one person */}
      <motion.g variants={rise(0.55)}>
        <rect x="168" y="60" width="140" height="108" rx="8" fill={C.mint} stroke={C.line} />
        <text x="178" y="76" fontSize="8" fontWeight="600" fill={C.ink} style={font}>Provider · one person</text>
      </motion.g>
      {tile(176, 84, 60, 'Expired', '4', '#ca4444', 0.7)}
      {tile(240, 84, 60, 'Pending tasks', '36', C.blue, 0.76)}
      <motion.g variants={rise(0.85)}>{['Start Renewal', 'Start Renewal', 'View Details'].map((b, i) => <g key={i}><rect x="176" y={126 + i * 13} width="70" height="9" rx="2" fill={C.line} /><rect x="252" y={125 + i * 13} width="48" height="11" rx="3" fill="#fff" stroke={C.blue} strokeWidth="0.8" /><text x="276" y={133 + i * 13} textAnchor="middle" fontSize="5.5" fontWeight="600" fill={C.blue} style={font}>{b}</text></g>)}</motion.g>
    </motion.svg>
  );
}
