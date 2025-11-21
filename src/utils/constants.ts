export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
export const BONUS_MISSION_TH = 100;
export const END_OF_SECONDS = 59;
export const NO_OPTION_ID = 0;
export const TALENT_POOL_MISSION_TH = 99;
export const DESIRED_INDUSTRY = {
  industryList: [
    'IT·플랫폼',
    '금융·핀테크',
    '커머스·리테일',
    '모빌리티',
    '교육',
    '패션·뷰티',
    '엔터·미디어',
    '게임·콘텐츠',
    '헬스케어·바이오',
    '제조·하드웨어',
    '환경·에너지',
    '공공·비영리',
    '산업 무관',
  ],
};

export const JOB_FIELD_ROLES = [
  {
    jobField: '경영/인사',
    jobRoles: [
      '경영/인사 직무 전체',
      '경영지원',
      '회계/경리',
      '조직관리',
      '정보보호 담당자',
      '인사/평가',
      '교육',
      '채용담당자',
      '서비스운영',
      'CS 매니저',
    ],
  },
  {
    jobField: '마케팅',
    jobRoles: [
      '마케팅 직무 전체',
      '마케터',
      '퍼포먼스 마케터',
      '콘텐츠 마케터',
      '디지털 마케터',
      '마케팅 전략 기획',
      '브랜드 마케터',
      '광고 기획(AE)',
      'CRM 전문가',
      '카피라이터/UX Writer',
      '마켓 리서처',
    ],
  },
  {
    jobField: '영업',
    jobRoles: [
      '영업 직무 전체',
      '기업 영업',
      '기술 영업',
      '해외영업',
      '솔루션 컨설턴트',
      '세일즈',
      '제약 영업',
    ],
  },
  {
    jobField: '기획',
    jobRoles: [
      '기획 직무 전체',
      '서비스 기획',
      'PM/PO',
      '비즈니스 분석가',
      '사업개발/기획',
      '전략 기획',
      '해외 사업개발/기획',
      '상품 기획/MD',
    ],
  },
  {
    jobField: '디자인',
    jobRoles: [
      '디자인 직무 전체',
      '프로덕트 디자인',
      '웹/앱 디자인',
      '그래픽 디자인',
      'UX 디자인',
      'BI/BX 디자인',
      '광고 디자인',
      '영상/모션 디자인',
      '운영 디자인',
      '3D 디자인',
    ],
  },
  {
    jobField: '개발',
    jobRoles: [
      '개발 직무 전체',
      '백엔드/서버 개발',
      '프론트엔드 개발',
      'SW 엔지니어',
      '안드로이드 개발',
      'iOS 개발',
      '데이터 엔지니어',
      '데이터 사이언티스트',
      '데이터 분석가',
      'QA/테스트 엔지니어',
      '보안 엔지니어',
      '임베디드',
      '게임 개발자',
    ],
  },
  {
    jobField: '엔지니어링',
    jobRoles: [
      '엔지니어링 직무 전체',
      '기계',
      '전자',
      '전기',
      '로봇',
      '설비',
      '공정',
    ],
  },
  { jobField: '직군 무관', jobRoles: [] },
];

export const JOB_CONDITIONS = [
  { value: 'PUBLIC', label: '대기업 공채에 지원하고 싶어요.' },
  { value: 'STARTUP', label: '스타트업/중소기업 정규직으로 가고 싶어요.' },
  { value: 'INTERN', label: '채용형 인턴에 도전하고 싶어요.' },
  { value: 'EXPERIENCE', label: '체험형 인턴으로 경험을 먼저 쌓고 싶어요.' },
  { value: 'FREELANCE', label: '계약직/프로젝트성 일자리도 괜찮아요.' },
];

export const GRADE_ENUM_TO_KOREAN = {
  FIRST: '1학년',
  SECOND: '2학년',
  THIRD: '3학년',
  FOURTH: '4학년',
  ETC: '5학년',
  GRADUATE: '졸업생',
} as const;
