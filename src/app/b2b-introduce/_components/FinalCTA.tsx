'use client';

import CTAButton from './CTAButton';

export default function FinalCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
      <h3 className="text-1.5-semibold">교육기관의 목표에 맞춘 파트너가 필요하신가요?</h3>
      <p className="mt-2 text-1.125 text-neutral-600">
        간단한 정보를 남겨주시면 담당자가 빠르게 연락드릴게요.
      </p>
      <div className="mt-6 flex justify-center">
        <CTAButton onClick={onClick}>맞춤 견적 문의</CTAButton>
      </div>
    </div>
  );
}

