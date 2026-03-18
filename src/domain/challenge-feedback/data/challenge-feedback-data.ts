import type {
  ChallengeData,
  Mentor,
  SuccessStory,
  UserReview,
} from '../types';

// ─── 멘토 프로필 이미지 (4장 돌려쓰기) ───────────────────────────
const MENTOR_IMAGES = [
  '/images/challenge-feedback/mentors/mentor-1.png',
  '/images/challenge-feedback/mentors/mentor-2.png',
  '/images/challenge-feedback/mentors/mentor-3.png',
  '/images/challenge-feedback/mentors/mentor-4.png',
] as const;

/** 멘토 인덱스에 따라 프로필 이미지를 돌려쓰는 헬퍼 */
const mentorImage = (index: number) =>
  MENTOR_IMAGES[index % MENTOR_IMAGES.length];

// ─── 멘토 풀 ─────────────────────────────────────────────────────
const MENTORS: Record<string, Mentor> = {
  nick: {
    nickname: '닉 멘토',
    company: '삼성 계열사',
    role: '기획',
    profileImage: mentorImage(0),
  },
  letscareerTeam: {
    nickname: '렛츠커리어 취업연구팀',
    company: '렛츠커리어',
    role: '취업 연구',
    profileImage: mentorImage(1),
  },
  teamtam: {
    nickname: '팀탐 멘토',
    company: '시리즈C 스타트업',
    role: '기획/PM',
    profileImage: mentorImage(2),
  },
  jack: {
    nickname: '잭 멘토',
    company: 'BGF 리테일',
    role: '영업/마케팅',
    profileImage: mentorImage(3),
  },
  march: {
    nickname: '마치 멘토',
    company: '카카오 계열사',
    role: '기획',
    profileImage: mentorImage(0),
  },
  dukyang: {
    nickname: '덕양 멘토',
    company: '시리즈B 스타트업',
    role: 'PM',
    profileImage: mentorImage(1),
  },
  robo: {
    nickname: '로보 멘토',
    company: '토스증권',
    role: '개발',
    profileImage: mentorImage(2),
  },
  moa: {
    nickname: '모아 멘토',
    company: '대학내일',
    role: '마케팅',
    profileImage: mentorImage(3),
  },
  hailey: {
    nickname: '헤일리 멘토',
    company: '현대자동차',
    role: '인사',
    profileImage: mentorImage(0),
  },
  julia: {
    nickname: '줄리아 멘토',
    company: '현대자동차',
    role: '기획',
    profileImage: mentorImage(1),
  },
  jussaem: {
    nickname: '쥬쌤 멘토',
    company: 'SK하이닉스',
    role: '엔지니어',
    profileImage: mentorImage(2),
  },
  matthew: {
    nickname: '매튜 멘토',
    company: '현대모비스',
    role: '기획',
    profileImage: mentorImage(3),
  },
  ifssaem: {
    nickname: '이프쌤 멘토',
    company: 'SK이노베이션 계열사',
    role: '경영지원',
    profileImage: mentorImage(0),
  },
  doan: {
    nickname: '도안 멘토',
    company: '국내 은행',
    role: '금융',
    profileImage: mentorImage(1),
  },
  joan: {
    nickname: '조앤 멘토',
    company: '놀유니버스',
    role: '마케팅',
    profileImage: mentorImage(2),
  },
  roy: {
    nickname: '로이 멘토',
    company: '클래스101',
    role: '마케팅',
    profileImage: mentorImage(3),
  },
  irin: {
    nickname: '이린 멘토',
    company: '캐시노트',
    role: '마케팅',
    profileImage: mentorImage(0),
  },
  bin: {
    nickname: '빈 멘토',
    company: '토스',
    role: '마케팅',
    profileImage: mentorImage(1),
  },
  sunny: {
    nickname: '써니 멘토',
    company: '한국타이어',
    role: '인사',
    profileImage: mentorImage(2),
  },
  taehoon: {
    nickname: '허태훈 멘토',
    company: '공인노무사',
    role: '노무',
    profileImage: mentorImage(3),
  },
  alex: {
    nickname: '알렉스 멘토',
    company: '한화 계열사',
    role: '인사',
    profileImage: mentorImage(0),
  },
  gidae: {
    nickname: '기대 멘토',
    company: '100대 외국계 기업',
    role: 'HR',
    profileImage: mentorImage(1),
  },
};

