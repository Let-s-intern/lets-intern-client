import type { ProgramCategoryPlacement } from '@/api/program-category/programCategory';
import type { LandingContent } from './landingContent';

/** 랜딩 상단 문구. 어드민 값 → 프론트 고정 문구(LANDING_CONTENT) → 노출 목록 이름 순서로 쓴다 */
export const resolveLandingHero = (
  placement: ProgramCategoryPlacement | undefined,
  content: LandingContent | undefined,
  groupTitle: string | undefined,
) => ({
  title: placement?.heroTitle || content?.heroTitle || groupTitle || '',
  description:
    placement?.heroDescription || content?.heroDescription || undefined,
});
