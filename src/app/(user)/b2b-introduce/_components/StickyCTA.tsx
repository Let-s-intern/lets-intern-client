'use client';

import { useEffect, useState } from 'react';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky bottom-4 z-50 mx-auto w-fit">
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
    </div>
  );
}
