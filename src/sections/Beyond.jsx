import { useState } from 'react';
import { motion } from 'framer-motion';
import { gallery } from '../data/site.js';
import { SectionHeading, item } from '../components/Reveal.jsx';
import Lightbox from '../components/Lightbox.jsx';

// How many screens each mosaic shows; the rest are one click away in the lightbox.
const SHOWN = { feature: 3, feature3: 4, grid: 4 };

const tile = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] } }),
};

function Mosaic({ g, onOpen }) {
  const layout = g.layout || 'grid';
  const shown = g.images.slice(0, SHOWN[layout]);
  const more = g.images.length - shown.length;
  return (
    <motion.div className={`gc__media mosaic mosaic--${layout}`} style={{ background: g.tint }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      {shown.map((src, i) => (
        <motion.button
          key={src}
          type="button"
          className="mosaic__tile"
          custom={i}
          variants={tile}
          onClick={() => onOpen(i)}
          aria-label={`Open ${g.title}, screen ${i + 1} of ${g.images.length}`}
        >
          <img src={src} alt="" loading="lazy" decoding="async" />
        </motion.button>
      ))}
      {more > 0 && <span className="count">+{more} more</span>}
    </motion.div>
  );
}

export default function Beyond() {
  const [active, setActive] = useState(null); // [cardIndex, screenIndex]
  const current = active ? gallery[active[0]] : null;

  return (
    <section className="section" id="beyond">
      <div className="container">
        <SectionHeading
          eyebrow="03 — Beyond Case Studies"
          title="Inside My Figma Workspace"
          text="Explore my hands-on design work, including UI screens, design systems, components, and more."
        />
        <div className="gallery">
          {gallery.map((g, i) => (
            <motion.article
              key={g.title}
              className={`gc gc--${g.span}`}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 2) * 0.12 }}
            >
              <Mosaic g={g} onOpen={(s) => setActive([i, s])} />
              <div className="gc__meta">
                <h3>{g.title}</h3>
                {g.figma ? (
                  <a className="arrow-link" href={g.figma} target="_blank" rel="noreferrer" aria-label={`View ${g.title} in Figma (opens in a new tab)`}>
                    View Design <span className="arr">→</span>
                  </a>
                ) : (
                  <button className="arrow-link" onClick={() => setActive([i, 0])} aria-label={`View all ${g.images.length} ${g.title} designs`}>
                    View Design <span className="arr">→</span>
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <Lightbox open={!!current} title={current?.title} images={current?.images || []} start={active?.[1] || 0} onClose={() => setActive(null)} />
    </section>
  );
}
