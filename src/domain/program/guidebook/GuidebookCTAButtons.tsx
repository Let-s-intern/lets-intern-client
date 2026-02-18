'use client';

import { DesktopCTA, MobileCTA } from '@/common/button/ApplyCTA';
import GradientButton from '@/domain/program/program-detail/button/GradientButton';

interface GuidebookCTAButtonsProps {
  title?: string | null;
}

const GuidebookCTAButtons = ({ title }: GuidebookCTAButtonsProps) => {
  const guidebookTitle = title ?? '';

  const handleApplyClick = () => {
    // TODO: 결제 페이지 연동
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
