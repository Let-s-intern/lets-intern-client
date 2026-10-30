// landingDescription(JSON) 파싱 + 혜택요약 카드 렌더(어드민 serialize 스키마와 1:1).
import type { SerializedLexicalNode } from 'lexical';

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

export interface LandingVod {
  title: string;
  thumbnail: string;
  description: string;
}

export interface LandingDescription {
  /** 노출용 모집 종료일(ISO). 카운트다운·CTA 마감 기준. null이면 실제 deadline 사용. */
  displayDeadline: string | null;
  hero: { title: string; description: string; recruitFootnote: string };
  lexical: {
    introSection: string;
    playbookSection: string;
    benefitSection: string;
    reviewSection: string;
  };
  /** 혜택요약 카드(최대 6, VOD 제외). 어드민이 통째로 저장 — 웹은 그대로 렌더. */
  benefitsSummary: LandingBenefit[];
  /** 가격섹션 '패스 전용 특별 혜택' 칩 (외부링크명) */
  specialBenefitTitles: string[];
  vods: LandingVod[];
  vodCount: number;
  reviews: LandingReview[];
  finalCta: { title: string; description: string };
}

export const emptyLandingDescription = (): LandingDescription => ({
  displayDeadline: null,
  hero: { title: '', description: '', recruitFootnote: '' },
  lexical: {
    introSection: '',
    playbookSection: '',
    benefitSection: '',
    reviewSection: '',
  },
  benefitsSummary: [],
  specialBenefitTitles: [],
  vods: [],
  vodCount: 0,
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
    benefitsSummary: (parsed.benefitsSummary ?? []).map((b) => ({
      name: b.name ?? '',
      description: b.description ?? '',
      iconKey: b.iconKey ?? DEFAULT_BENEFIT_ICON_KEY,
    })),
    specialBenefitTitles: parsed.specialBenefitTitles ?? [],
    vods: (parsed.vods ?? []).map((v) => ({
      title: v.title ?? '',
      thumbnail: v.thumbnail ?? '',
      description: v.description ?? '',
    })),
    vodCount: parsed.vodCount ?? 0,
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

/** 혜택요약·VOD탭 개수 표기에 쓰는 동적 개수 (챌린지=타입 수 고정, 가이드북=목록 fetch, VOD=어드민 집계) */
export interface BenefitCounts {
  challenge: number;
  guidebook: number;
  vod: number;
}

/** 저장된 benefitsSummary → 노출 카드. 어드민이 통째 저장한 값을 그대로 렌더. */
export const toBenefitCards = (summary: LandingBenefit[]): BenefitCard[] =>
  summary.slice(0, MAX_BENEFIT_CARDS).map((b) => ({
    name: b.name,
    description: b.description,
    iconSrc: getBenefitIconSrc(b.iconKey),
  }));

/** VOD 옵션 판매 중일 때 혜택요약에 끼워넣는 VOD 카드 (옵션 설명 + 개수, LC-3533). */
export const buildVodOptionCard = (counts: BenefitCounts): BenefitCard => ({
  name: `VOD ${counts.vod}종`,
  description: 'VOD 옵션을 추가하면 시청할 수 있어요',
  iconSrc: BENEFIT_ICON_SRC.vod,
});
