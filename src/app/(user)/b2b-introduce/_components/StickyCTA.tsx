'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function StickyCTA() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Show animation 3 seconds after component mount
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="sticky bottom-4 z-50 mx-auto w-fit"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 1.2 }}
      >
        <div className="flex items-center gap-3 rounded-sm bg-black/60 px-6 py-3 shadow-lg backdrop-blur-lg">
          <span className="text-small20 font-semibold text-white md:mr-20">
            취업 교육은 렛츠커리어
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#intro"
              className="inline-flex items-center justify-center rounded-xs bg-white px-5 py-3 text-xsmall16 font-medium text-primary shadow-sm transition hover:text-primary-90 md:px-5 md:text-xsmall16"
            >
              교육 소개서 받기
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xs bg-primary px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-5 md:text-xsmall16"
            >
              맞춤 교육 문의
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
