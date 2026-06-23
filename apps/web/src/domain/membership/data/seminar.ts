// 현직자 무료 세미나 — 무료 라이브 세션 2회 안내·신청의 단일 데이터 출처.
// SeminarSection / SeminarSessionCard 가 이 한 파일을 공유한다.
//
// 카드 구조(Image #8 기준): 컬러 hero 배너(이미지) + 본문(세션 배지·일시·제목·설명·
// 커리큘럼·경고·멘토·신청 CTA). hero 배너에는 로고/타이틀이 이미 합쳐져 있어 이미지로 둔다.

/** hero 배너 테마 — 세션 배지 등 본문 악센트 색을 좌우한다. */
export type SeminarTheme = 'blue' | 'green';

/** 커리큘럼 한 줄 (번호·주제·소요시간). */
export interface SeminarAgendaItem {
  /** 표시 번호 (01 …) */
  no: string;
  /** 커리큘럼 주제 */
  title: string;
  /** 소요 시간 (예: 10분) */
  duration: string;
}

/** 멘토 프로필 — 이름 + 한 줄 소속(role) + 한 줄 이력(profile). */
export interface SeminarMentor {
  /** 멘토 이름 (예: 닉) */
  name: string;
  /** 소속 한 줄 (예: 삼성 계열사 영업지원팀) */
  role: string;
  /** 신뢰 강조 이력 한 줄 */
  profile: string;
}

/** 세미나 세션(무료 라이브 클래스 1회). */
export interface SeminarSession {
  /** 표시 번호 (SESSION 01 …) */
  sessionNo: string;
  /** hero 배너 테마 */
  theme: SeminarTheme;
  /** hero 배너 이미지 경로 (로고·타이틀 합본) */
  heroImage: string;
  /** hero 이미지 대체 텍스트 */
  heroAlt: string;
  /** 날짜 라벨 (예: 6월 28일 (일)) — 악센트 컬러로 강조 */
  date: string;
  /** 시간 라벨 (예: 오전 10:30–11:30) */
  time: string;
  /** 본문 제목 */
  title: string;
  /** 한 문단 설명 */
  description: string;
  /** 커리큘럼 4종 */
  agenda: SeminarAgendaItem[];
  /** 안내 경고 한 줄 (예: VOD 미제공 · LIVE 참여 필수). 없으면 생략. */
  notice?: string;
  /** 멘토 프로필 */
  mentor: SeminarMentor;
  /** CTA 라벨 (예: 6/28 세미나 신청하기) */
  ctaLabel: string;
  /** 신청 링크 (program/live) */
  ctaHref: string;
}

export const SEMINAR_HEADER = {
  badge: '현직자 무료 세미나',
  title: '13주 플랜, 현직자에게 직접 듣고 시작하세요',
  sub: '6/28·7/4 두 번의 무료 라이브 세미나에서 하반기 공채 13주 계획을 함께 세워요.',
} as const;

export const SEMINAR_SESSIONS: SeminarSession[] = [
  {
    sessionNo: '01',
    theme: 'blue',
    heroImage: '/images/membership/seminar-hero-01.png',
    heroAlt: '대기업 하반기 공채 준비는 지금부터 — 삼성·CJ 계열사 현직자 멘토 무료 세미나',
    date: '6월 28일 (일)',
    time: '오전 10:30–11:30',
    title: '대기업 하반기 공채 준비는 지금부터',
    description:
      '6/29–9/27 [하반기 공채용 13주] 계획을 현직자와 함께 세우고, 실제 대기업 합격 사례로 놓치기 쉬운 준비 포인트까지 짚어드려요.',
    agenda: [
      { no: '01', title: '하반기 공채의 현실', duration: '10분' },
      { no: '02', title: '13주 합격 로드맵', duration: '20분' },
      { no: '03', title: '단계별 준비법 + 합격 사례', duration: '20분' },
      { no: '04', title: '실시간 Q&A', duration: '10분' },
    ],
    mentor: {
      name: '닉',
      role: '삼성 계열사 영업지원팀',
      profile:
        'CJ제일제당 신사업개발·삼성 계열사 동시 최종합격 · (전) 트릿지 데이터 분석 인턴',
    },
    ctaLabel: '6/28 세미나 신청하기',
    ctaHref:
      'https://www.letscareer.co.kr/program/live/100/%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-%EB%8C%80%EA%B8%B0%EC%97%85-%ED%95%98%EB%B0%98%EA%B8%B0-%EA%B3%B5%EC%B1%84-%EC%A4%80%EB%B9%84%EB%8A%94--%EC%A7%80%EA%B8%88%EB%B6%80%ED%84%B0',
  },
  {
    sessionNo: '02',
    theme: 'green',
    heroImage: '/images/membership/seminar-hero-02.png',
    heroAlt: '2026 대기업 공채 준비 A to Z — SK 현직자 멘토 무료 세미나',
    date: '7월 4일 (토)',
    time: '오후 7:30–8:30',
    title: '2026 하반기 대기업 공채 준비 A to Z',
    description:
      '극악무도한 문과 취업난 속 1트로 대기업 4곳에 최종 합격한 SK 현직자가, 7~9월 일정 관리부터 전형별 실전 꿀팁까지 알려드려요.',
    agenda: [
      { no: '01', title: '대기업 공채 전형 감 잡기', duration: '10분' },
      { no: '02', title: '월별 공채 준비 로드맵', duration: '20분' },
      { no: '03', title: '각 전형별 실전 꿀팁 전수', duration: '20분' },
      { no: '04', title: '실시간 Q&A', duration: '10분' },
    ],
    notice: 'VOD 미제공 · LIVE 참여 필수',
    mentor: {
      name: '이프',
      role: 'SK 계열사 현직자',
      profile: '삼성·현대차·CJ 등 대기업 계열사 4곳 최종 합격',
    },
    ctaLabel: '7/4 세미나 신청하기',
    ctaHref:
      'https://www.letscareer.co.kr/program/live/99/%5B%F0%9F%8E%81%EB%AC%B4%EB%A3%8C%5D-2026%EB%85%84-%ED%95%98%EB%B0%98%EA%B8%B0-%EB%8C%80%EA%B8%B0%EC%97%85-%EA%B3%B5%EC%B1%84-%EC%A4%80%EB%B9%84-a-to-z',
  },
];
