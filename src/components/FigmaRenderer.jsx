// Renders the layout tree produced from the Figma file (src/data/pages/*.json)
// as real HTML (flexbox + text), with scroll-triggered animations.
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Graphic from './Graphic.jsx';

const ease = [0.22, 1, 0.36, 1];
const reveal = (delay = 0, y = 26) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15, margin: '0px 0px -40px 0px' },
  transition: { duration: 0.75, delay, ease },
});

function TextContent({ node }) {
  if (node.v.startsWith('Home /')) {
    // Breadcrumb: "Home / Case studies / Title"
    const parts = node.v.split(' / ');
    return parts.map((p, i) => (
      <Fragment key={i}>
        {i === 0 ? <Link className="fg-link" to="/">{p}</Link> : i === 1 ? <Link className="fg-link" to="/#case-studies">{p}</Link> : <span>{p}</span>}
        {i < parts.length - 1 && <span style={{ margin: '0 8px' }}>/</span>}
      </Fragment>
    ));
  }
  if (node.r) return node.r.map(([t, s], i) => (s ? <span key={i} style={s}>{t}</span> : <Fragment key={i}>{t}</Fragment>));
  return node.v;
}

// Semantic heading level from the Figma type scale.
function tagFor(s) {
  if (s.fontSize >= 56) return 'h1';
  if (s.fontSize >= 28) return 'h2';
  if (s.fontSize >= 18 && s.fontWeight >= 600) return 'h3';
  if (s.fontSize >= 16 && s.fontWeight >= 600) return 'h4';
  return 'p';
}

function isCard(s) {
  return s && (s.border || s.boxShadow) && (s.backgroundColor === '#ffffff' || s.backgroundColor === '#fdfdfd') && s.padding;
}

function Node({ node, depth, index, clipped = false }) {
  const animate = depth >= 2 && depth <= 3;
  // Inside a clipping parent, slide-in offsets would hide the element from the in-view observer: fade only.
  const dy = (y) => (clipped ? 0 : y);
  const delay = animate ? Math.min(index, 6) * 0.06 : 0;

  if (node.t === 'x') {
    const style = { margin: 0, whiteSpace: 'pre-line', ...node.s };
    // Comfortable measure: running text never exceeds ~80 characters per line.
    const fs = node.s.fontSize;
    if (node.full) style.maxWidth = '100%'; // opted out of the reading-measure cap
    else if (fs >= 16 && fs <= 20 && node.s.fontWeight === 400) {
      const cap = fs >= 20 ? 880 : 760;
      style.maxWidth = typeof style.maxWidth === 'number' ? Math.min(style.maxWidth, cap) : cap;
      if (style.textAlign === 'center') style.marginInline = 'auto';
    }
    const content = <TextContent node={node} />;
    if (node.href) {
      return (
        <motion.div style={style} {...(animate ? reveal(delay, dy(12)) : {})}>
          <Link className="fg-link" to={node.href}>{content}</Link>
        </motion.div>
      );
    }
    const tag = tagFor(node.s);
    const big = tag === 'h1' || tag === 'h2';
    const Tag = motion[tag];
    return <Tag className={`fg-${tag}${node.cls ? ' ' + node.cls : ''}`} style={style} {...(animate || big ? reveal(delay, dy(big ? 20 : 14)) : {})}>{content}</Tag>;
  }

  if (node.t === 'i') {
    // Reserve the real size before the image loads (percent widths inside shrink-to-fit parents collapse).
    if (node.s.width === '100%' && node.s.maxWidth) node = { ...node, s: { ...node.s, width: node.s.maxWidth, maxWidth: '100%' } };
    const anim = depth >= 2
      ? { initial: { opacity: 0, y: dy(40), scale: clipped ? 1 : 0.97 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true, amount: 0.1 }, transition: { duration: 0.9, delay: Math.min(index, 4) * 0.08, ease } }
      : {};
    const small = node.w <= 64 && node.h <= 64;
    if (node.hs) {
      // Mobile: wide visuals scroll sideways, as designed in Figma.
      return (
        <motion.div className="fg-hscroll" style={node.s} {...anim}>
          <img src={'/' + node.src} alt={node.alt || ''} loading="lazy" decoding="async" style={{ width: node.hs, maxWidth: 'none', height: 'auto', aspectRatio: node.ar }} />
          <span className="fg-hscroll__hint">Swipe →</span>
        </motion.div>
      );
    }
    return (
      <motion.div className="fg-img" style={node.s} {...(small ? {} : anim)}>
        <img src={'/' + node.src} alt={node.alt || ''} loading={depth > 1 ? 'lazy' : 'eager'} decoding="async" width={Math.round(node.w)} height={Math.round(node.h)} style={node.imgStyle} />
      </motion.div>
    );
  }

  if (node.t === 'r') return <div style={node.s} />;
  if (node.t === 'g') return <Graphic node={node} />;

  // Figma clips most frames by default; only keep clipping where rounded corners need it.
  if (node.s.overflow === 'hidden' && !node.s.borderRadius) {
    const { overflow, ...rest } = node.s;
    node = { ...node, s: rest };
  }
  // Let auto-layout frames shrink on narrower screens instead of overflowing.
  if (depth > 0) node = { ...node, s: { minWidth: 0, maxWidth: '100%', ...node.s } };
  const clips = node.s.overflow === 'hidden';
  const children = node.c?.map((c, i) => <Node key={i} node={c} depth={depth + 1} index={i} clipped={clips} />);
  // Figma packs wrapping rows to the pixel; give the browser a little slack for sub-pixel text widths.
  if (node.s.flexWrap === 'wrap') node = { ...node, s: { ...node.s, marginRight: -4 } };
  if (depth === 0) {
    return <section className="fg-section" style={node.s} data-name={node.n}>{children}</section>;
  }
  const card = isCard(node.s);
  if (animate || card) {
    return (
      <motion.div className={card ? 'fg-card' : undefined} style={node.s} {...(animate ? reveal(delay, dy(26)) : {})}>
        {children}
      </motion.div>
    );
  }
  return <div style={node.s}>{children}</div>;
}

// One consistent vertical rhythm between sections (Figma used 112–128px on both sides,
// which doubled up between sections sharing a background).
// Same section spacing as the homepage (.section: 112px desktop, 72px mobile).
const RHYTHM = { desktop: { gap: 112, heroTop: 40, heroBottom: 112 }, mobile: { gap: 72, heroTop: 24, heroBottom: 72 } };
const bgOf = (s) => s.backgroundColor || s.background || '#ffffff';

function spaced(sections, variant) {
  const r = RHYTHM[variant];
  return sections.map((sec, i) => {
    const prev = sections[i - 1];
    const parts = (sec.s.padding || '0px').split(' ');
    const right = parts.length === 1 ? parts[0] : parts[1];
    const left = parts.length === 4 ? parts[3] : right;
    let top = r.gap;
    let bottom = r.gap;
    if (sec.n === 'Breadcrumb') return sec;
    if (sec.n === 'Hero') {
      top = prev?.n === 'Breadcrumb' ? 8 : r.heroTop;
      bottom = r.heroBottom;
    } else if (prev && bgOf(prev.s) === bgOf(sec.s)) {
      top = 0; // same background as the section above: its bottom padding is the gap
    }
    return { ...sec, s: { ...sec.s, padding: `${top}px ${right} ${bottom}px ${left}` } };
  });
}

export default function FigmaRenderer({ page, variant = 'desktop' }) {
  return spaced(page.sections, variant).map((s, i) => <Node key={i} node={s} depth={0} index={i} />);
}
