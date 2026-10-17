// landingDescription(JSON) 파싱 + 혜택요약 카드 파생(어드민 serialize 스키마와 1:1).
import type { SerializedLexicalNode } from 'lexical';
import type { AllInOnePassPlan, PassProgramType } from '../types';

export interface LandingBenefit {
  name: string;
  description: string;
  iconKey: string;
}

export interface LandingReview {
  source: string;
  resultTags: string[];
  imageUrl: string;
  summary: string;
}

export interface LandingDescription {
  hero: { title: string; description: string; recruitFootnote: string };
  lexical: {
    introSection: string;
    playbookSection: string;
    benefitSection: string;
    reviewSection: string;
  };
  additionalBenefits: LandingBenefit[];
  reviews: LandingReview[];
  finalCta: { title: string; description: string };
}

export const emptyLandingDescription = (): LandingDescription => ({
  hero: { title: '', description: '', recruitFootnote: '' },
  lexical: {
    introSection: '',
    playbookSection: '',
    benefitSection: '',
    reviewSection: '',
  },
  additionalBenefits: [],
  reviews: [],
  finalCta: { title: '', description: '' },
});

/** landingDescription(JSON) → LandingDescription (깨진 값 방어) */
export const parseLandingDescription = (
  json: string | null | undefined,
): LandingDescription => {
  const empty = emptyLandingDescription();
  if (!json) return empty;
  let parsed: Partial<LandingDescription>;
  try {
    parsed = JSON.parse(json) as Partial<LandingDescription>;
  } catch {
    return empty;
  }
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
    additionalBenefits: (parsed.additionalBenefits ?? []).map((b) => ({
      name: b.name ?? '',
      description: b.description ?? '',
      iconKey: b.iconKey ?? DEFAULT_BENEFIT_ICON_KEY,
    })),
    reviews: (parsed.reviews ?? []).map((r) => ({
      source: r.source ?? '',
      resultTags: r.resultTags ?? [],
      imageUrl: r.imageUrl ?? '',
      summary: r.summary ?? '',
    })),
    finalCta: {
      title: parsed.finalCta?.title ?? '',
      description: parsed.finalCta?.description ?? '',
    },
  };
};

/** 렉시컬 직렬화 문자열 → root 노드 (LexicalContent node prop) */
export const parseLexicalRoot = (
  json: string | null | undefined,
): SerializedLexicalNode | null => {
  if (!json) return null;
  try {
    return (JSON.parse(json).root as SerializedLexicalNode) ?? null;
  } catch {
    return null;
  }
};

// ─── 혜택요약 카드 (코어 union + 추가혜택) ───
const ICON_BASE = '/icons/all-in-one-pass-benefit';

const BENEFIT_ICON_SRC: Record<string, string> = {
  challenge: `${ICON_BASE}-challenge.svg`,
  vod: `${ICON_BASE}-vod.svg`,
  guidebook: `${ICON_BASE}-guidebook.svg`,
  liveSeminar: `${ICON_BASE}-live-seminar.svg`,
  mentoring: `${ICON_BASE}-mentoring.svg`,
  playbook: `${ICON_BASE}-playbook.svg`,
  point: `${ICON_BASE}-point.svg`,
  coupon: `${ICON_BASE}-coupon.svg`,
};

const DEFAULT_BENEFIT_ICON_KEY = 'challenge';

export const getBenefitIconSrc = (iconKey: string): string =>
  BENEFIT_ICON_SRC[iconKey] ?? BENEFIT_ICON_SRC[DEFAULT_BENEFIT_ICON_KEY];

export interface BenefitCard {
  name: string;
  description: string;
  iconSrc: string;
}

/** 혜택요약에 노출되는 총 카드 수 상한 (어드민과 동일) */
const MAX_BENEFIT_CARDS = 6;

// 플랜 권한(programType)별 자동 포함 혜택 프리셋 — 어드민 CORE_BENEFIT_PRESETS 미러
const CORE_BENEFIT_PRESETS: Record<PassProgramType, BenefitCard> = {
  CHALLENGE: {
    name: '챌린지 10종',
    description: '자소서·포폴부터 면접·인적성까지',
    iconSrc: BENEFIT_ICON_SRC.challenge,
  },
  VOD: {
    name: 'VOD 20종',
    description: '현직자가 알려주는 직무·취업 노하우',
    iconSrc: BENEFIT_ICON_SRC.vod,
  },
  GUIDEBOOK: {
    name: '가이드북 7종',
    description: '막막할 때 꺼내 보는 취준 가이드',
    iconSrc: BENEFIT_ICON_SRC.guidebook,
  },
  LIVE: {
    name: 'LIVE 세미나',
    description: '현직자가 전하는 실시간 세미나',
    iconSrc: BENEFIT_ICON_SRC.liveSeminar,
  },
};

const CORE_BENEFIT_ORDER: PassProgramType[] = [
  'CHALLENGE',
  'VOD',
  'GUIDEBOOK',
  'LIVE',
];

const MENTORING_BENEFIT: BenefitCard = {
  name: '1:1 멘토링 할인 쿠폰',
  description: '현직자 1:1 상담을 할인된 가격에',
  iconSrc: BENEFIT_ICON_SRC.mentoring,
};

/** 플랜 권한 union → 자동 포함 혜택 (+ 멘토링 항상) */
export const getCoreBenefits = (plans: AllInOnePassPlan[]): BenefitCard[] => {
  const union = new Set<PassProgramType>();
  plans.forEach((p) => p.privileges.forEach((pv) => union.add(pv.programType)));
  const fromPlans = CORE_BENEFIT_ORDER.filter((t) => union.has(t)).map(
    (t) => CORE_BENEFIT_PRESETS[t],
  );
  return [...fromPlans, MENTORING_BENEFIT];
};

/** 혜택요약 카드 = 코어(플랜 union) + 추가혜택, 최대 6개 */
export const getBenefitCards = (
  plans: AllInOnePassPlan[],
  additionalBenefits: LandingBenefit[],
): BenefitCard[] => {
  const core = getCoreBenefits(plans);
  const additional = additionalBenefits.map((b) => ({
    name: b.name,
    description: b.description,
    iconSrc: getBenefitIconSrc(b.iconKey),
  }));
  return [...core, ...additional].slice(0, MAX_BENEFIT_CARDS);
};
