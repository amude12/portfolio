// Logo: an "AM" monogram (one stroke: the M's first peak carries the A's crossbar) + wordmark.
import { motion } from 'framer-motion';
import { site } from '../data/site.js';

const ease = [0.22, 1, 0.36, 1];

export function LogoMark({ animate = true, light = false }) {
  const draw = (d) => (animate
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1, delay: d, ease } }
    : {});
  return (
    <svg className="logo__mark" viewBox="4 6 32 28" aria-hidden="true">
      {/* No box: the A–M monogram as one solid stroke — blue on light backgrounds, white on blue */}
      <g fill="none" stroke={light ? '#ffffff' : '#125bfb'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M8.5 29 L14.5 11 L20 24.5 L25.5 11 L31.5 29" {...draw(0.2)} />
        <motion.path d="M11.2 21.5 H17.6" {...draw(0.9)} />
      </g>
    </svg>
  );
}

export default function Logo({ animate = true, light = false }) {
  const [first, ...rest] = site.name.split(' ');
  return (
    <span className={`logo${light ? ' logo--light' : ''}`}>
      <LogoMark animate={animate} light={light} />
      <motion.span
        className="logo__word"
        initial={animate ? { opacity: 0, x: -8 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease }}
      >
        <b>{first}</b> {rest.join(' ')}<i aria-hidden="true">.</i>
      </motion.span>
    </span>
  );
}
