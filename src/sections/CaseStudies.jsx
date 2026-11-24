import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { caseStudies } from '../data/site.js';
import { SectionHeading, stagger, item } from '../components/Reveal.jsx';

export default function CaseStudies() {
  return (
    <section className="section section--tint" id="case-studies">
      <div className="container">
        <SectionHeading
          eyebrow="02 — Case Studies"
          title="Case Studies"
          text="Three deeper case studies on cross-product navigation, a complex license flow and role-based dashboards."
        />
        <motion.div className="cs-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          {caseStudies.map((c) => (
            <motion.article key={c.slug} className="csc" variants={item} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
              <Link to={`/work/${c.slug}`} className="csc__cover" style={{ background: c.tint }} aria-label={`${c.title} cover`}>
                <motion.div className="csc__zoom" variants={{ hidden: { scale: 1.1 }, show: { scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } } }}>
                  <img src={c.image} alt="" loading="lazy" />
                </motion.div>
              </Link>
              <div className="csc__body">
                <p className="csc__eyebrow">{c.eyebrow}</p>
                <h3 className="csc__title"><Link to={`/work/${c.slug}`}>{c.title}</Link></h3>
                <p className="csc__summary">{c.summary}</p>
                <div><Link to={`/work/${c.slug}`} className="arrow-link">View Case Study <span className="arr">→</span></Link></div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
