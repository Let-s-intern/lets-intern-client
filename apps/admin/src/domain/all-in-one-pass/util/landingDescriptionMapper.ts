import {
  PassExternalLink,
  PassFormInput,
  PassLandingConfig,
  PassLandingReview,
  PassLandingVod,
} from '@/domain/all-in-one-pass/types';
import {
  createDefaultReviews,
  DEFAULT_BENEFIT_ICON_KEY,
  getAdditionalBenefitSlots,
  isReviewEmpty,
} from '@/domain/all-in-one-pass/util/landingOptions';
import dayjs from '@/lib/dayjs';

/**
 * 랜딩 페이지용 `landingDescription`(JSON) ↔ 폼 PassLandingConfig 변환.
 * 비구매자 노출 페이지: 민감 정보(외부링크 url 등)는 담지 않음
 */
interface LandingDescriptionBlob {
  displayDeadline: string | null;
  hero: PassLandingConfig['hero'];
  lexical: PassLandingConfig['lexical'];
  additionalBenefits: Array<{
    name: string;
    description: string;
    iconKey: string;
  }>;
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
  benefitExtras: {},
  manualBenefits: [],
  vods: [],
  vodCount: 0,
  reviews: createDefaultReviews(),
  finalCta: { title: '', description: '' },
});

export const toLandingConfig = (
  landingDescription: string | null | undefined,
  externalLinks: PassExternalLink[],
): PassLandingConfig => {
  const config = createEmptyLandingConfig();
  if (!landingDescription) return config;

  let parsed: Partial<LandingDescriptionBlob>;
  try {
    parsed = JSON.parse(landingDescription) as Partial<LandingDescriptionBlob>;
  } catch {
    return config;
  }

  const linkIdByName = new Map<string, string>();
  externalLinks.forEach((l) => {
    if (!linkIdByName.has(l.name)) linkIdByName.set(l.name, l.id);
  });

  (parsed.additionalBenefits ?? []).forEach((b) => {
    const extra = {
      description: b.description ?? '',
      iconKey: b.iconKey || DEFAULT_BENEFIT_ICON_KEY,
    };
    const linkId = linkIdByName.get(b.name);
    if (linkId) config.benefitExtras[linkId] = extra;
    else
      config.manualBenefits.push({
        id: crypto.randomUUID(),
        name: b.name,
        ...extra,
      });
  });

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
    benefitExtras: config.benefitExtras,
    manualBenefits: config.manualBenefits,
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
  const linkBenefits = externalLinks.map((link) => ({
    name: link.name,
    description: landing.benefitExtras[link.id]?.description ?? '',
    iconKey:
      landing.benefitExtras[link.id]?.iconKey ?? DEFAULT_BENEFIT_ICON_KEY,
  }));
  const manualBenefits = landing.manualBenefits.map((b) => ({
    name: b.name,
    description: b.description,
    iconKey: b.iconKey,
  }));
  // 자동 포함 혜택이 차지한 뒤 남는 슬롯만큼만 저장 (외부링크 우선, 그다음 수동)
  const additionalBenefits = [...linkBenefits, ...manualBenefits].slice(
    0,
    getAdditionalBenefitSlots(input.plans),
  );
  return JSON.stringify({
    // 운영자가 선택한 시각 그대로 저장(초 단위는 00으로 정규화)
    displayDeadline: landing.displayDeadline
      ? dayjs(landing.displayDeadline).second(0).format('YYYY-MM-DDTHH:mm:ss')
      : null,
    hero: landing.hero,
    lexical: landing.lexical,
    additionalBenefits,
    vods: landing.vods,
    vodCount: landing.vodCount,
    // 빈 후기는 저장 안 함 — 전부 비어 있으면 reviews:[] 로 랜딩 후기 섹션 미노출
    reviews: landing.reviews
      .filter((r) => !isReviewEmpty(r))
      .map(({ id: _id, ...rest }) => rest),
    finalCta: landing.finalCta,
  } satisfies LandingDescriptionBlob);
};
