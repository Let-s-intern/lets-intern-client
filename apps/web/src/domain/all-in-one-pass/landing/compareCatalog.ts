// 가격 비교 모달의 개별 프로그램 '현재 할인가' — 하드코딩.
//
// BE 가 programList.finalPrice 를 내려주면 이 파일을 지우고 그 값으로 교체.
// 챌린지는 CHALLENGE_ITEMS(title·thumbnail) + 여기 가격(타입별)으로 조립.
// 가이드북은 7종이 CHALLENGE 처럼 membership 에만 있는 게 아니라 8종이라(쥬디 노하우 추가),
// compare 전용 목록을 여기 둠. 썸네일은 어드민 API(guidebookThumbs[id]) → 정적 src 폴백.

import type { ChallengeType } from '@/schema';

/** 챌린지 타입별 할인가 (베이직 플랜 기준) */
export const CHALLENGE_PRICES: Partial<Record<ChallengeType, number>> = {
  EXPERIENCE_SUMMARY: 10000, // 기필코 경험정리
  CAREER_START: 10000, // 이력서 1주 완성
  PERSONAL_STATEMENT: 53500, // 자기소개서 2주 완성
  PERSONAL_STATEMENT_LARGE_CORP: 128500, // 대기업 공채 자소서
  PORTFOLIO: 58500, // 포트폴리오 2주 완성
  MEETING_PREPARATION: 45000, // 면접 준비 끝장
  ETC: 59000, // 인적성 검사 수리/추리 뽀개기
  MARKETING: 99000, // 마케팅 서류 완성 올인원
  HR: 89000, // HR/인사 직무
  PM: 79000, // PM/서비스기획
};

/** 가이드북 비교 항목 (id·제목·할인가 + 정적 썸네일 폴백) */
export interface GuidebookCompareItem {
  id: number;
  title: string;
  price: number;
  /** public/images/membership/ 하위 폴백 파일명. 없으면 어드민 API 썸네일만 사용 */
  src?: string;
}

/** 가이드북 8종 (기존 7 + [쥬디 노하우] 포트폴리오 자료, id 16) */
export const GUIDEBOOK_COMPARE_ITEMS: GuidebookCompareItem[] = [
  {
    id: 7,
    title: '기필코 경험정리 가이드북',
    price: 14900,
    src: 'guide-experience.png',
  },
  {
    id: 6,
    title: '이력서 완성 가이드북',
    price: 14900,
    src: 'guide-resume.png',
  },
  {
    id: 5,
    title: '자기소개서 완성 가이드북',
    price: 39000,
    src: 'guide-coverletter.png',
  },
  {
    id: 15,
    title: '대기업 자소서 완성 가이드북',
    price: 39000,
    src: 'guide-major-coverletter.jpg',
  },
  {
    id: 2,
    title: '포트폴리오 완성 가이드북',
    price: 39000,
    src: 'guide-portfolio.png',
  },
  {
    id: 14,
    title: '인적성 수리/추리 뽀개기 가이드북',
    price: 59000,
    src: 'guide-aptitude.jpg',
  },
  {
    id: 9,
    title: '면접 준비 끝장 가이드북',
    price: 39000,
    src: 'guide-interview.png',
  },
  { id: 16, title: '[쥬디 노하우] 포트폴리오 자료 다 모았어요!', price: 59000 },
];
