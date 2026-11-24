import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Chevron, CloseIcon } from './Icons.jsx';

export default function Lightbox({ open, title, images, onClose, start = 0 }) {
  const [[index, dir], setState] = useState([0, 0]);
  const go = useCallback((d) => setState(([i]) => [(i + d + images.length) % images.length, d]), [images.length]);

  useEffect(() => { if (open) setState([start, 0]); }, [open, start]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, go, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
            <h3>{title} <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 14 }}>· {index + 1} / {images.length}</span></h3>
            <button className="lb-btn" onClick={onClose} aria-label="Close"><span style={{ width: 22, height: 22, display: 'inline-flex' }}><CloseIcon /></span></button>
          </div>
          <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${title} — screen ${index + 1}`}
                custom={dir}
                initial={{ opacity: 0, x: dir * 80, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -80, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag={images.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous"><Chevron dir="left" /></button>
                <button className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next"><Chevron /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="lightbox__dots" onClick={(e) => e.stopPropagation()}>
              {images.map((src, i) => (
                <button key={src} className={i === index ? 'on' : ''} aria-label={`Screen ${i + 1}`} onClick={() => setState([i, i > index ? 1 : -1])} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
