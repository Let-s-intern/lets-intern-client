'use client';

import { Break } from '@components/Break';
import finalCtaBg from '../_images/final-cta-bg.png';

export default function FinalCTA() {
  return (
    <div
      className="rounded-md bg-cover bg-center p-8 text-center shadow-sm md:p-12"
      style={{
        backgroundImage: `url("${finalCtaBg.src}")`,
      }}
    >
      <h3 className="text-1.5-semibold text-xxlarge36 font-semibold text-white">
        여러분의 기관에 맞춘 취업 교육
        <Break />
        지금 바로 제안 받아 보세요.
      </h3>
      <div className="mt-8 flex items-center justify-center gap-3">
        <a
          href="#intro"
          className="inline-flex items-center justify-center rounded-xs bg-white px-5 py-3 text-xsmall16 font-medium text-black shadow-sm transition hover:text-neutral-20 md:px-5 md:text-xsmall16"
        >
          기업 소개서 받기
        </a>

        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-xs bg-neutral-900 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-5 md:text-xsmall16"
        >
          맞춤 교육 문의
        </a>
      </div>
    </div>
  );
}
