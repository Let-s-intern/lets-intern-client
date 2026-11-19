import type { LandingContent } from './landingContent';

/**
 * 랜딩 상단 문구. 어드민 값(분류 페이지 또는 예전 랜딩 노출 위치) → 프론트 고정 문구(LANDING_CONTENT) →
 * 분류·노출 목록 이름 순서로 쓴다
 */
export const resolveLandingHero = (
  placement:
    | { heroTitle?: string | null; heroDescription?: string | null }
    | undefined,
  content: LandingContent | undefined,
  groupTitle: string | undefined,
) => ({
  title: placement?.heroTitle || content?.heroTitle || groupTitle || '',
  description:
    placement?.heroDescription || content?.heroDescription || undefined,
});
