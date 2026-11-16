'use client';

import { useGuidebookApply } from '@/domain/program/guidebook/hooks/useGuidebookApply';
import { ApplyButton } from '../challenge-view/apply-header/ApplyPriceCard';

/** '템플릿으로 혼자' 일 때 가격 카드의 구매 버튼. 가이드북 결제로 보낸다 */
function TemplateApplyButton({
  guidebookId,
  title,
}: {
  guidebookId: number;
  title: string;
}) {
  const { onApplyClick, isAlreadyApplied } = useGuidebookApply(
    String(guidebookId),
    title,
  );
  return (
    <ApplyButton
      state={isAlreadyApplied ? 'APPLIED' : 'OPEN'}
      label="템플릿 구매하기"
      onClick={onApplyClick}
    />
  );
}

export default TemplateApplyButton;
