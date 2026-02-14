import {
    ChallengeComparisonRow,
    CurationQuestion,
    FAQItem,
    FrequentComparisonItem,
    Persona,
    PersonaId,
    ProgramContent,
    ProgramId,
} from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'starter',
    title: '취준 입문 · 경험 정리가 먼저',
    description: '경험 소재부터 차곡차곡 정리하고 싶은 분',
  },
  {
    id: 'resume',
    title: '이력서부터 빠르게 완성',
    description: '공고가 떴을 때 1주 안에 제출이 필요한 분',
  },
  {
    id: 'coverLetter',
    title: '자기소개서/지원동기 강화',
    description: '직무 분석과 스토리텔링이 필요한 분',
  },
  {
    id: 'portfolio',
    title: '포트폴리오/직무 자료 준비',
    description: '직무 맞춤 포트폴리오와 사례 정리가 필요한 분',
  },
  {
    id: 'specialized',
    title: '특화 트랙(대기업 · 마케팅 · HR)',
    description: '현직자 특강과 심화 피드백을 원하는 분',
  },
  {
    id: 'dontKnow',
    title: '잘 모르겠어요',
    description: '내 상황에 맞는 프로그램을 추천받고 싶어요',
  },
];

export const PERSONA_IDS = PERSONAS.map((persona) => persona.id) as PersonaId[];

