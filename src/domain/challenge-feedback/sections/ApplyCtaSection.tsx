'use client';

import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import type { ChallengeData } from '../types';

interface ApplyCtaSectionProps {
  challenge: ChallengeData;
}

const ApplyCtaSection = memo(function ApplyCtaSection({
  challenge,
}: ApplyCtaSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 히어로 영역(약 300px) 지나면 표시
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 md:bottom-8 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Link
        href={challenge.detailUrl}
        className="flex items-center gap-2 rounded-full border border-[#7C6BFF]/40 bg-[#7C6BFF] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_24px_rgba(124,107,255,0.4)] transition-all hover:bg-[#6B5CE7] hover:shadow-[0_4px_32px_rgba(124,107,255,0.6)] md:px-10 md:py-4 md:text-base"
      >
        {challenge.fullName} 신청하러 가기
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="ml-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
});

export default ApplyCtaSection;
