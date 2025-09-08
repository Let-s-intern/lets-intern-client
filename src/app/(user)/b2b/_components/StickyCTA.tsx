'use client';

import { twMerge } from '@/lib/twMerge';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { contactLink } from './const';

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
        className="sticky bottom-4 z-50 mx-auto w-full md:w-fit"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 1.2,
        }}
      >
        <div className="mx-4 flex items-center gap-3 rounded-sm bg-black/60 px-4 py-3 shadow-lg backdrop-blur-lg md:px-6">
          <span className="hidden text-small20 font-semibold text-white md:mr-20 md:block">
            취업 교육은 렛츠커리어
          </span>
          <div className="flex flex-1 items-center gap-3 md:flex-auto">
            <a
              href="https://drive.google.com/drive/folders/16neodrrBoI3RcS_FLvVVS9TisZTwWlbn?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className={twMerge(
                'b2b-sticky-intro-download',
                'rounded-xs bg-white px-5 py-3 text-xsmall14 font-medium text-primary shadow-sm transition hover:text-primary-90',
                'inline-flex flex-1 items-center justify-center md:flex-auto md:text-xsmall16',
              )}
            >
              교육 소개서 받기
            </a>

            <a
              href={contactLink}
              target="_blank"
              className={twMerge(
                'b2b-sticky-contact-form',
                'rounded-xs bg-primary px-5 py-3 text-xsmall14 font-medium text-white shadow-sm hover:bg-primary',
                'inline-flex flex-1 items-center justify-center md:flex-auto md:text-xsmall16',
              )}
            >
              맞춤 교육 문의
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