export const QUESTION_MAP: Record<PersonaId, CurationQuestion[]> = {
  starter: [
    {
      id: 'step1',
      title: '지금 가장 시급한 과제는 무엇인가요?',
      helper: '지원서 작성 속도 vs. 경험 소재 확보 중 어디에 집중할지 골라주세요.',
      options: [
        {
          value: 'needs-experience',
          title: '경험 소재부터 만들기',
          description: 'STAR/마인드맵으로 경험을 정리해 두고 싶어요.',
        },
        {
          value: 'needs-resume',
          title: '1주 안에 이력서 제출',
          description: '공고가 코앞이라 빠른 이력서 완성이 필요해요.',
        },
        {
          value: 'needs-bundle',
          title: '서류 전체를 한 번에 정비',
          description: '자소서·포트폴리오까지 일괄 정비하고 싶어요.',
        },
      ],
    },
    {
      id: 'step2',
      title: '이번 1~2주 투자 가능 시간과 피드백 니즈는?',
      options: [
        {
          value: 'time-tight',
          title: '주 3~5시간, 빠른 가이드 선호',
        },
        {
          value: 'need-feedback',
          title: '멘토 피드백 1~2회 꼭 받고 싶어요',
        },
        {
          value: 'need-portfolio',
          title: '직무 자료/포트폴리오까지 챙기고 싶어요',
        },
      ],
    },
  ],
  resume: [
    {
      id: 'step1',
      title: '이력서 작성 배경을 골라주세요.',
      options: [
        {
          value: 'first-resume',
          title: '첫 이력서라 소재가 부족해요',
        },
        {
          value: 'refresh',
          title: '기존 이력서를 업데이트하려고 해요',
        },
        {
          value: 'career-shift',
          title: '직무/산업 전환을 준비 중이에요',
        },
      ],
    },
    {
      id: 'step2',
      title: '지원 일정은 얼마나 촉박한가요?',
      options: [
        {
          value: 'deadline-soon',
          title: '이번 주 안에 제출해야 해요',
        },
        {
          value: 'deadline-few-weeks',
          title: '2~3주 안에 제출하면 돼요',
        },
        {
          value: 'deadline-flex',
          title: '한 달 이상 여유 있어요',
        },
      ],
    },
  ],
  coverLetter: [
    {
      id: 'step1',
      title: '어떤 자기소개서를 준비 중인가요?',
      options: [
        {
          value: 'general-cover',
          title: '직무 기본 자소서',
          description: '직무 역량/지원동기부터 튼튼히',
        },
        {
          value: 'enterprise-cover',
          title: '대기업/공채용 자소서',
          description: '산업·기업 분석과 공채 문항 대응',
        },
        {
          value: 'portfolio-linked',
          title: '포트폴리오 연계 자소서',
          description: '직무 사례와 포폴을 함께 보여주기',
        },
      ],
    },
    {
      id: 'step2',
      title: '피드백 강도를 선택해주세요.',
      options: [
        {
          value: 'light-feedback',
          title: '가이드만 있어도 충분',
        },
        {
          value: 'needs-iteration',
          title: '1~2회 피드백으로 완성',
        },
        {
          value: 'needs-intensive',
          title: '문항별 심화/라이브 피드백 희망',
        },
      ],
    },
  ],
  portfolio: [
    {
      id: 'step1',
      title: '포트폴리오가 필요한 목적은 무엇인가요?',
      options: [
        {
          value: 'portfolio-core',
          title: '직무 포트폴리오만 빠르게 완성',
        },
        {
          value: 'marketing-track',
          title: '마케팅 직무용 포폴과 서류',
        },
        {
          value: 'hr-track',
          title: 'HR 직무용 포폴과 서류',
        },
      ],
    },
    {
      id: 'step2',
      title: '현재 준비 상태는 어떤가요?',
      options: [
        {
          value: 'has-drafts',
          title: '초안은 있고 구조화만 필요',
        },
        {
          value: 'need-templates',
          title: '템플릿과 예시가 필요',
        },
        {
          value: 'need-feedback',
          title: '포트폴리오 피드백을 받고 싶어요',
        },
      ],
    },
  ],
  specialized: [
    {
      id: 'step1',
      title: '특화 트랙을 선택해주세요.',
      options: [
        {
          value: 'enterprise',
          title: '대기업 공채 대비',
        },
        {
          value: 'marketing',
          title: '마케팅 올인원 트랙',
        },
        {
          value: 'hr',
          title: 'HR 올인원 트랙',
        },
      ],
    },
    {
      id: 'step2',
      title: '현재 준비 상태는 어떤가요?',
      options: [
        {
          value: 'need-experience',
          title: '경험 소재부터 다시 정리',
        },
        {
          value: 'need-feedback',
          title: '피드백을 많이 받고 싶어요',
        },
        {
          value: 'ready-to-run',
          title: '바로 작성/제출 준비',
        },
      ],
    },
  ],
  dontKnow: [
    {
      id: 'step1',
      title: '현재 취업 준비 단계를 알려주세요.',
      helper: '어디까지 진행했는지 솔직하게 선택해 주세요.',
      options: [
        {
          value: 'just-started',
          title: '막 시작했어요',
          description: '무엇부터 해야 할지 감이 안 와요.',
        },
        {
          value: 'working-on-docs',
          title: '서류를 작성하고 있어요',
          description: '이력서나 자소서를 쓰고 있는 중이에요.',
        },
        {
          value: 'almost-ready',
          title: '거의 완성했어요',
          description: '마지막 점검이나 보완이 필요해요.',
        },
      ],
    },
    {
      id: 'step2',
      title: '가장 고민되는 부분은 무엇인가요?',
      options: [
        {
          value: 'dont-know-what',
          title: '무엇부터 시작해야 할지 모르겠어요',
        },
        {
          value: 'lack-time',
          title: '시간이 부족해요',
        },
        {
          value: 'quality-concern',
          title: '작성한 내용의 품질이 걱정돼요',
        },
      ],
    },
  ],
};

