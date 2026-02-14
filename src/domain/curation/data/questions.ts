import { CurationQuestion, PersonaId } from '../types/types';

export const QUESTION_MAP: Record<PersonaId, CurationQuestion[]> = {
  starter: [
    {
      id: 'step1',
      title: '지금 가장 시급한 과제는 무엇인가요?',
      helper:
        '지원서 작성 속도 vs. 경험 소재 확보 중 어디에 집중할지 골라주세요.',
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
