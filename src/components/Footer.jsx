import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo.jsx';
import { nav, site } from '../data/site.js';
import { Reveal } from './Reveal.jsx';
import { InstagramIcon, LinkedInIcon } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <motion.div
        className="footer__glow"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container">
        {/* Centred "Let's Connect" block: heading, invitation, email, contact icons */}
        <Reveal className="footer__top">
          <h2 className="footer__title">Let’s Connect</h2>
          <p className="footer__tag">Feel free to reach out for collaborations or just a friendly hello <span role="img" aria-label="smiling face">😀</span></p>
          <a className="footer__email" href={`mailto:${site.email}`}>{site.email}</a>
          <div className="socials footer__socials">
            <a className="social social--light" href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a className="social social--light" href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
          </div>
        </Reveal>
        <motion.div
          className="footer__divider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="footer__bottom">
          <p className="footer__copy"><Logo light animate={false} /><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span></p>
          <nav className="footer__nav" aria-label="Footer">
            {nav.map((item) => (item.href
              ? <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
              : <Link key={item.label} to={item.to}>{item.label}</Link>))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