// ─── 챌린지 데이터 ───────────────────────────────────────────────
export const CHALLENGE_LIST: ChallengeData[] = [
  {
    key: 'experience',
    menuLabel: '기필코 경험정리 챌린지',
    fullName: '기필코 경험정리 챌린지',
    detailUrl: '/challenge/experience-summary',
    mentorSectionField: '경험정리',
    mentors: [MENTORS.nick],
    mentorDisplayCount: 1,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '3회',
        feedbackDetails: [
          { round: '2회차', description: '대학 교내 활동(일상) 경험 정리' },
          { round: '3회차', description: '교외 활동 경험 정리' },
          { round: '4회차', description: '일상 및 커리어 경험 정리' },
        ],
        feedbackScope: '각 회차별 경험 3개씩',
        method: '서면 피드백',
        mentorInfo: '렛츠커리어 현직자 멘토단 · 닉 멘토 / 삼성 계열사',
      },
    ],
    beforeAfter: null,
    liveMentoring: null,
  },
  {
    key: 'resume',
    menuLabel: '이력서 1주 완성 챌린지',
    fullName: '이력서 1주 완성 챌린지',
    detailUrl: '/challenge/resume',
    mentorSectionField: '이력서',
    mentors: [MENTORS.letscareerTeam],
    mentorDisplayCount: 1,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '1회',
        feedbackDetails: [
          { round: '4회차', description: '이력서 완성' },
        ],
        feedbackScope: '이력서 1개',
        method: '서면 피드백',
        mentorInfo: '렛츠커리어 취업연구팀',
      },
    ],
    beforeAfter: null,
    liveMentoring: null,
  },
  {
    key: 'personal-statement',
    menuLabel: '자기소개서 2주 완성 챌린지',
    fullName: '자기소개서 2주 완성 챌린지',
    detailUrl: '/challenge/personal-statement',
    mentorSectionField: '자기소개서',
    mentors: [MENTORS.teamtam, MENTORS.jack],
    mentorDisplayCount: 2,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '1회',
        feedbackDetails: [
          { round: '5회차', description: '자기소개서 완성' },
        ],
        feedbackScope: '피드백 진행 시간 30분 내 문항 제한 없이 피드백',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 팀탐 멘토 / 시리즈C 스타트업 · 잭 멘토 / BGF 리테일',
      },
      {
        tier: 'PREMIUM',
        feedbackCount: '2회',
        feedbackDetails: [
          { round: '3회차', description: '자기소개서 기초' },
          { round: '5회차', description: '자기소개서 완성' },
        ],
        feedbackScope:
          '3회차: 한 문항에 대해 30분 피드백 / 5회차: 피드백 진행 시간 30분 내 문항 제한 없이 피드백',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 팀탐 멘토 / 시리즈C 스타트업 · 잭 멘토 / BGF 리테일',
      },
    ],
    beforeAfter: null,
    liveMentoring: {
      title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
      subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
      videoUrl: '',
      subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    },
  },
  {
    key: 'portfolio',
    menuLabel: '포트폴리오 2주 완성 챌린지',
    fullName: '포트폴리오 2주 완성 챌린지',
    detailUrl: '/challenge/portfolio',
    mentorSectionField: '포트폴리오',
    mentors: [MENTORS.march, MENTORS.dukyang, MENTORS.robo, MENTORS.moa],
    mentorDisplayCount: 4,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '1회',
        feedbackDetails: [
          { round: '6회차', description: '포트폴리오 점검' },
        ],
        feedbackScope: '피드백 진행 시간 30분 내 장수 제한 없이 피드백',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 마치 멘토 / 카카오 계열사 · 덕양 멘토 / 시리즈B 스타트업 · 로보 멘토 / 토스증권 · 모아 멘토 / 대학내일',
      },
      {
        tier: 'PREMIUM',
        feedbackCount: '2회',
        feedbackDetails: [
          { round: '4회차', description: '포트폴리오 발전' },
          { round: '6회차', description: '포트폴리오 점검' },
        ],
        feedbackScope:
          '4회차: 한 경험에 대해 만들어오는 포폴 1-3페이지에 대해 30분 피드백 / 6회차: 피드백 진행 시간 30분 내 장수 제한 없이 피드백',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 마치 멘토 / 카카오 계열사 · 덕양 멘토 / 시리즈B 스타트업 · 로보 멘토 / 토스증권 · 모아 멘토 / 대학내일',
      },
    ],
    beforeAfter: null,
    liveMentoring: {
      title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
      subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
      videoUrl: '',
      subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    },
  },
  {
    key: 'large-corp',
    menuLabel: '대기업 완성 챌린지',
    fullName: '대기업 완성 챌린지',
    detailUrl: '/challenge/large-corp',
    mentorSectionField: '대기업 서류',
    mentors: [
      MENTORS.hailey,
      MENTORS.julia,
      MENTORS.jussaem,
      MENTORS.matthew,
      MENTORS.ifssaem,
      MENTORS.doan,
      MENTORS.jack,
    ],
    mentorDisplayCount: 7,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '2회',
        feedbackDetails: [
          { round: '3회차', description: '경험 분석' },
          { round: '6회차', description: '자기소개서 완성' },
        ],
        feedbackScope: '3회차: 서면 피드백 / 6회차: 1:1 Live',
        method: '서면 + 1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 헤일리 멘토 / 현대자동차 · 줄리아 멘토 / 현대자동차 · 쥬쌤 멘토 / SK하이닉스 외',
      },
      {
        tier: 'PREMIUM',
        feedbackCount: '4회',
        feedbackDetails: [
          { round: '3회차', description: '경험 분석' },
          { round: '4회차', description: '직무 역량 답변' },
          { round: '5회차', description: '지원동기 답변' },
          { round: '6회차', description: '자기소개서 완성' },
        ],
        feedbackScope:
          '3/4/5회차: 서면 피드백 / 6회차: 1:1 Live',
        method: '서면 + 1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 헤일리 멘토 / 현대자동차 · 줄리아 멘토 / 현대자동차 · 쥬쌤 멘토 / SK하이닉스 외',
      },
    ],
    beforeAfter: null,
    liveMentoring: {
      title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
      subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
      videoUrl: '',
      subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    },
  },
  {
    key: 'marketing',
    menuLabel: '마케팅 서류 완성 챌린지',
    fullName: '마케팅 서류 완성 챌린지',
    detailUrl: '/challenge/marketing',
    mentorSectionField: '마케팅 서류',
    mentors: [
      MENTORS.joan,
      MENTORS.moa,
      MENTORS.roy,
      MENTORS.irin,
      MENTORS.bin,
    ],
    mentorDisplayCount: 5,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '1회',
        feedbackDetails: [
          { round: '8회차', description: '포트폴리오 완성' },
        ],
        feedbackScope: '원하는 서류 1종',
        method: '서면 피드백',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 조앤 멘토 / 놀유니버스 · 모아 멘토 / 대학내일 · 로이 멘토 / 클래스101 외',
      },
      {
        tier: 'PREMIUM',
        feedbackCount: '2회',
        feedbackDetails: [
          { round: '3회차', description: '경험 분석' },
          { round: '8회차', description: '포트폴리오 완성' },
        ],
        feedbackScope:
          '3회차: 경험 분석 / 8회차: 원하는 서류 1종',
        method: '서면 피드백',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 조앤 멘토 / 놀유니버스 · 모아 멘토 / 대학내일 · 로이 멘토 / 클래스101 외',
      },
    ],
    beforeAfter: {
      beforeImage: '/images/challenge-feedback/before-after/before.png',
      beforeDescription:
        '캡쳐된 이미지로 나열된 평범한 포트폴리오',
      afterImage: '/images/challenge-feedback/before-after/after.png',
      afterDescription:
        '문제와 해결 전략, 성과까지 핵심 역량이 돋보이는 포트폴리오',
    },
    liveMentoring: null,
  },
  {
    key: 'hr',
    menuLabel: 'HR 서류 완성 챌린지',
    fullName: 'HR 서류 완성 챌린지',
    detailUrl: '/challenge/hr',
    mentorSectionField: 'HR 서류',
    mentors: [MENTORS.sunny, MENTORS.dukyang, MENTORS.taehoon, MENTORS.alex],
    mentorDisplayCount: 4,
    feedbackOptions: [
      {
        tier: 'STANDARD',
        feedbackCount: '1회',
        feedbackDetails: [
          {
            round: '6회차 이후',
            description: '자기소개서 및 포트폴리오 완성',
          },
        ],
        feedbackScope: '',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 써니 멘토 / 한국타이어 · 덕양 멘토 / 시리즈B 스타트업 · 허태훈 멘토 / 공인노무사 · 알렉스 멘토 / 한화 계열사',
      },
      {
        tier: 'PREMIUM',
        feedbackCount: '2회',
        feedbackDetails: [
          {
            round: '6회차 이후',
            description: '자기소개서 및 포트폴리오 완성',
          },
        ],
        feedbackScope: '',
        method: '1:1 Live',
        mentorInfo:
          '렛츠커리어 현직자 멘토단 · 써니 멘토 / 한국타이어 · 덕양 멘토 / 시리즈B 스타트업 · 허태훈 멘토 / 공인노무사 · 알렉스 멘토 / 한화 계열사 · 기대 멘토 / 100대 외국계 기업',
      },
    ],
    beforeAfter: null,
    liveMentoring: {
      title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
      subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
      videoUrl: '',
      subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
    },
  },
];

