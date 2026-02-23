import { ChallengeComparisonRow, FrequentComparisonItem } from '../types/types';

export const CHALLENGE_COMPARISON: ChallengeComparisonRow[] = [
  {
    programId: 'experience',
    label: '기필코 경험정리 챌린지',
    target: '취준을 막 시작해서 경험 정리부터 필요한 분',
    duration: '2주',
    pricing: '베이직 10,000원 (환급)',
    curriculum:
      '1. 경험 나열\n2. 대학 교내 활동 경험 정리\n3. 교외 활동 경험 정리\n4. 일상 및 커리어 경험 정리\n5. 경험 정리 완성\n\n사용기법: 마인드맵·STAR 기법',
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
    curriculum:
      '1. 직무 분석\n2. 경험 분석\n3. 자기소개서 기초\n4. 자기소개서 발전\n5. 자기소개서 완성\n\n사용 기법: K-STAR-K·3WHY',
    deliverable: '마스터 자기소개서\n\n맞춤형 합격자 자소서 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
  },
  {
    programId: 'portfolio',
    label: '포트폴리오 2주 완성 챌린지',
    target: '지원 직무에 포트폴리오가 필요한 분',
    duration: '2주',
    pricing: '[베이직] 48,500원\n[스탠다드] 78,000원\n[프리미엄] 98,500원',
    curriculum:
      '1. 경험 분석\n2. 포트폴리오 목차 선정\n3. 포트폴리오 기초\n4. 포트폴리오 발전\n5. 포트폴리오 완성\n6. 포트폴리오 점검\n\n사용 템플릿: 구조화 템플릿 제공',
    deliverable: '마스터 포트폴리오\n\n합격자 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
  },
  {
    programId: 'enterpriseCover',
    label: '대기업 자기소개서완성 챌린지',
    target: '대기업 맞춤형 경험정리, 자기소개서를 작성해보고 싶은 분',
    duration: '3주',
    pricing:
      '[베이직] 113,500원\n[스탠다드] 164,000원\n[프리미엄] 214,000원\n(환급금 없음)',
    curriculum:
      '1. 기업/산업 분석\n2. 직무 분석\n3. 경험 분석\n4. 직무 역량 답변\n5. 지원동기 답변\n6. 자기소개서 완성\n\n사용 기법: SWOT 분석·STAR 기법·K-STAR-K·3WHY',
    deliverable:
      '대기업 맞춤 경험정리본\n대기업 맞춤 자기소개서\n\n산업/기업분석 특강 자료 및 템플릿\n대기업 공채 합격자 지원동기 예시 제공',
    feedback: '[스탠다드] 2회\n[프리미엄] 4회',
    features: '1. 대기업 현직자 특강 4회\n2. 기업별 맞춤 분석심화 커리큘럼',
  },
  {
    programId: 'marketingAllInOne',
    label: '마케팅 서류 완성 올인원 챌린지',
    target:
      '마케팅 현직자와 함께 경험정리, 자소서, 포트폴리오까지 한 번에 완성하고 싶은 분',
    duration: '4주',
    pricing:
      '[베이직] 99,000원\n[스탠다드] 149,000원\n[프리미엄] 179,000원\n(환급금 없음)',
    curriculum:
      '1. 기업/산업 분석\n2. 직무 분석\n3. 경험 분석\n4. 직무 역량 답변\n5. 지원동기 답변\n6. 자기소개서 완성\n7. 포트폴리오 기초\n8. 포트폴리오 완성',
    deliverable:
      '경험정리+자기소개서+포트폴리오\n현직자와 함께 한 번에 완성\n\n마케팅 합격 이력서, 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
    features:
      '1. 단계별 마케팅 취업 준비 교육 자료 및 템플릿\n2. 마케팅 실무 역량 Class 4회 (Figma, GA, Meta)\n3. 마케팅 현직자 세미나 4회\n4. 렛츠커리어 CMO, CPO의 필수역량 세미나',
  },
  {
    programId: 'hrAllInOne',
    label: 'HR 서류 완성 올인원 챌린지',
    target:
      'HR 현직자와 함께 경험정리, 자소서, 포트폴리오까지 한 번에 완성하고 싶은 분',
    duration: '3주',
    pricing:
      '[베이직] 89,000원\n[스탠다드] 123,000원\n[프리미엄] 156,000원\n(환급금 없음)',
    curriculum:
      '1. 직무 탐색\n2. 경험 정리\n3. 컨셉 잡기\n4. 자기소개서 작성\n5. 포트폴리오 작성\n6. 자기소개서 및 포트폴리오 완성\n\n특별 미션: HR 아티클, 뉴스 아카이빙 스터디\n카카오/코드잇/LG전자 등 과제 수행 및 피드백',
    deliverable:
      '경험정리+자기소개서+포트폴리오\n현직자와 함께 한 번에 완성\n\nHR 합격 이력서, 포트폴리오 예시 제공',
    feedback: '[스탠다드] 1회\n[프리미엄] 2회',
    features:
      '1. HR 현직자 세미나 4회\n(채용/조직문화/People Analytics/HR 합격 서류 분석)\n2. HR 세부 직무 학습 자료',
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
        right:
          '기업/산업·직무 분석 → 경험/역량/지원동기 → 라이브 멘토링 포함 (6회차)',
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
        right:
          '마케팅 직무 맞춤 서류를 경험정리~포폴까지 한 번에 완성하고 싶은 분',
      },
      {
        label: '제공 자료',
        left: '회차별 가이드북과 미션 템플릿',
        right: '단계별 마케팅 자료/템플릿, 실무 Class 4회, 현직자 세미나 4회',
      },
      {
        label: '미션 회차',
        left: '직무·경험 분석 → 자소서 기초/발전 → 완성 (5회차)',
        right:
          '직무 탐색 → 경험 정리 → 컨셉 → 이력서/자소서 → 포트폴리오 (8회차)',
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
        right:
          "학습 콘텐츠 · 미션 템플릿, 2025 합격 이력서 10선, Do/Don't 가이드",
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
