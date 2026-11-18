/**
 * 챌린지 카드는 기수·버전 구분 없이 한 장이라, 기수·버전 글자가 박힌 등록 썸네일 대신
 * 유형별 기본 썸네일을 쓴다. 이미지는 어드민 썸네일 자동 생성의 배경과 같다.
 * 제목이 그려져 있지 않은 배경(자기소개서·포트폴리오)은 제목을 얹는다.
 * 유형은 제목으로 가린다. 기본 이미지가 없는 유형(직무·면접 등)은 등록 썸네일을 그대로 쓴다
 */
const BASE = '/images/challenge-default-thumbnail';

interface DefaultThumbnail {
  src: string;
  /** 얹을 제목. 없으면 이미지에 제목이 있다 */
  overlayTitle?: string;
  shadowColor?: string;
}

const RULES: {
  match: RegExp;
  src: string;
  overlay?: { shadowColor: string };
}[] = [
  { match: /대기업/, src: `${BASE}/personal-statement-large-corp.png` },
  { match: /경험정리/, src: `${BASE}/experience-summary.png` },
  { match: /이력서/, src: `${BASE}/career-start-ver.png` },
  {
    match: /자기소개서|자소서/,
    src: `${BASE}/personal-statement.png`,
    overlay: { shadowColor: '#20A4D9' },
  },
  {
    match: /포트폴리오/,
    src: `${BASE}/portfolio.png`,
    overlay: { shadowColor: '#E79C00' },
  },
];

/** 원래 제목과 화면 제목(버전·기수를 뗀 것)으로 기본 썸네일을 고른다. 없으면 null */
export const resolveChallengeThumbnail = (
  title: string,
  displayTitle: string,
): DefaultThumbnail | null => {
  // 직무 챌린지는 제목에 "서류"·"포트폴리오" 같은 말이 들어가도 직무 썸네일을 쓴다
  if (/마케팅|HR|PM|서비스기획/.test(title)) return null;
  const rule = RULES.find((r) => r.match.test(title));
  if (!rule) return null;
  return rule.overlay
    ? {
        src: rule.src,
        overlayTitle: displayTitle,
        shadowColor: rule.overlay.shadowColor,
      }
    : { src: rule.src };
};
