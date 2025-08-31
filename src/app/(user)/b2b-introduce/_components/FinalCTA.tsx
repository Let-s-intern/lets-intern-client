'use client';

import CTAButton from './CTAButton';

export default function FinalCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
      <h3 className="text-1.5-semibold">
        여러분의 기관에 맞춘 취업 교육, 지금 바로 제안 받아보세요.
      </h3>
      <p className="text-1.125 mt-2 text-neutral-600">
        간단한 정보를 남겨주시면 담당자가 빠르게 연락드릴게요.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a
          href="#"
          className="text-1-medium rounded-lg border border-neutral-200 bg-white px-4 py-2.5 hover:bg-neutral-50"
        >
          기업소개서 받기
        </a>
        <CTAButton onClick={onClick}>맞춤 교육 문의</CTAButton>
      </div>
    </div>
  );
}
