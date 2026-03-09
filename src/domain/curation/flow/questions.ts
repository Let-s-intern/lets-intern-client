import { CurationQuestion, PersonaId } from '../types';

export const QUESTION_MAP: Record<PersonaId, CurationQuestion[]> = {
  starter: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'has-experience',
          title: '경험은 있는데 어디서부터 정리해야 할지 모르겠어요',
        },
        {
          value: 'needs-resume',
          title: '이력서 제출이 1주일도 안 남았어요',
        },
        {
          value: 'needs-bundle',
          title: '서류 전체를 한 번에 정비하고 싶어요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'self-guide',
          title: '가이드 따라 경험을 스스로 정리해볼게요',
          group: 'has-experience',
        },
        {
          value: 'with-feedback',
          title: '현직자 피드백 받으며 경험을 완성하고 싶어요',
          group: 'has-experience',
        },
        {
          value: 'with-resume',
          title: '이력서 작성까지 연결해서 한 번에 해결하고 싶어요',
          group: 'has-experience',
        },
        {
          value: 'fast-resume',
          title: '경험 정리 후 이력서를 최대한 빠르게 완성할게요',
          group: 'needs-resume',
        },
        {
          value: 'mentor-resume',
          title: '멘토 피드백 받으며 이력서까지 완성하고 싶어요',
          group: 'needs-resume',
        },
        {
          value: 'with-cover',
          title: '자소서까지 한꺼번에 준비하고 싶어요',
          group: 'needs-resume',
        },
        {
          value: 'fast-bundle',
          title: '자소서·포폴을 가이드로 빠르게 정비할게요',
          group: 'needs-bundle',
        },
        {
          value: 'cover-feedback',
          title: '멘토 피드백 받으며 자소서를 완성하고 싶어요',
          group: 'needs-bundle',
        },
        {
          value: 'portfolio-feedback',
          title: '포트폴리오까지 피드백 받아 완성하고 싶어요',
          group: 'needs-bundle',
        },
      ],
    },
  ],
  resume: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'first-resume',
          title: '첫 이력서라 쓸 소재가 부족해요',
        },
        {
          value: 'refresh',
          title: '기존 이력서를 다시 다듬으려고 해요',
        },
        {
          value: 'career-shift',
          title: '직무/산업 전환으로 이력서를 새로 써야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'week-draft',
          title: '이번 주 안에 일단 초안을 완성할게요',
          group: 'first-resume',
        },
        {
          value: 'mentor-2-3weeks',
          title: '2~3주 안에 멘토 피드백 받으며 완성하고 싶어요',
          group: 'first-resume',
        },
        {
          value: 'month-experience',
          title: '한 달 여유로 경험 정리부터 탄탄하게 시작할게요',
          group: 'first-resume',
        },
        {
          value: 'fast-fix',
          title: '이번 주 안에 빠르게 수정·완성할게요',
          group: 'refresh',
        },
        {
          value: 'mentor-improve',
          title: '2~3주 안에 멘토 피드백으로 완성도를 높이고 싶어요',
          group: 'refresh',
        },
        {
          value: 'full-rewrite',
          title: '한 달 여유로 이력서를 제대로 새로 써보고 싶어요',
          group: 'refresh',
        },
        {
          value: 'shift-fast',
          title: '이번 주 안에 새 직무 이력서를 완성할게요',
          group: 'career-shift',
        },
        {
          value: 'shift-with-cover',
          title: '2~3주 안에 자소서까지 함께 완성하고 싶어요',
          group: 'career-shift',
        },
        {
          value: 'shift-month',
          title: '한 달 여유로 이력서·자소서 둘 다 제대로 쓸게요',
          group: 'career-shift',
        },
      ],
    },
  ],
  coverLetter: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'general-cover',
          title: '직무 역량·지원동기 중심 기본 자소서가 필요해요',
        },
        {
          value: 'enterprise-cover',
          title: '삼성·현대·SK 등 대기업 공채 자소서가 필요해요',
        },
        {
          value: 'portfolio-linked',
          title: '자소서에 포폴 사례까지 함께 보여줘야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'self-write',
          title: '가이드만으로 스스로 작성해볼게요',
          group: 'general-cover',
        },
        {
          value: 'live-1',
          title: '멘토 LIVE 피드백 1회로 완성하고 싶어요',
          group: 'general-cover',
        },
        {
          value: 'deep-feedback',
          title: '문항마다 심층 피드백 받아 완성하고 싶어요',
          group: 'general-cover',
        },
        {
          value: 'enterprise-self',
          title: '기업·산업 분석 가이드로 스스로 써볼게요',
          group: 'enterprise-cover',
        },
        {
          value: 'enterprise-mentor',
          title: '멘토 피드백 받으며 공채 자소서를 완성할게요',
          group: 'enterprise-cover',
        },
        {
          value: 'enterprise-intensive',
          title: '문항별 집중 첨삭으로 합격 자소서를 완성할게요',
          group: 'enterprise-cover',
        },
        {
          value: 'portfolio-guide',
          title: '가이드로 자소서·포폴 틀을 잡아볼게요',
          group: 'portfolio-linked',
        },
        {
          value: 'portfolio-mentor',
          title: '멘토 피드백으로 자소서를 완성하고 싶어요',
          group: 'portfolio-linked',
        },
        {
          value: 'portfolio-both',
          title: '자소서·포폴 둘 다 집중 피드백 받고 싶어요',
          group: 'portfolio-linked',
        },
      ],
    },
  ],
  portfolio: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'portfolio-core',
          title: '직무 포트폴리오를 처음 만들어야 해요',
        },
        {
          value: 'marketing-track',
          title: '마케팅 직무 취업을 위한 포폴과 서류가 필요해요',
        },
        {
          value: 'hr-track',
          title: 'HR 직무 취업을 위한 포폴과 서류가 필요해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'has-draft',
          title: '초안이 있으니 가이드로 구조화할게요',
          group: 'portfolio-core',
        },
        {
          value: 'need-example',
          title: '예시·템플릿 보며 처음부터 만들고 싶어요',
          group: 'portfolio-core',
        },
        {
          value: 'need-feedback',
          title: '멘토 피드백으로 완성도를 높이고 싶어요',
          group: 'portfolio-core',
        },
        {
          value: 'mkt-guide',
          title: '초안이 있으니 올인원 가이드로 정리할게요',
          group: 'marketing-track',
        },
        {
          value: 'mkt-mentor',
          title: '멘토 피드백 받아 마케팅 포폴을 완성할게요',
          group: 'marketing-track',
        },
        {
          value: 'mkt-premium',
          title:
            '현직자 멘토의 강의와 무제한 QNA와 함께 마케팅 포폴을 완성할게요',
          group: 'marketing-track',
        },
        {
          value: 'hr-guide',
          title: '초안이 있으니 올인원 가이드로 정리할게요',
          group: 'hr-track',
        },
        {
          value: 'hr-mentor',
          title: '멘토 피드백 받아 HR 포폴을 완성할게요',
          group: 'hr-track',
        },
        {
          value: 'hr-premium',
          title:
            '현직자 멘토의 강의와 무제한 QNA와 함께 HR 포폴을 완성할게요',
          group: 'hr-track',
        },
      ],
    },
  ],
  specialized: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'enterprise',
          title: '삼성·현대·SK 등 대기업 공채를 집중 준비해요',
        },
        {
          value: 'marketing',
          title: '마케팅 직무로 취업을 본격 준비해요',
        },
        {
          value: 'hr',
          title: 'HR 직무로 취업을 본격 준비해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'ent-experience',
          title: '경험부터 다시 정리하며 공채 자소서를 써볼게요',
          group: 'enterprise',
        },
        {
          value: 'ent-intensive',
          title: '문항별 집중 첨삭으로 완성도를 높이고 싶어요',
          group: 'enterprise',
        },
        {
          value: 'ent-guide',
          title: '자소서 가이드로 빠르게 완성할게요',
          group: 'enterprise',
        },
        {
          value: 'mkt-experience',
          title: '경험부터 다시 정리하며 마케팅 서류를 써볼게요',
          group: 'marketing',
        },
        {
          value: 'mkt-intensive',
          title: '현직자 특강·멘토 피드백으로 완성도를 높이고 싶어요',
          group: 'marketing',
        },
        {
          value: 'mkt-fast',
          title: '마케팅 서류를 가이드로 빠르게 완성할게요',
          group: 'marketing',
        },
        {
          value: 'hr-experience',
          title: '경험부터 다시 정리하며 HR 서류를 써볼게요',
          group: 'hr',
        },
        {
          value: 'hr-intensive',
          title: '현직자 특강·멘토 피드백으로 완성도를 높이고 싶어요',
          group: 'hr',
        },
        {
          value: 'hr-fast',
          title: 'HR 서류를 가이드로 빠르게 완성할게요',
          group: 'hr',
        },
      ],
    },
  ],
  interview: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'failing-interview',
          title: '서류는 통과하는데 면접에서 자꾸 떨어져요',
        },
        {
          value: 'first-interview',
          title: '면접이 처음이에요 기초부터 체계적으로 준비할게요',
        },
        {
          value: 'docs-and-interview',
          title: '서류와 면접을 함께 준비해야 해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'self-prep',
          title: '자기소개·기본 답변을 스스로 정리할게요',
          group: 'failing-interview',
        },
        {
          value: 'mock-1',
          title: '모의면접 1회로 실전 피드백 받고 싶어요',
          group: 'failing-interview',
        },
        {
          value: 'mock-2-special',
          title: '모의면접 2회 + 현직자 특강까지 받고 싶어요',
          group: 'failing-interview',
        },
        {
          value: 'first-self',
          title: '답변 구성과 예상 질문을 혼자 정리할게요',
          group: 'first-interview',
        },
        {
          value: 'first-mock',
          title: '모의면접으로 부족한 부분 피드백 받을게요',
          group: 'first-interview',
        },
        {
          value: 'first-full',
          title: '모의면접 + 현직자 특강으로 완전히 준비할게요',
          group: 'first-interview',
        },
        {
          value: 'docs-first',
          title: '서류가 더 급해서 서류 먼저 끝낼게요',
          group: 'docs-and-interview',
        },
        {
          value: 'docs-then-interview',
          title: '서류 완성 후 면접까지 이어서 준비할게요',
          group: 'docs-and-interview',
        },
        {
          value: 'both-intensive',
          title: '서류도 면접도 둘 다 제대로 받고 싶어요',
          group: 'docs-and-interview',
        },
      ],
    },
  ],
  dontKnow: [
    {
      id: 'step1',
      title: '지금 상황에 가장 가까운 것을 골라주세요.',
      options: [
        {
          value: 'just-started',
          title: '아직 아무것도 시작을 못 했어요',
        },
        {
          value: 'working-on-docs',
          title: '서류를 쓰고 있는데 방향이 맞는지 모르겠어요',
        },
        {
          value: 'almost-ready',
          title: '거의 다 됐는데 마지막 점검이 필요해요',
        },
      ],
    },
    {
      id: 'step2',
      title: '어떤 방식으로 준비하고 싶으세요?',
      options: [
        {
          value: 'start-slow',
          title: '일단 경험 정리부터 차근차근 시작할게요',
          group: 'just-started',
        },
        {
          value: 'start-fast',
          title: '시간이 없으니 이력서·자소서부터 바로 시작할게요',
          group: 'just-started',
        },
        {
          value: 'start-quality',
          title: '천천히 완성도 높게 처음부터 준비하고 싶어요',
          group: 'just-started',
        },
        {
          value: 'reset-direction',
          title: '자소서·이력서 방향을 처음부터 다시 잡아볼게요',
          group: 'working-on-docs',
        },
        {
          value: 'finish-fast',
          title: '시간이 없으니 이력서·자소서를 빠르게 마무리할게요',
          group: 'working-on-docs',
        },
        {
          value: 'mentor-quality',
          title: '멘토 피드백으로 자소서 완성도를 높이고 싶어요',
          group: 'working-on-docs',
        },
        {
          value: 'final-check',
          title: '포폴·자소서를 마지막으로 한 번 점검하고 싶어요',
          group: 'almost-ready',
        },
        {
          value: 'quick-finish',
          title: '시간이 없어서 빠르게 마무리할게요',
          group: 'almost-ready',
        },
        {
          value: 'final-mentor',
          title: '멘토 피드백으로 마지막 완성도를 올리고 싶어요',
          group: 'almost-ready',
        },
      ],
    },
  ],
};
