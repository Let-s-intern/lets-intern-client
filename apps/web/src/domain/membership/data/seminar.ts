// 현직자 무료 세미나 — 무료 라이브 세션 2회 안내·신청의 단일 데이터 출처.
// SeminarSection / SeminarSessionCard 가 이 한 파일을 공유한다.
//
// 핵심: "추후 공개"를 1급 상태로 다룬다(빈 값 아님).
//   - status: 'confirmed' → 날짜·시간·주제·멘토·신청링크가 채워진 확정 세션.
//   - status: 'tba'       → 시간·주제·멘토 미정(placeholder UX), 사전 알림만 받는 세션.
// 신청/사전알림 링크 URL·멘토 사진은 PRD §9-3 확정 전이라 nullable 로 두고,
// 미정 시 비활성 CTA(href 없음)로 처리한다(구조는 완성).

/** 세션 상태 — 확정(confirmed) vs 추후 공개(tba). 시각적 위계의 기준. */
export type SeminarStatus = 'confirmed' | 'tba';

/** 멘토 프로필 — 사진(image)은 미확정 시 생략 가능(이니셜 폴백). */
export interface SeminarMentor {
  /** 멘토 이름 (예: 닉) */
  name: string;
  /** 한 줄 이력 (신뢰감 강조) */
  profile: string;
  /** 프로필 사진 경로. 미확정이면 생략 → 이니셜 폴백. */
  image?: string;
}

/**
 * 세미나 세션.
 * confirmed: date/time/topic/mentor 가 존재(가드 테스트로 검증).
 * tba:       time/topic/mentor 는 생략 가능. date 는 가안(7/4 등)이라 존재할 수 있음.
 */
export interface SeminarSession {
  status: SeminarStatus;
  /** 표시 번호 (LIVE 01 …) */
  sessionNo: string;
  /** 날짜 라벨 (예: 6/28(토)). tba 도 가안 날짜를 가질 수 있다. */
  date?: string;
  /** 시간 라벨 (예: 오전 10:30). tba 는 미정. */
  time?: string;
  /** 세션 주제. tba 는 미정. */
  topic?: string;
  /** 멘토 프로필. tba 는 미정. */
  mentor?: SeminarMentor;
  /** CTA 라벨 (예: 세미나 신청하기 / 사전 알림 신청). */
  ctaLabel: string;
  /** 신청·사전알림 링크. 미확정이면 생략 → CTA 비활성. */
  ctaHref?: string;
}

/** 미정 필드 placeholder 카피 — 추후 공개 표시에 일관 사용. */
export const TBA_PLACEHOLDER = {
  time: '시간 추후 공개',
  topic: '주제 추후 공개',
  mentor: '멘토 추후 공개',
} as const;

export const SEMINAR_HEADER = {
  badge: '현직자 무료 세미나',
  title: '13주 플랜, 현직자에게 직접 듣고 시작하세요',
  sub: '6/28·7/4 두 번의 무료 라이브 세미나에서 하반기 공채 13주 계획을 함께 세워요.',
} as const;

export const SEMINAR_SESSIONS: SeminarSession[] = [
  {
    status: 'confirmed',
    sessionNo: '01',
    date: '6/28(토)',
    time: '오전 10:30',
    topic: '[하반기 공채용 13주] 계획 함께 수립하기 (6/29–9/27)',
    mentor: {
      name: '닉',
      profile:
        '삼성바이오 계열사 Market Intelligence 현직 · CJ제일제당 신사업개발 동시 합격',
    },
    ctaLabel: '세미나 신청하기',
    // ctaHref: PRD §9-3 확정 후 주입 (미정 → 비활성).
  },
  {
    status: 'tba',
    sessionNo: '02',
    date: '7/4(금)',
    // time/topic/mentor: 추후 공개 (placeholder UX).
    ctaLabel: '사전 알림 신청',
    // ctaHref: PRD §9-3 확정 후 주입 (미정 → 비활성).
  },
];