// ─── 공통 데이터 (모든 챌린지 공유) ─────────────────────────────
export const USER_REVIEWS: UserReview[] = [
  {
    image: '/images/challenge-feedback/reviews/review-1.png',
    alt: '수강생 피드백 후기 1',
  },
  {
    image: '/images/challenge-feedback/reviews/review-2.png',
    alt: '수강생 피드백 후기 2',
  },
  {
    image: '/images/challenge-feedback/reviews/review-3.png',
    alt: '수강생 피드백 후기 3',
  },
  {
    image: '/images/challenge-feedback/reviews/review-4.png',
    alt: '수강생 피드백 후기 4',
  },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    company: '삼성전자',
    role: '마케팅',
    name: '김○○',
    year: '2025',
  },
  {
    company: 'LG전자',
    role: '기획',
    name: '이○○',
    year: '2025',
  },
  {
    company: '현대자동차',
    role: '인사',
    name: '박○○',
    year: '2025',
  },
  {
    company: 'SK하이닉스',
    role: '엔지니어',
    name: '최○○',
    year: '2024',
  },
  {
    company: '카카오',
    role: 'PM',
    name: '정○○',
    year: '2024',
  },
  {
    company: '네이버',
    role: '개발',
    name: '한○○',
    year: '2024',
  },
  {
    company: 'CJ ENM',
    role: '콘텐츠기획',
    name: '윤○○',
    year: '2025',
  },
  {
    company: '토스',
    role: '디자인',
    name: '장○○',
    year: '2025',
  },
];

export const COMMON_NOTICE =
  '모든 피드백은 멘토님의 현업 일정에 따라, 리스트에 없는 멘토님과 매칭 될 수 있음을 안내드립니다!';

// ─── 헬퍼 ────────────────────────────────────────────────────────
export function findChallengeByKey(key: string | undefined): ChallengeData {
  return (
    CHALLENGE_LIST.find((c) => c.key === key) ?? CHALLENGE_LIST[0]
  );
}
