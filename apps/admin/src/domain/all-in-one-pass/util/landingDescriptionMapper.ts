import {
  PassExternalLink,
  PassFormInput,
  PassLandingConfig,
  PassLandingReview,
} from '@/domain/all-in-one-pass/types';
import { DEFAULT_BENEFIT_ICON_KEY } from '@/domain/all-in-one-pass/util/landingOptions';

/**
 * 랜딩 페이지용 `landingDescription`(JSON) ↔ 폼 PassLandingConfig 변환.
 *
 * 랜딩은 description이 아니라 이 필드만 읽는다(비구매자 노출 페이지). 민감 정보(외부링크
 * url 등)는 담지 않는다. 확장형 — 필드가 늘면 여기에 추가한다.
 */
interface LandingDescriptionBlob {
  hero: PassLandingConfig['hero'];
  lexical: PassLandingConfig['lexical'];
  // 추가혜택: 편집 중 쪼개둔 외부링크 유래분 + 수동분을 합친 결과(url 제거)
  additionalBenefits: Array<{
    name: string;
    description: string;
    iconKey: string;
  }>;
  reviews: Array<Omit<PassLandingReview, 'id'>>; // 폼 로컬 id 는 저장 안 함
  finalCta: PassLandingConfig['finalCta'];
}

export const createEmptyLandingConfig = (): PassLandingConfig => ({
  hero: { title: '', description: '', recruitFootnote: '' },
  lexical: {
    introSection: '',
    playbookSection: '',
    benefitSection: '',
    reviewSection: '',
  },
  benefitExtras: {},
  manualBenefits: [],
  reviews: [],
  finalCta: { title: '', description: '' },
});

/**
 * landingDescription(JSON) → 폼 PassLandingConfig.
 *
 * 추가혜택은 저장 시 name 만 남고 출처(외부링크/수동) 구분이 사라지므로, 외부링크 목록의
 * name 과 매칭해 되살린다: name 이 외부링크와 같으면 그 링크 id 의 benefitExtras 로, 아니면
 * manualBenefits 로 복원한다. (링크명을 나중에 바꾸면 매칭이 끊겨 수동분으로 떨어질 수 있다)
 */
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
    reviews: (parsed.reviews ?? []).map((r) => ({
      id: crypto.randomUUID(),
      source: r.source ?? '',
      resultTag: r.resultTag ?? '',
      imageUrl: r.imageUrl ?? '',
      summary: r.summary ?? '',
    })),
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
  return JSON.stringify({
    hero: landing.hero,
    lexical: landing.lexical,
    additionalBenefits: [...linkBenefits, ...manualBenefits],
    reviews: landing.reviews.map(({ id: _id, ...rest }) => rest),
    finalCta: landing.finalCta,
  } satisfies LandingDescriptionBlob);
};
