'use client';

import { DesktopCTA } from '@/common/button/ApplyCTA';
import Link from 'next/link';

const ProgramRecommendSnackbar = () => (
  <DesktopCTA className="bg-primary left-5 right-5 w-auto max-w-[1200px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_4px_40px_0_rgba(0,0,0,0.25)]">
    <Link
      href="/program?type=CHALLENGE"
      className="text-xsmall16 block w-full text-center text-neutral-100"
    >
      다음 수강 추천 챌린지 보러가기
    </Link>
  </DesktopCTA>
);

export default ProgramRecommendSnackbar;