export const PROGRAMS: Record<ProgramId, ProgramContent> = {
  experience: {
    id: 'experience',
    title: '기필코 경험정리 챌린지',
    subtitle: '마인드맵 · STAR로 경험을 구조화',
    target: '취준을 막 시작해 경험 정리부터 필요한 분',
    duration: '2주',
    deliverable: 'STAR 기법 기반 경험정리본',
    feedback: '참여 인원 중 일부 선발 (2~4회차)',
    curriculum: [
      '경험 나열 및 소재 수집',
      '대학/교내 활동 경험 정리',
      '교외 활동 경험 정리',
      '일상 및 커리어 경험 정리',
      '경험 정리 완성 (마인드맵 · STAR)',
    ],
    features: ['마인드맵, STAR 기법 활용'],
    plans: [
      {
        id: 'basic',
        name: '베이직',
        price: '10,000원 (환급 기준)',
        note: '환급형',
      },
    ],
  },
  resume: {
    id: 'resume',
    title: '이력서 1주 완성 챌린지',
    subtitle: '경험 정리 후 채용 관점 구조화',
    target: '빠르게 이력서를 완성해야 하는 분',
    duration: '1주',
    deliverable: '멘토 피드백 반영 최종 이력서 + 합격자 10선 예시',
    feedback: '스탠다드 1회',
    curriculum: [
      '경험 정리와 소재 선별',
      '경험 분석 및 역량 강조',
      '채용 관점 구조화',
      '이력서 완성',
    ],
    features: ['합격 이력서 10선 제공'],
    plans: [
      { id: 'basic', name: '베이직', price: '10,000원 (환급 기준)' },
      { id: 'standard', name: '스탠다드', price: '29,900원' },
    ],
  },
  coverLetter: {
    id: 'coverLetter',
    title: '자기소개서 2주 완성 챌린지',
    subtitle: '직무 분석부터 마스터 자소서까지',
    target: '자기소개서를 처음 만들거나 고도화하려는 분',
    duration: '2주',
    deliverable: '마스터 자기소개서 + 맞춤형 합격자 자소서 예시',
    feedback: '스탠다드 1회 · 프리미엄 2회',
    curriculum: [
      '직무 분석',
      '경험 분석',
      '자기소개서 기초',
      '자기소개서 발전',
      '자기소개서 완성 (K-STAR-K, 3WHY)',
    ],
    features: ['K-STAR-K 프레임워크 · 3WHY 사용'],
    plans: [
      { id: 'basic', name: '베이직', price: '38,500원' },
      { id: 'standard', name: '스탠다드', price: '64,000원' },
      { id: 'premium', name: '프리미엄', price: '89,000원' },
    ],
  },
  portfolio: {
    id: 'portfolio',
    title: '포트폴리오 2주 완성 챌린지',
    subtitle: '직무 맞춤 포트폴리오 설계·작성',
    target: '지원 직무에 포트폴리오가 필요한 분',
    duration: '2주',
    deliverable: '마스터 포트폴리오 + 합격자 포트폴리오 예시',
    feedback: '스탠다드 1회 · 프리미엄 2회',
    curriculum: [
      '경험 분석',
      '포트폴리오 목차 선정',
      '포트폴리오 기초 작성',
      '포트폴리오 발전',
      '포트폴리오 완성 및 점검',
    ],
    features: ['구조화 템플릿 제공'],
    plans: [
      { id: 'basic', name: '베이직', price: '48,500원' },
      { id: 'standard', name: '스탠다드', price: '78,000원' },
      { id: 'premium', name: '프리미엄', price: '98,500원' },
    ],
  },
  enterpriseCover: {
    id: 'enterpriseCover',
    title: '대기업 자기소개서 완성 챌린지',
    subtitle: '산업·기업 분석과 공채 문항 대비',
    badge: '환급금 없음',
    target: '대기업 맞춤 경험정리·자기소개서를 작성하고 싶은 분',
    duration: '3주',
    deliverable:
      '대기업 맞춤 경험정리본, 자기소개서, 산업/기업분석 특강 자료 및 템플릿',
    feedback: '스탠다드 2회 · 프리미엄 4회',
    curriculum: [
      '기업/산업 분석',
      '직무 분석',
      '경험 분석 + 서면 멘토링',
      '직무 역량 답변 + 서면 멘토링',
      '지원동기 답변 + 서면 멘토링',
      '자기소개서 완성 + Live 멘토링',
    ],
    features: ['대기업 현직자 특강 4회', '기업별 맞춤 분석 심화 커리큘럼'],
    plans: [
      { id: 'basic', name: '베이직', price: '113,500원', note: '환급금 없음' },
      { id: 'standard', name: '스탠다드', price: '164,000원', note: '환급금 없음' },
      { id: 'premium', name: '프리미엄', price: '214,000원', note: '환급금 없음' },
    ],
  },
  marketingAllInOne: {
    id: 'marketingAllInOne',
    title: '마케팅 서류 완성 올인원 챌린지',
    subtitle: '현직자와 경험정리·자소서·포트폴리오 완성',
    badge: '환급금 없음',
    target: '마케팅 직무 서류를 한 번에 완성하고 싶은 분',
    duration: '4주',
    deliverable:
      '경험정리 + 자기소개서 + 포트폴리오 완성, 마케팅 합격 이력서/포트폴리오 예시',
    feedback: '스탠다드 1회 · 프리미엄 2회',
    curriculum: [
      '직무 탐색',
      '경험 정리',
      '컨셉 설정',
      '자기소개서 작성',
      '포트폴리오 작성 및 완성',
    ],
    features: [
      '단계별 마케팅 취업 자료/템플릿',
      '마케팅 실무 역량 Class 4회 (Figma·GA·Meta)',
      '마케팅 현직자 세미나 4회',
      'CMO/CPO 필수역량 세미나',
    ],
    plans: [
      { id: 'basic', name: '베이직', price: '99,000원', note: '환급금 없음' },
      { id: 'standard', name: '스탠다드', price: '149,000원', note: '환급금 없음' },
      { id: 'premium', name: '프리미엄', price: '179,000원', note: '환급금 없음' },
    ],
  },
  hrAllInOne: {
    id: 'hrAllInOne',
    title: 'HR 서류 완성 올인원 챌린지',
    subtitle: 'HR 현직자와 경험정리·자소서·포트폴리오 완성',
    badge: '환급금 없음',
    target: 'HR 직무 서류를 한 번에 완성하고 싶은 분',
    duration: '3주',
    deliverable:
      '경험정리 + 자기소개서 + 포트폴리오 완성, HR 합격 이력서/포트폴리오 예시',
    feedback: '스탠다드 1회 · 프리미엄 2회',
    curriculum: [
      '직무 탐색',
      '경험 정리',
      '컨셉 잡기',
      '자기소개서 작성',
      '포트폴리오 작성 및 완성',
    ],
    features: [
      'HR 현직자 세미나 4회 (채용/조직/People Analytics/서류 분석)',
      'HR 세부 직무 학습 자료',
    ],
    plans: [
      { id: 'basic', name: '베이직', price: '89,000원', note: '환급금 없음' },
      { id: 'standard', name: '스탠다드', price: '123,000원', note: '환급금 없음' },
      { id: 'premium', name: '프리미엄', price: '156,000원', note: '환급금 없음' },
    ],
  },
};

