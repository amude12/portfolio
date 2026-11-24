import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export function Reveal({ as = 'div', children, delay = 0, y = 28, className, style, once = true, amount = 0.2, ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="sh">
      <Reveal as="p" className="eyebrow" y={12}>{eyebrow}</Reveal>
      {/* The trigger sits on the visible h2: the masked text starts outside its clip, where the observer can't see it */}
      <motion.h2 className="mask" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.span
          className="mask__inner"
          variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.9, delay: 0.06, ease } } }}
        >
          {title}
        </motion.span>
      </motion.h2>
      {text && <Reveal as="p" delay={0.12}>{text}</Reveal>}
    </div>
  );
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
export const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
