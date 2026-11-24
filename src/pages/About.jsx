import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { site } from '../data/site.js';
import { Reveal } from '../components/Reveal.jsx';
import { LinkedInIcon, MailIcon } from '../components/Icons.jsx';

const ease = [0.22, 1, 0.36, 1];

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);

// Line icons drawn on scroll, one per value
const ICONS = {
  Curiosity: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M15.5 8.5l-2 5-5 2 2-5z'],
  Simplicity: ['M4 7h16', 'M7 12h10', 'M10 17h4'],
  Empathy: ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'],
};
const lineUp = { hidden: { y: '110%' }, show: (i) => ({ y: 0, transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease } }) };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const rise = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

function ValueIcon({ name }) {
  return (
    <svg className="about-value__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].map((d, i) => (
        <motion.path key={i} d={d} variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, delay: 0.25 + i * 0.15, ease } } }} />
      ))}
    </svg>
  );
}

// From the resume
const EXPERIENCE = [
  {
    company: 'Medtigo', role: 'Lead UI/UX Designer', period: 'Apr 2024 – Present', current: true,
    summary: 'Leading end-to-end UX for healthcare web platforms and a mobile app used by providers and hospitals worldwide.',
    points: ['7+ healthcare web platforms and 1 mobile app, for 1.5M+ users', 'Simplified navigation and information architecture across platforms', 'Built a scalable design system, component library and design tokens', 'Mentor junior designers and present UX solutions to stakeholders'],
  },
  {
    company: 'Proctur', role: 'Senior UI/UX Designer', period: 'Sep 2022 – Apr 2024',
    summary: 'Led UX for learning management (LMS) and ERP platforms across web and mobile.',
    points: ['15+ LMS/ERP modules for students, teachers, parents and admins', '100+ web screens and 250+ mobile app screens', 'Usability and A/B testing to validate design decisions'],
  },
  {
    company: 'Aiscore', role: 'Junior UI/UX Designer', period: 'Jun 2021 – Aug 2022',
    summary: 'Designed responsive web and mobile interfaces for e-commerce and informational platforms.',
    points: ['Mobile-first user flows, wireframes and prototypes', 'Consistent visual design, typography and colour systems'],
  },
];

const SKILLS = [
  { title: 'UX research & strategy', items: ['User research', 'Personas', 'Journey mapping', 'Competitive analysis'] },
  { title: 'UX design', items: ['User flows', 'Information architecture', 'Wireframing', 'Prototyping', 'Interaction design', 'Usability testing'] },
  { title: 'UI & visual design', items: ['Responsive design', 'Design systems', 'Component libraries', 'Design tokens', 'Accessibility (WCAG 2.1)'] },
  { title: 'Collaboration', items: ['End-to-end product design', 'Agile / Scrum', 'Design handoff', 'Stakeholder presentations'] },
];

const TOOLS = [
  ['Design', 'Figma, FigJam, Adobe XD, Zeplin, Framer, Balsamiq'],
  ['Research & testing', 'Maze, Hotjar, UserTesting, Optimal Workshop, Lookback'],
  ['Collaboration', 'Jira, Confluence, Notion, Miro, Slack, Trello'],
  ['Web', 'Webflow, WordPress, HTML/CSS (basics)'],
  ['AI-assisted design', 'ChatGPT, Claude, Uizard, Galileo AI, Midjourney'],
];

const EDUCATION = [
  ['UI/UX Design and Graphics Course', 'Optimus IT Multimedia Services Training Centre', '2018 – 2019'],
  ['B.Sc. (Bachelor of Science)', 'Amolakchand Mahavidyalaya, Yavatmal · Amravati University', '2013 – 2017'],
];

const VALUES = [
  { title: 'Curiosity', text: 'Exploring new places taught me to look closely and ask why. I bring the same curiosity to every product, user and problem.' },
  { title: 'Simplicity', text: 'I strip interfaces back to what people actually need, so complex tasks feel clear and calm.' },
  { title: 'Empathy', text: 'Good design starts with understanding people and their context, not with screens.' },
];

