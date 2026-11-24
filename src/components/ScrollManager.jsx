import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on page change, or to #hash targets (after the page transition settles).
export default function ScrollManager() {
  const prev = useRef(null);
  // `key` changes on every navigation, even a click to the URL you're already on
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: window.scrollY > 0 && prev.current === pathname ? 'smooth' : 'instant' });
      prev.current = pathname;
      return;
    }
    prev.current = pathname;
    let tries = 0;
    const id = setInterval(() => {
      const el = document.getElementById(hash.slice(1));
      if (el || ++tries > 20) {
        clearInterval(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    return () => clearInterval(id);
  }, [pathname, hash, key]);
  return null;
}
