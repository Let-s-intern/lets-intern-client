import Link from 'next/link';
import { memo } from 'react';
import type { ChallengeData } from '../types';

interface ApplyCtaSectionProps {
  challenge: ChallengeData;
}

const ApplyCtaSection = memo(function ApplyCtaSection({
  challenge,
}: ApplyCtaSectionProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0C0A1D] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <Link
          href={challenge.detailUrl}
          className="inline-block rounded-xl bg-gray-200 px-12 py-5 text-lg font-bold text-gray-900 transition-colors hover:bg-white md:text-xl"
        >
          {challenge.fullName} 신청하러 가기
        </Link>
      </div>
    </section>
  );
});

export default ApplyCtaSection;
