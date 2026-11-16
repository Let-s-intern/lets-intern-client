'use client';

import { ChallengeType } from '@/schema';
import { ReactNode } from 'react';
import { useChallengeApplySheetStore } from '../store/useChallengeApplySheetStore';
import TemplateGuidebookDetail from './TemplateGuidebookDetail';
import { useTemplateGuidebook } from './useTemplateGuidebook';

/**
 * 챌린지 상세 본문. '템플릿으로 혼자' 를 고르면 챌린지 본문을 숨기고 가이드북 본문을 보인다.
 * 챌린지 본문은 숨기기만 해 다시 '실시간으로 함께' 를 고르면 그대로 돌아온다 (LC-3631).
 */
function TemplateModeBody({
  challengeType,
  children,
}: {
  challengeType: ChallengeType;
  children: ReactNode;
}) {
  const isTemplateMode = useChallengeApplySheetStore(
    (state) => state.isTemplateMode,
  );
  const { guidebook } = useTemplateGuidebook(challengeType);
  const showTemplate = isTemplateMode && guidebook !== null;

  return (
    <>
      {showTemplate && <TemplateGuidebookDetail guidebook={guidebook} />}
      <div className={showTemplate ? 'hidden' : 'contents'}>{children}</div>
    </>
  );
}

export default TemplateModeBody;
