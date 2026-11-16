'use client';

import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '../../../../common/button/ApplyCTA';
import { useGuidebookApply } from '../hooks/useGuidebookApply';

interface GuidebookCTAButtonsProps {
  guidebookId: string;
  title?: string | null;
  /** 데스크톱 바에 보일 결제 금액 (챌린지 상세의 템플릿 모드에서 넘긴다) */
  price?: number;
}

const GuidebookCTAButtons = ({
  guidebookId,
  title,
  price,
}: GuidebookCTAButtonsProps) => {
  const { onApplyClick, isAlreadyApplied } = useGuidebookApply(
    guidebookId,
    title,
  );
  const programTitle = title ?? '';

  return (
    <>
      <DesktopApplyCTA
        price={price}
        program={{
          title: programTitle,
          beginning: null,
          deadline: null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />

      <MobileApplyCTA
        program={{
          title: programTitle,
          beginning: null,
          deadline: null,
        }}
        onApplyClick={onApplyClick}
        isAlreadyApplied={isAlreadyApplied}
      />
    </>
  );
};

export default GuidebookCTAButtons;
