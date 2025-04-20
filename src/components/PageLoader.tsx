'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const PageBlurOverlay = () => {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]); // re-run effect on every route change

  return (
    <AnimatePresence mode="popLayout">
      {show && (
        <motion.div
          key={pathname} // ensures animation re-runs
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};

export default PageBlurOverlay;
