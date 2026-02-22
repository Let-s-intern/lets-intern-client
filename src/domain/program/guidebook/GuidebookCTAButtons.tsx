'use client';

import { DesktopCTA, MobileCTA } from '@/common/button/ApplyCTA';
import GradientButton from '@/domain/program/program-detail/button/GradientButton';
import useAuthStore from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

interface GuidebookCTAButtonsProps {
  title?: string | null;
}

const GuidebookCTAButtons = ({ title }: GuidebookCTAButtonsProps) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const guidebookTitle = title ?? '';

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      const currentSearch = searchParams.toString();
      const redirectUrl = currentSearch
        ? `${currentPath}?${currentSearch}`
        : currentPath;

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // TODO: 결제 데이터 세팅 후에도 이 경로는 유지됩니다.
    router.push('/payment-input');
  };

  return (
    <>
      <DesktopCTA className="hidden items-center justify-between lg:flex">
        <span className="text-xsmall16 font-bold text-neutral-100">
          {guidebookTitle}
        </span>
        <GradientButton
          onClick={handleApplyClick}
          className="apply_button text-xsmall16"
        >
          지금 바로 신청
        </GradientButton>
      </DesktopCTA>

      <MobileCTA title={guidebookTitle} className="lg:hidden">
        <GradientButton
          onClick={handleApplyClick}
          className="apply_button w-full text-xsmall16"
        >
          지금 바로 신청
        </GradientButton>
      </MobileCTA>
    </>
  );
};

export default GuidebookCTAButtons;