const PHOTOS = [
  ['sahyadri-viewpoint', 'At a viewpoint above the Sahyadri hills'],
  ['konkan-temple', 'A riverside temple on the Konkan coast'],
  ['monsoon-road', 'A misty road in the monsoon'],
  ['beach-boat', 'Boats on a grey morning by the sea'],
  ['sunset-beach', 'Sunset on a quiet beach'],
  ['seashells', 'A handful of seashells'],
  ['friendly-dog', 'Making a friend on a hike'],
  ['fort-cliff', 'Looking out from a hill fort'],
];

export default function About() {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const framesY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const framesRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);
  return (
    <>
      {/* ── Intro ── */}
      <section className="about-hero" ref={heroRef}>
        <div className="container">
          {/* Each line rises from behind its own edge; the highlight pill then sweeps in behind the last line */}
          <motion.h1 className="about-hero__title" initial="hidden" animate="show" aria-label="While design is what I do, it’s the world around me that truly shapes how I see, feel, and create.">
            {['While design is what I do, it’s the world around me', 'that truly shapes'].map((t, i) => (
              <span key={t} className="about-hero__mask" aria-hidden="true"><motion.span className="about-hero__line" variants={lineUp} custom={i}>{t}</motion.span></span>
            ))}
            <span className="about-hero__mask about-hero__mask--pill" aria-hidden="true">
              <motion.span className="about-hero__pill" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, delay: 0.55, ease } } }} />
              <motion.span className="about-hero__line about-hero__highlight" variants={lineUp} custom={2}>how I see, feel, and create.</motion.span>
            </span>
          </motion.h1>
          <motion.div
            className="about-hero__frames"
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75, duration: 1.1, ease }}
            style={{ y: framesY, rotate: framesRotate }}
          >
            <motion.img
              src="/about/hero-frames-t.webp"
              alt="Three framed photos: a canna flower, Anuradha meditating outdoors, and a palm-lined village path"
              width="1880"
              height="920"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section about-story">
        <div className="container about-story__grid">
          <Reveal className="about-story__lead">
            <p className="eyebrow">My story</p>
            <h2>From exploring places to designing for people</h2>
          </Reveal>
          <motion.div className="about-story__text" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <motion.p variants={rise} className="about-story__big">
              Growing up exploring new places taught me to see the world with curiosity, openness and empathy. Those perspectives naturally shaped how I design.
            </motion.p>
            <motion.p variants={rise}>
              What began as a hobby grew into a career in UI/UX, where I focus on simplicity, clarity and a deep understanding of people and their context.
            </motion.p>
            <motion.p variants={rise}>
              Today I’m a {site.role} based in Pune with 5+ years of experience taking web and mobile products from research to developer handoff. Alongside product design I work in branding, animation and visual art. I love experimenting with new tools, learning continuously and exploring places that change how I think, create and connect.
            </motion.p>
            <motion.ul variants={stagger} className="about-facts" aria-label="At a glance">
              <motion.li variants={rise}><span>Experience</span>5+ years</motion.li>
              <motion.li variants={rise}><span>Based in</span>Pune, India</motion.li>
              <motion.li variants={rise}><span>Languages</span>English, Hindi, Marathi</motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="section section--tint about-exp">
        <div className="container">
          <div className="sh sh--tight">
            <Reveal as="p" className="eyebrow" y={12}>Experience</Reveal>
            <Reveal as="h2" delay={0.06}>Where I’ve worked</Reveal>
          </div>
          <ol className="about-timeline">
            {EXPERIENCE.map((job, i) => (
              <motion.li key={job.company} className="about-job" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: i * 0.08, ease }}>
                <span className={`about-job__dot${job.current ? ' is-current' : ''}`} aria-hidden="true" />
                <div className="about-job__meta">
                  <p className="about-job__period">{job.period}</p>
                  {job.current && <span className="about-job__now">Current</span>}
                </div>
                <div className="about-job__body">
                  <h3>{job.role} <span>· {job.company}</span></h3>
                  <p>{job.summary}</p>
                  <ul>{job.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What shapes my work ── */}
      <section className="section">
        <div className="container">
          <div className="sh sh--tight">
            <Reveal as="p" className="eyebrow" y={12}>What shapes my work</Reveal>
            <Reveal as="h2" delay={0.06}>Three things I carry into every project</Reveal>
          </div>
          <motion.div className="about-values" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            {VALUES.map((v, i) => (
              <motion.article key={v.title} className="about-value" variants={rise} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                <div className="about-value__top">
                  <span className="about-value__badge"><ValueIcon name={v.title} /></span>
                  <span className="about-value__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Skills & tools ── */}
      <section className="section section--tint about-skills">
        <div className="container">
          <div className="sh sh--tight">
            <Reveal as="p" className="eyebrow" y={12}>Skills & tools</Reveal>
            <Reveal as="h2" delay={0.06}>What I bring to a team</Reveal>
          </div>
          <motion.div className="about-skill-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {SKILLS.map((g) => (
              <motion.div key={g.title} className="about-skill" variants={rise}>
                <h3>{g.title}</h3>
                <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </motion.div>
            ))}
          </motion.div>
          <div className="about-lower">
            <Reveal className="about-tools">
              <h3>Tools</h3>
              <dl>{TOOLS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </Reveal>
            <Reveal className="about-edu" delay={0.1}>
              <h3>Education</h3>
              <ul>{EDUCATION.map(([t, where, yrs]) => <li key={t}><strong>{t}</strong><span>{where}</span><em>{yrs}</em></li>)}</ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Beyond the screen ── */}
      <section className="section">
        <div className="container">
          <div className="sh sh--tight">
            <Reveal as="p" className="eyebrow" y={12}>Beyond the screen</Reveal>
            <Reveal as="h2" delay={0.06}>Places that inspire me</Reveal>
            <Reveal as="p" delay={0.12}>Hills, coastlines and monsoon roads, mostly across Maharashtra. Where I go to reset and see things differently.</Reveal>
          </div>
        </div>
        {/* Full-width strip that scrolls on its own; the set is repeated so the loop is seamless */}
        <motion.div
          className="about-marquee"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="about-marquee__track">
            {[...PHOTOS, ...PHOTOS].map(([src, alt], i) => (
              <figure key={i} className="about-photo" aria-hidden={i >= PHOTOS.length || undefined}>
                <img src={`/about/${src}.webp`} alt={i < PHOTOS.length ? alt : ''} width="500" height="596" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Reach out ── */}
      <section className="section section--tint about-cta">
        <div className="container">
          <motion.div
            className="about-cta__card"
            variants={stagger}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="about-cta__glow about-cta__glow--a" aria-hidden="true" />
            <span className="about-cta__glow about-cta__glow--b" aria-hidden="true" />
            <Reveal as="p" className="eyebrow" y={12} delay={0.15}>Reach out anytime</Reveal>
            <Reveal as="h2" delay={0.22}>Let’s create something meaningful together</Reveal>
            <Reveal as="p" className="about-cta__text" delay={0.3}>Open to UI/UX and product design roles and collaborations. The quickest way to reach me is by email or LinkedIn.</Reveal>
            <Reveal className="about-cta__actions" delay={0.4}>
              <a className="btn-work" href={`mailto:${site.email}`}><MailIcon /> Email me</a>
              <a className="btn-outline" href={site.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon /> LinkedIn</a>
              <a className="btn-outline" href={site.resume} download="Anuradha_Mude_UI_UX_Resume.pdf"><DownloadIcon /> Resume</a>
            </Reveal>
            <Reveal as="p" className="about-cta__meta" delay={0.5}>{site.email}<span aria-hidden="true">·</span><Link className="arrow-link" to="/#work">See my work <span className="arr">→</span></Link></Reveal>
          </motion.div>
        </div>
      </section>
    </>
  );
}
