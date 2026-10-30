import {
  PassFormInput,
  PassLandingConfig,
  PassLandingReview,
  PassLandingVod,
} from '@/domain/all-in-one-pass/types';
import {
  createDefaultReviews,
  DEFAULT_BENEFIT_ICON_KEY,
  isReviewEmpty,
  MAX_BENEFIT_CARDS,
} from '@/domain/all-in-one-pass/util/landingOptions';
import dayjs from '@/lib/dayjs';

/**
 * 랜딩 페이지용 `landingDescription`(JSON) ↔ 폼 PassLandingConfig 변환.
 * 비구매자 노출 페이지: 민감 정보(외부링크 url 등)는 담지 않음.
 * 혜택요약은 benefitsSummary(카드 6칸, VOD 제외) 통째로, 가격섹션 '특별 혜택' 칩은 specialBenefitTitles(외부링크명)로 저장.
 */
interface LandingDescriptionBlob {
  displayDeadline: string | null;
  hero: PassLandingConfig['hero'];
  lexical: PassLandingConfig['lexical'];
  benefitsSummary: Array<{
    iconKey: string;
    name: string;
    description: string;
  }>;
  /** 가격섹션 '패스 전용 특별 혜택' 칩 (외부링크명) */
  specialBenefitTitles: string[];
  vods: PassLandingVod[];
  vodCount: number; // 전체 VOD 수(목록 길이)
  reviews: Array<Omit<PassLandingReview, 'id'>>;
  finalCta: PassLandingConfig['finalCta'];
}

export const createEmptyLandingConfig = (): PassLandingConfig => ({
  displayDeadline: null,
  hero: { title: '', description: '', recruitFootnote: '' },
  lexical: {
    introSection: '',
    playbookSection: '',
    benefitSection: '',
    reviewSection: '',
  },
  benefitsSummary: [],
  vods: [],
  vodCount: 0,
  reviews: createDefaultReviews(),
  finalCta: { title: '', description: '' },
});

export const toLandingConfig = (
  landingDescription: string | null | undefined,
): PassLandingConfig => {
  const config = createEmptyLandingConfig();
  if (!landingDescription) return config;

  let parsed: Partial<LandingDescriptionBlob>;
  try {
    parsed = JSON.parse(landingDescription) as Partial<LandingDescriptionBlob>;
  } catch {
    return config;
  }

  return {
    displayDeadline: parsed.displayDeadline ?? null,
    hero: {
      title: parsed.hero?.title ?? '',
      description: parsed.hero?.description ?? '',
      recruitFootnote: parsed.hero?.recruitFootnote ?? '',
    },
    lexical: {
      introSection: parsed.lexical?.introSection ?? '',
      playbookSection: parsed.lexical?.playbookSection ?? '',
      benefitSection: parsed.lexical?.benefitSection ?? '',
      reviewSection: parsed.lexical?.reviewSection ?? '',
    },
    // 저장된 benefitsSummary 그대로(새 id). 없으면 빈 목록 → 에디터가 플랜 기준으로 시드.
    benefitsSummary: (parsed.benefitsSummary ?? [])
      .slice(0, MAX_BENEFIT_CARDS)
      .map((b) => ({
        id: crypto.randomUUID(),
        iconKey: b.iconKey || DEFAULT_BENEFIT_ICON_KEY,
        name: b.name ?? '',
        description: b.description ?? '',
      })),
    vods: (parsed.vods ?? []).map((v) => ({
      title: v.title ?? '',
      thumbnail: v.thumbnail ?? '',
      description: v.description ?? '',
    })),
    vodCount: parsed.vodCount ?? 0,
    // 저장된 후기가 있으면 그대로, 없으면 기본 6개
    reviews: parsed.reviews?.length
      ? parsed.reviews.map((r) => ({
          id: crypto.randomUUID(),
          source: r.source ?? '',
          resultTags: r.resultTags ?? [],
          imageUrl: r.imageUrl ?? '',
          summary: r.summary ?? '',
        }))
      : createDefaultReviews(),
    finalCta: {
      title: parsed.finalCta?.title ?? '',
      description: parsed.finalCta?.description ?? '',
    },
  };
};

export const serializeLandingDescription = (input: PassFormInput): string => {
  const { landing, externalLinks } = input;
  // 이름이 비어있는 카드는 저장 제외, id 는 직렬화 X, 최대 6개
  const benefitsSummary = landing.benefitsSummary
    .filter((b) => b.name.trim())
    .slice(0, MAX_BENEFIT_CARDS)
    .map((b) => ({
      iconKey: b.iconKey || DEFAULT_BENEFIT_ICON_KEY,
      name: b.name,
      description: b.description,
    }));
  // 가격섹션 '특별 혜택' 칩 = 외부링크명
  const specialBenefitTitles = externalLinks
    .map((l) => l.name.trim())
    .filter(Boolean);
  return JSON.stringify({
    // 운영자가 선택한 시각 그대로 저장(초 단위는 00으로 정규화)
    displayDeadline: landing.displayDeadline
      ? dayjs(landing.displayDeadline).second(0).format('YYYY-MM-DDTHH:mm:ss')
      : null,
    hero: landing.hero,
    lexical: landing.lexical,
    benefitsSummary,
    specialBenefitTitles,
    vods: landing.vods,
    vodCount: landing.vodCount,
    // 빈 후기는 저장 안 함 — 전부 비어 있으면 reviews:[] 로 랜딩 후기 섹션 미노출
    reviews: landing.reviews
      .filter((r) => !isReviewEmpty(r))
      .map(({ id: _id, ...rest }) => rest),
    finalCta: landing.finalCta,
  } satisfies LandingDescriptionBlob);
};
