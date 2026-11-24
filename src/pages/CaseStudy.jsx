import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import FigmaRenderer from '../components/FigmaRenderer.jsx';
import { useMediaQuery } from '../hooks.js';
import { allProjects } from '../data/site.js';
import NotFound from './NotFound.jsx';

// Each case study has a desktop and a mobile layout, exported from Figma.
const pages = import.meta.glob('../data/pages/*.json');

export default function CaseStudy() {
  const { slug } = useParams();
  const mobile = useMediaQuery('(max-width: 900px)');
  const variant = mobile ? 'mobile' : 'desktop';
  const [page, setPage] = useState(null);
  const key = `../data/pages/${slug}.${variant}.json`;
  const exists = Boolean(pages[key]);

  const idx = allProjects.findIndex((p) => p.slug === slug);
  const project = allProjects[idx];
  const next = allProjects[(idx + 1) % allProjects.length];

  useEffect(() => {
    if (!exists) return;
    let alive = true;
    pages[key]().then((m) => alive && setPage(m.default));
    return () => { alive = false; };
  }, [key, exists]);

  useEffect(() => {
    if (project) document.title = `${project.title} — Anuradha Mude`;
    return () => { document.title = 'Anuradha Mude — Senior UI/UX Designer'; };
  }, [project]);

  if (!exists) return <NotFound />;
  if (!page) return <div style={{ minHeight: '100vh' }} />;

  return (
    <div className={`cs-page cs-page--${variant}`}>
      <FigmaRenderer page={page} variant={variant} key={variant} />
      {next && (
        <section className="next-cs">
          <div className="container next-cs__inner">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <small>Next case study</small>
              <h3>{next.title}</h3>
            </motion.div>
            <Link to={`/work/${next.slug}`} className="next-cs__btn">View project <span>→</span></Link>
          </div>
        </section>
      )}
    </div>
  );
}
