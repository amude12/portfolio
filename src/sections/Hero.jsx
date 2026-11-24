// Hero as a live design canvas: the headline sits on a dotted grid, "intuitive" is selected like a
// layer in a design tool, and real work floats around it while a named cursor moves between pieces.
import { Fragment, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hero, site } from '../data/site.js';
import { LinkedInIcon, MailIcon } from '../components/Icons.jsx';

const ease = [0.22, 1, 0.36, 1];
const SELECTED = 'intuitive';

function Headline({ text }) {
  const words = text.split(' ');
  return (
    <h1 className="hero2__title" aria-label={text}>
      {words.map((w, i) => {
        const selected = w.replace(/\W/g, '') === SELECTED;
        const word = (
          <motion.span className="hero2__w" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease }}>
            {w}
          </motion.span>
        );
        return (
          <Fragment key={i}>
            <span className={`hero2__mask${selected ? ' hero2__mask--sel' : ''}`} aria-hidden="true">
              {word}
              {selected && (
                <motion.span className="hero2__sel" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.5, ease }}>
                  <i /><i /><i /><i />
                  <b>Text · {SELECTED}</b>
                </motion.span>
              )}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        );
      })}
    </h1>
  );
}

// A floating piece of work. depth controls how strongly it follows the mouse.
function Float({ className, depth = 1, delay = 0, mx, my, children }) {
  const x = useTransform(mx, (v) => v * 24 * depth);
  const y = useTransform(my, (v) => v * 18 * depth);
  return (
    <motion.div className={`hero2__float ${className}`} style={{ x, y }} initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay, duration: 0.9, ease }}>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6 + depth * 1.5, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function toWork(e) {
  const el = document.getElementById('work');
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero2" id="about" ref={ref} onMouseMove={onMove} onMouseLeave={() => { rawX.set(0); rawY.set(0); }}>
      <div className="hero2__grid" aria-hidden="true" />

      {/* ── Floating work (desktop) ── */}
      <motion.div className="hero2__canvas" style={{ opacity: fade }} aria-hidden="true">
        <Float className="hero2__float--dash" depth={1.2} delay={0.9} mx={mx} my={my}>
          <div className="hero2__frame">
            <span className="hero2__frame-label">Admin Dashboard</span>
            <img src="/hero/dashboard.webp" alt="" width="900" height="563" />
          </div>
        </Float>
        <Float className="hero2__float--phone" depth={1.6} delay={1.05} mx={mx} my={my}>
          <span className="hero2__frame-label">Student App · Home</span>
          <img src="/hero/phone.webp" alt="" width="375" height="720" />
        </Float>
        <Float className="hero2__float--palette" depth={0.7} delay={1.2} mx={mx} my={my}>
          <div className="hero2__card hero2__palette">
            {['#125bfb', '#3d4ccb', '#22c55e', '#f59e0b', '#feffb5'].map((c) => <span key={c} style={{ background: c }} />)}
          </div>
        </Float>
        <Float className="hero2__float--comp" depth={0.9} delay={1.35} mx={mx} my={my}>
          <div className="hero2__card hero2__comp">
            <span className="hero2__comp-btn">Primary</span>
            <span className="hero2__comp-chip">● Active</span>
          </div>
        </Float>
        <Float className="hero2__float--note" depth={0.5} delay={1.5} mx={mx} my={my}>
          <div className="hero2__note">Simplify first.<br />Then make it beautiful.</div>
        </Float>
        <Float className="hero2__float--flow" depth={0.8} delay={1.6} mx={mx} my={my}>
          <div className="hero2__card hero2__flow">
            <span>Research</span><em>→</em><span>Flows</span><em>→</em><span className="is-on">UI</span>
          </div>
        </Float>
        {!reduce && (
          <motion.div
            className="hero2__cursor"
            // stays in the side margins so it never crosses the headline
            initial={{ opacity: 0, left: '12%', top: '60%' }}
            animate={{ opacity: 1, left: ['12%', '6%', '14%', '88%', '92%', '86%', '12%'], top: ['60%', '74%', '34%', '24%', '58%', '76%', '60%'] }}
            transition={{ opacity: { delay: 1.8, duration: 0.4 }, left: { delay: 1.8, duration: 16, repeat: Infinity, ease: 'easeInOut' }, top: { delay: 1.8, duration: 16, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 2l13 6.2-5.6 1.6L8 15.6z" fill="#125bfb" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            <span>{site.name.split(' ')[0]}</span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Copy ── */}
      <div className="container hero2__inner">
        <motion.p className="hero2__greet" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease }}>
          <span className="hero2__wave" aria-hidden="true">👋</span> {hero.greeting}
        </motion.p>
        <Headline text={hero.headline} />
        <motion.p className="hero2__intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }}>
          {hero.intro}
        </motion.p>
        <motion.div className="hero2__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.7, ease }}>
          <Link className="btn-work" to="/#work" onClick={toWork}>
            View my work
            <span className="btn-work__arr" aria-hidden="true">↓</span>
          </Link>
          <a className="social" href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a className="social" href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}><MailIcon /></a>
        </motion.div>
      </div>
    </section>
  );
}
