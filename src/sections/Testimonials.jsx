import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { testimonials } from '../data/site.js';
import { SectionHeading, stagger, item } from '../components/Reveal.jsx';

// Figma: a row of three cards (one on phones). With more testimonials than fit, the row
// becomes a looping carousel: one dot per testimonial, autoplay that pauses on hover/focus.
const CLONES = 2; // copies of the first cards appended so the last position still shows a full row
const AUTOPLAY_MS = 6000;

function Card({ t, hidden }) {
  return (
    <motion.figure className="tc" variants={item} style={{ margin: 0 }} aria-hidden={hidden || undefined} inert={hidden ? '' : undefined}>
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
  const [index, setIndex] = useState(0); // 0…n, where n is the clone of 0
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const startX = useRef(null);
  const carousel = n > 1;

  const go = useCallback((to) => { setAnimate(true); setIndex(to); }, []);
  const next = useCallback(() => go(index + 1 > n ? 1 : index + 1), [go, index, n]);
  const prev = useCallback(() => {
    if (index > 0) return go(index - 1);
    // jump to the clone of the first card without animating, then slide back one
    setAnimate(false);
    setIndex(n);
    requestAnimationFrame(() => requestAnimationFrame(() => go(n - 1)));
  }, [go, index, n]);

  // After sliding onto the clones, snap back to the real first card invisibly.
  const onTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || index < n) return;
    setAnimate(false);
    setIndex(index - n);
  };
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  useEffect(() => {
    if (!carousel || paused || reduce || !inView) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [carousel, paused, reduce, inView, next, index]);

  if (!n) return null;
  const items = carousel ? [...testimonials, ...testimonials.slice(0, CLONES)] : testimonials;
  const active = index % n;

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
            className={`t-track${animate ? '' : ' t-track--snap'}`}
            style={{ '--i': index }}
            onTransitionEnd={onTransitionEnd}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {items.map((t, k) => <Card key={k} t={t} hidden={k >= n} />)}
          </motion.div>
        </div>
        {carousel && (
          <div className="t-dots">
            {testimonials.map((t, k) => (
              <button
                key={t.name}
                type="button"
                className={`t-dot${k === active ? ' is-active' : ''}`}
                aria-label={`Show testimonial from ${t.name}`}
                aria-current={k === active || undefined}
                onClick={() => go(k)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