export const CHALLENGE_COMPARISON: ChallengeComparisonRow[] = [
  {
    programId: 'experience',
    label: '기필코 경험정리 챌린지',
    target: '취준을 막 시작해서 경험 정리부터 필요한 분',
    duration: '2주',
    pricing: '베이직 10,000원 (환급)',
    curriculum: '1. 경험 나열\n2. 대학 교내 활동 경험 정리\n3. 교외 활동 경험 정리\n4. 일상 및 커리어 경험 정리\n5. 경험 정리 완성\n\n사용기법: 마인드맵·STAR 기법',
    deliverable: 'STAR 기법 기반 경험정리본',
    feedback: '참여 인원 중 일부 선발',
  },
  {
    programId: 'resume',
    label: '이력서 1주 완성 챌린지',
    target: '빠르게 이력서를 완성해야 하는 분',
    duration: '1주',
    pricing: '[베이직] 10,000원\n[스탠다드] 29,900원',
    curriculum: '1. 경험 정리\n2. 경험 분석\n3. 역량 강조\n4. 이력서 완성',
    deliverable: '멘토 피드백 반영 최종 이력서\n\n합격자 이력서 10선 예시 제공',
    feedback: '[스탠다드] 1회',
  },
  {
    programId: 'coverLetter',
    label: '자기소개서 2주 완성 챌린지',
    target: '자기소개서를 처음 만들거나 고도화하고 싶은 분',
    duration: '2주',
    pricing: '[베이직] 38,500원\n[스탠다드] 64,000원\n[프리미엄] 89,000원',
    curriculum: '1. 직무 분석\n2. 경험 분석\n3. 자기소개서 기초\n4. 자기소개서 발전\n5. 자기소개서 완성\n\n사용 기법: K-STAR-K·3WHY',
    deliverable: '마스터 자기소개서\n\n맞춤형 합격자 자소서 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
  },
  {
    programId: 'portfolio',
    label: '포트폴리오 2주 완성 챌린지',
    target: '지원 직무에 포트폴리오가 필요한 분',
    duration: '2주',
    pricing: '[베이직] 48,500원\n[스탠다드] 78,000원\n[프리미엄] 98,500원',
    curriculum: '1. 경험 분석\n2. 포트폴리오 목차 선정\n3. 포트폴리오 기초\n4. 포트폴리오 발전\n5. 포트폴리오 완성\n6. 포트폴리오 점검\n\n사용 템플릿: 구조화 템플릿 제공',
    deliverable: '마스터 포트폴리오\n\n합격자 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
  },
  {
    programId: 'enterpriseCover',
    label: '대기업 자기소개서완성 챌린지',
    target: '대기업 맞춤형 경험정리, 자기소개서를 작성해보고 싶은 분',
    duration: '3주',
    pricing: '[베이직] 113,500원\n[스탠다드] 164,000원\n[프리미엄] 214,000원\n(환급금 없음)',
    curriculum: '1. 기업/산업 분석\n2. 직무 분석\n3. 경험 분석\n4. 직무 역량 답변\n5. 지원동기 답변\n6. 자기소개서 완성\n\n사용 기법: SWOT 분석·STAR 기법·K-STAR-K·3WHY',
    deliverable: '대기업 맞춤 경험정리본\n대기업 맞춤 자기소개서\n\n산업/기업분석 특강 자료 및 템플릿\n대기업 공채 합격자 지원동기 예시 제공',
    feedback: '[스탠다드] 2회\n[프리미엄] 4회',
    features: '1. 대기업 현직자 특강 4회\n2. 기업별 맞춤 분석심화 커리큘럼',
  },
  {
    programId: 'marketingAllInOne',
    label: '마케팅 서류 완성 올인원 챌린지',
    target: '마케팅 현직자와 함께 경험정리, 자소서, 포트폴리오까지 한 번에 완성하고 싶은 분',
    duration: '4주',
    pricing: '[베이직] 99,000원\n[스탠다드] 149,000원\n[프리미엄] 179,000원\n(환급금 없음)',
    curriculum: '1. 기업/산업 분석\n2. 직무 분석\n3. 경험 분석\n4. 직무 역량 답변\n5. 지원동기 답변\n6. 자기소개서 완성\n7. 포트폴리오 기초\n8. 포트폴리오 완성',
    deliverable: '경험정리+자기소개서+포트폴리오\n현직자와 함께 한 번에 완성\n\n마케팅 합격 이력서, 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
    features: '1. 단계별 마케팅 취업 준비 교육 자료 및 템플릿\n2. 마케팅 실무 역량 Class 4회 (Figma, GA, Meta)\n3. 마케팅 현직자 세미나 4회\n4. 렛츠커리어 CMO, CPO의 필수역량 세미나',
  },
  {
    programId: 'hrAllInOne',
    label: 'HR 서류 완성 올인원 챌린지',
    target: 'HR 현직자와 함께 경험정리, 자소서, 포트폴리오까지 한 번에 완성하고 싶은 분',
    duration: '3주',
    pricing: '[베이직] 89,000원\n[스탠다드] 123,000원\n[프리미엄] 156,000원\n(환급금 없음)',
    curriculum: '1. 직무 탐색\n2. 경험 정리\n3. 컨셉 잡기\n4. 자기소개서 작성\n5. 포트폴리오 작성\n6. 자기소개서 및 포트폴리오 완성\n\n특별 미션: HR 아티클, 뉴스 아카이빙 스터디\n카카오/코드잇/LG전자 등 과제 수행 및 피드백',
    deliverable: '경험정리+자기소개서+포트폴리오\n현직자와 함께 한 번에 완성\n\nHR 합격 이력서, 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
    features: '1. HR 현직자 세미나 4회\n(채용/조직문화/People Analytics/HR 합격 서류 분석)\n2. HR 세부 직무 학습 자료',
  },
];

