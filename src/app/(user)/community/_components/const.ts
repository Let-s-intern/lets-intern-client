// ── External URLs ──

export const KAKAO_JUDY_QNA_LINK =
  'https://open.kakao.com/o/gKZolyag'; // 쥬디의 취업 QNA방 (placeholder)

export const KAKAO_LEO_HARDSKILL_LINK =
  'https://open.kakao.com/o/gHardSkill'; // 레오 멘토의 하드스킬 QNA방 (placeholder)

export const OGONGGO_SITE_LINK = 'https://letscareer.oopy.io';

export const OGONGGO_PLANNING_LINK =
  'https://open.kakao.com/o/gPlanning'; // 기획 (placeholder)

export const OGONGGO_HR_LINK =
  'https://open.kakao.com/o/gHR'; // HR (placeholder)

export const OGONGGO_SALES_LINK =
  'https://open.kakao.com/o/gSales'; // 세일즈 (placeholder)

export const OGONGGO_MARKETING_LINK =
  'https://open.kakao.com/o/gMarketing'; // 마케팅 (placeholder)

export const INSTAGRAM_OFFICIAL_LINK =
  'https://www.instagram.com/letscareer_official';

export const INSTAGRAM_JOB_LINK =
  'https://www.instagram.com/letscareer.job';

export const INSTAGRAM_QNA_LINK =
  'https://www.instagram.com/letscareer_qna';

// ── Kakao Talk Room Data ──

export type KakaoRoom = {
  id: string;
  name: string;
  hostLabel: string;
  subtitle: string;
  tags: string[];
  description: string;
  link: string;
  notice: string;
};

export const kakaoRooms: KakaoRoom[] = [
  {
    id: 'judy-qna',
    name: '쥬디의 취업 QNA방',
    hostLabel: '쥬디',
    subtitle: '매니저 쥬디 운영 · 겨울 취뽀 응원방',
    tags: ['취업 정보 공유', '무제한 Q&A', '동기부여'],
    description:
      '좋은 정보와 공고를 매일 공유하고, 취업 준비 관련 질문에 뭐든 답변드려요. 미루지 않도록 끝없는 동기부여도 함께요.',
    link: KAKAO_JUDY_QNA_LINK,
    notice: '입장 시 닉네임을 "이름_희망직무"로 변경해주세요',
  },
  {
    id: 'leo-hardskill',
    name: '레오 멘토의 하드스킬 QNA방',
    hostLabel: '레오',
    subtitle: '레오 멘토 운영 · 실무 기술 QNA',
    tags: ['SQL · GA4', '생성형 AI', '데이터 분석'],
    description:
      'SQL, GA4 같은 데이터 분석 툴부터 GPT·Claude 등 생성형 AI 활용, 데이터 분석 역량을 키우는 법까지 하드스킬 QNA를 진행해요.',
    link: KAKAO_LEO_HARDSKILL_LINK,
    notice: '하드스킬 관련 질문이라면 무엇이든 남겨주세요',
  },
];

// ── Ogonggo Job Category Data ──

export type OgonggoJob = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export const ogonggoJobs: OgonggoJob[] = [
  {
    id: 'planning',
    name: '기획',
    description: 'PM · 서비스기획\n채용공고 큐레이션',
    link: OGONGGO_PLANNING_LINK,
  },
  {
    id: 'hr',
    name: 'HR',
    description: '인사 · 경영관리\n채용공고 큐레이션',
    link: OGONGGO_HR_LINK,
  },
  {
    id: 'sales',
    name: '세일즈',
    description: '영업 · B2B 세일즈\n채용공고 큐레이션',
    link: OGONGGO_SALES_LINK,
  },
  {
    id: 'marketing',
    name: '마케팅',
    description: '퍼포먼스 · 콘텐츠\n채용공고 큐레이션',
    link: OGONGGO_MARKETING_LINK,
  },
];

// ── Instagram Channel Data ──

export type InstagramChannel = {
  id: string;
  handle: string;
  label: string;
  description: string;
  link: string;
};

export const instagramChannels: InstagramChannel[] = [
  {
    id: 'official',
    handle: '@letscareer_official',
    label: '렛츠커리어 공식',
    description:
      '빠르고 트렌디한 취준 정보를 매일 오전 10시에 받아볼 수 있어요. 렛츠커리어의 모든 소식이 여기 담겨있어요.',
    link: INSTAGRAM_OFFICIAL_LINK,
  },
  {
    id: 'job',
    handle: '@letscareer.job',
    label: '렛츠커리어 오공고',
    description:
      '문과 취준생을 위해 큐레이션된 채용공고와 직무 인사이트를 인스타그램으로 가장 빠르게 만나보세요.',
    link: INSTAGRAM_JOB_LINK,
  },
  {
    id: 'qna',
    handle: '@letscareer_qna',
    label: '렛츠커리어 QNA',
    description:
      '현직자 멘토와 커리어 매니저에게 무제한 질의응답. 취업 고민을 편하게 올려두세요.',
    link: INSTAGRAM_QNA_LINK,
  },
];

// ── Hero Chips ──

export const heroChips = [
  '현직자 멘토에게 직접 물어볼 수 있어요',
  '검증된 공고와 직무 인사이트를 가장 빠르게',
  '지치고 힘들어도 함께 이겨낼 수 있어요',
] as const;
