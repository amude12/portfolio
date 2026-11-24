import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { testimonials } from '../data/site.js';
import { SectionHeading, stagger, item } from '../components/Reveal.jsx';

// Figma: a row of three cards (one on phones). With more testimonials than fit, the row
// becomes a carousel that moves one card at a time and always shows a full row of real
// cards: one dot per position, wrapping from the last back to the first. Autoplay pauses
// on hover/focus.
const AUTOPLAY_MS = 6000;
const ONE_UP = '(max-width: 900px)'; // matches the .t-track { --per: 1 } breakpoint in global.css

function usePerView() {
  const get = () => (typeof window !== 'undefined' && window.matchMedia(ONE_UP).matches ? 1 : 3);
  const [per, setPer] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(ONE_UP);
    const on = () => setPer(get());
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return per;
}

function Card({ t }) {
  return (
    <motion.figure className="tc" variants={item} style={{ margin: 0 }}>
      <blockquote>{t.quote}</blockquote>
      <figcaption className="tc__who">
        <span className="tc__avatar">{t.avatar ? <img src={t.avatar} alt="" width="48" height="48" loading="lazy" /> : t.name.charAt(0)}</span>
        <span><strong>{t.name}</strong><span>{t.title}</span></span>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const n = testimonials.length;
  const per = usePerView();
  const positions = Math.max(1, n - per + 1);
  const [rawIndex, setIndex] = useState(0);
  const index = Math.min(rawIndex, positions - 1); // stays valid when the layout changes
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const startX = useRef(null);
  const carousel = positions > 1;

  const next = useCallback(() => setIndex((index + 1) % positions), [index, positions]);
  const prev = useCallback(() => setIndex((index - 1 + positions) % positions), [index, positions]);

  useEffect(() => {
    if (!carousel || paused || reduce || !inView) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [carousel, paused, reduce, inView, next, index]);

  if (!n) return null;
  return (
    <section className="section section--tint" id="kind-words">
      <div className="container" ref={ref}>
        <SectionHeading eyebrow="04 — Kind Words" title="Kind Words" text="What colleagues and collaborators say about working with me." />
        <div
          className="t-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={(e) => { startX.current = e.clientX; }}
          onPointerUp={(e) => {
            if (startX.current === null) return;
            const dx = e.clientX - startX.current;
            startX.current = null;
            if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
          }}
        >
          <motion.div
            className="t-track"
            style={{ '--i': index }}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((t) => <Card key={t.name} t={t} />)}
          </motion.div>
        </div>
        {carousel && (
          <div className="t-dots">
            {Array.from({ length: positions }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`t-dot${k === index ? ' is-active' : ''}`}
                aria-label={per === 1 ? `Show testimonial from ${testimonials[k].name}` : `Show testimonials ${k + 1} to ${k + per} of ${n}`}
                aria-current={k === index || undefined}
                onClick={() => setIndex(k)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