export const FREQUENT_COMPARISON: FrequentComparisonItem[] = [
  {
    title: '자소서 vs 대기업 자소서',
    left: '자기소개서 2주 완성 챌린지',
    right: '대기업 자기소개서 완성 챌린지',
    rows: [
      {
        label: '추천 대상',
        left: '직무 역량/지원동기 작성법을 배우고 싶은 분',
        right: '공채 빈출 문항을 미리 작성하고 현직자 피드백을 받고 싶은 분',
      },
      {
        label: '제공 자료',
        left: '회차별 가이드북과 미션 템플릿',
        right: '산업/기업 분석 특강, 자료/템플릿 제공',
      },
      {
        label: '미션 회차',
        left: '직무·경험 분석 → 자소서 기초/발전 → 완성 (5회차)',
        right: '기업/산업·직무 분석 → 경험/역량/지원동기 → 라이브 멘토링 포함 (6회차)',
      },
      {
        label: '진행 기간 / 피드백',
        left: '2주 / 최대 2회 (플랜별 상이)',
        right: '3주 / 최대 4회 (플랜별 상이)',
      },
    ],
  },
  {
    title: '자소서 vs 마케팅 올인원',
    left: '자기소개서 2주 완성 챌린지',
    right: '마케팅 서류 완성 올인원 챌린지',
    rows: [
      {
        label: '추천 대상',
        left: '전반적인 자기소개서를 작성해보고 싶은 분',
        right: '마케팅 직무 맞춤 서류를 경험정리~포폴까지 한 번에 완성하고 싶은 분',
      },
      {
        label: '제공 자료',
        left: '회차별 가이드북과 미션 템플릿',
        right: '단계별 마케팅 자료/템플릿, 실무 Class 4회, 현직자 세미나 4회',
      },
      {
        label: '미션 회차',
        left: '직무·경험 분석 → 자소서 기초/발전 → 완성 (5회차)',
        right: '직무 탐색 → 경험 정리 → 컨셉 → 이력서/자소서 → 포트폴리오 (8회차)',
      },
      {
        label: '진행 기간 / 피드백',
        left: '2주 / 최대 2회 (플랜별)',
        right: '4주 / 최대 2회 (플랜별)',
      },
    ],
  },
  {
    title: '경험정리 vs 이력서',
    left: '기필코 경험정리 챌린지',
    right: '이력서 1주 완성 챌린지',
    rows: [
      {
        label: '추천 대상',
        left: '경험 정리부터 필요한 분',
        right: '마스터 이력서를 완성하고 싶은 분',
      },
      {
        label: '제공 자료',
        left: '학습 콘텐츠 · 미션 템플릿, 경험정리 Best/Worst 100',
        right: '학습 콘텐츠 · 미션 템플릿, 2025 합격 이력서 10선, Do/Don’t 가이드',
      },
      {
        label: '미션 회차',
        left: '경험 나열 → 교내/교외/일상 경험 정리 → 완성 (5회차)',
        right: '경험 정리 → 분석 → 역량 강조 → 완성 (4회차)',
      },
      {
        label: '진행 기간 / 피드백',
        left: '2주 / 회차별 일부 선발 피드백',
        right: '1주 / 최대 1회 (플랜별)',
      },
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    question: '한 번에 몇 개까지 동시 수강 가능한가요?',
    answer:
      '시간 여유가 충분하다면 최대 2개까지 병행을 추천드려요. 완주에 자신이 있을 때 병행하는 것이 좋습니다.',
  },
  {
    question: '경험정리 없이 이력서/자소서 챌린지부터 들어도 될까요?',
    answer:
      '이미 경험정리가 되어 있다면 바로 수강 가능합니다. 다만 더 높은 완성도를 위해서는 경험정리를 먼저 탄탄히 하는 것을 권장합니다.',
  },
  {
    question: '경험정리 챌린지 후에 이력서 챌린지를 들어도 되나요?',
    answer:
      '네. 많은 분들이 경험정리 후 이력서를 이어서 듣습니다. 경험정리는 소재 정리, 이력서는 채용 관점 구조화에 초점을 둬서 서로 보완적입니다.',
  },
  {
    question: '경력직/이직 준비자도 참여 가능한가요?',
    answer:
      '가능합니다. 경험을 성과 중심으로 정리하고 포지션에 맞게 설득력 있게 쓰는 방식은 동일하게 적용됩니다.',
  },
  {
    question: '이과 직무도 참여할 수 있나요?',
    answer:
      '네. 직무가 달라도 경험을 구조화하고 설득력 있게 보여주는 방식은 같아서 충분히 적용 가능합니다.',
  },
  {
    question: '직장인/인턴 병행이 가능한가요?',
    answer:
      '직장인/인턴도 많이 수강합니다. 다만 퇴근 후 주 1~2개 병행은 집중도가 떨어질 수 있어, 시간 여유가 있을 때 병행을 추천드립니다.',
  },
  {
    question: '합격 자료 예시는 몇 개까지 제공되나요?',
    answer:
      '프로그램별로 핵심 합격 자료 세트가 제공됩니다. 예시 수는 챌린지 소개와 대시보드 자료실에 명시되어 있으며, 제공된 템플릿은 수강 완료 후에도 열람 가능합니다.',
  },
  {
    question: '오픈채팅방 참여 코드는 어디서 확인하나요?',
    answer:
      '결제 후 대시보드 0회차 OT 안내에서 참여 코드를 안내합니다. 메일/SMS 공지와 함께 제공되며, 놓쳤다면 고객센터로 문의해주세요.',
  },
  {
    question: 'OT를 놓쳤는데 오픈채팅방은 어떻게 들어가나요?',
    answer:
      '대시보드 공지 또는 0회차 OT 자료에서 참여 코드를 확인할 수 있습니다. 만료되었을 경우 고객센터/멘토에게 문의하면 재발급을 도와드립니다.',
  },
  {
    question: '결제했는데 대시보드가 보이지 않아요.',
    answer:
      '결제 후 반영까지 1~3분 정도 소요될 수 있습니다. 새로고침 후에도 보이지 않으면 고객센터로 결제 정보를 알려주세요.',
  },
  {
    question: 'OT 영상은 어디서 볼 수 있나요?',
    answer: '대시보드 입장 후 0회차 미션에서 OT 영상을 시청할 수 있습니다.',
  },
  {
    question: '챌린지 종료 후에도 템플릿을 활용할 수 있나요?',
    answer:
      '중간 이탈 없이 완수하면 콘텐츠와 템플릿을 무제한으로 이용할 수 있습니다. 미션을 한 번이라도 제출하면 열람이 유지됩니다.',
  },
  {
    question: '피드백은 어떤 식으로 진행되나요?',
    answer:
      '플랜에 따라 서면 피드백 또는 라이브 멘토링이 포함됩니다. 베이직은 가이드 중심, 스탠다드 이상은 회차별 피드백 횟수가 제공됩니다.',
  },
];

export const GUIDE_STEPS = [
  '추천 수강 순서: 경험정리 → 이력서 → 자기소개서 → 포트폴리오. 경험정리 이후에는 이·자·포를 스케줄에 맞춰 병행 가능합니다.',
  '특화 트랙(대기업, 마케팅, HR)은 현직자와 함께 3~4주 안에 경자포를 완주하도록 설계되어 있습니다.',
  '공고 마감이 임박했다면 단일 챌린지를 우선 완료하고, 여유가 생기면 병행 챌린지를 순차적으로 추가하세요.',
];
