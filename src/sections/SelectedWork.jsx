import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { featured } from '../data/site.js';
import { SectionHeading, stagger, item } from '../components/Reveal.jsx';

const ease = [0.22, 1, 0.36, 1];
// The image is uncovered towards the text beside it, leading the eye from picture to story.
const wipe = (flip) => ({
  hidden: { clipPath: flip ? 'inset(0% 0% 0% 100% round 16px)' : 'inset(0% 100% 0% 0% round 16px)' },
  show: { clipPath: 'inset(0% 0% 0% 0% round 16px)', transition: { duration: 1.1, ease } },
});
const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } };
const zoom = { hidden: { scale: 1.12 }, show: { scale: 1, transition: { duration: 1.4, ease } } };
const tagGroup = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const tagItem = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

function FeaturedCard({ p, flip }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const reduce = useReducedMotion();
  const cta = p.cta || 'View Project';

  return (
    <motion.article
      ref={ref}
      className={`fp${flip ? ' fp--flip' : ''}`}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div variants={reduce ? fade : wipe(flip)} className="fp__media-wrap">
        <Link to={`/work/${p.slug}`} className="fp__media" style={{ background: p.tint }} data-cta={cta} aria-label={`${cta}: ${p.title}`}>
          <motion.div className="fp__zoom" variants={zoom}>
            <motion.img src={p.image} alt={`${p.title} preview`} style={{ y }} loading="lazy" />
          </motion.div>
        </Link>
      </motion.div>
      <div className="fp__content">
        <motion.p variants={item} className="fp__eyebrow">{p.eyebrow}</motion.p>
        <motion.h3 variants={item} className="fp__title">{p.title}</motion.h3>
        <motion.p variants={item} className="fp__summary">{p.summary}</motion.p>
        <motion.div variants={tagGroup} className="tags">
          {p.tags.map((t) => <motion.span variants={tagItem} className="tag" key={t}>{t}</motion.span>)}
        </motion.div>
        <motion.div variants={item}>
          <Link to={`/work/${p.slug}`} className="arrow-link arrow-link--lg">{cta} <span className="arr">→</span></Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function SelectedWork() {
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHeading
          eyebrow="01 — Selected Work"
          title="Selected Work"
          text="Two featured projects where I transformed complex requirements into thoughtful, user-centered experiences."
        />
        <div className="featured">
          {featured.map((p, i) => <FeaturedCard key={p.slug} p={p} flip={i % 2 === 1} />)}
        </div>
      </div>
    </section>
  );
}
