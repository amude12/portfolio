import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { nav, site } from '../data/site.js';
import { MenuIcon, CloseIcon } from './Icons.jsx';
import Logo from './Logo.jsx';

const ease = [0.22, 1, 0.36, 1];

function useActiveLabel() {
  const { pathname, hash } = useLocation();
  const [label, setLabel] = useState('Home');
  useEffect(() => {
    if (pathname.startsWith('/work')) return setLabel('My Work');
    if (pathname === '/about') return setLabel('About Me');
    // Homepage: "My Work" while the work sections (Selected Work → Beyond Case Studies) fill the middle of the screen.
    const first = document.getElementById('work');
    const last = document.getElementById('beyond') || first;
    if (!first) return setLabel('Home');
    const update = () => {
      const mid = window.innerHeight / 2;
      const inWork = first.getBoundingClientRect().top <= mid && last.getBoundingClientRect().bottom >= mid;
      setLabel(inWork ? 'My Work' : 'Home');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [pathname, hash]);
  return label;
}

function NavItem({ item, active, onClick, className }) {
  const inner = (
    <>
      {item.label}
      {active && className === 'nav__link' && (
        <motion.span layoutId="nav-underline" className="nav__underline" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
      )}
    </>
  );
  const cls = `${className}${active ? ' is-active' : ''}`;
  if (item.href) {
    return <a className={cls} href={item.href} target="_blank" rel="noreferrer" onClick={onClick}>{inner}</a>;
  }
  return <Link className={cls} to={item.to} onClick={onClick}>{inner}</Link>;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveLabel();
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // Mobile menu: the same items as the desktop navigation
  const mobileItems = nav;

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <motion.header
        className={`header${scrolled || open ? ' is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="container header__inner">
          <Link to="/" className="brand" aria-label={`${site.name} — home`}>
            <Logo />
          </Link>
          <nav className="nav" aria-label="Primary">
            {nav.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease }}>
                <NavItem item={item} active={active === item.label} className="nav__link" />
              </motion.div>
            ))}
          </nav>
          <button className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                {open ? <CloseIcon /> : <MenuIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease }}
          >
            {mobileItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease }}>
                <NavItem item={item} active={active === item.label} className="" onClick={() => setOpen(false)} />
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
