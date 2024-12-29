import { ReportType } from '@/api/report';

export type reportExampleContentType = {
  title: string;
  src: string;
  description: string[];
};

export const REPORT_EXAMPLE: Record<ReportType, reportExampleContentType[]> = {
  RESUME: [
    {
      title: `1. 6가지 핵심 기준을 바탕으로\n진단한 총평과 형식 피드백`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `이력서의 강점과 약점을 분석`,
        `직무에 적합한 형식, 가독성 높은 구성 등 형식 개선에 대한 구체적인 피드백을 제안`,
      ],
    },
    {
      title: `2. 구체성과 설득력을 높이는\n맞춤형 내용 피드백`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `직무와 연관된 경험과 역량을 효과적으로 표현할 수 있는 방향을 제시`,
        `설득력 있는 이력서 작성 방법 제공`,
      ],
    },
    {
      title: `3. 템플릿 기반의 구체적 첨삭\n및 작성 가이드`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `첨삭 예시와 구체적인 수정 방향을 제안`,
        `항목별 작성 팁과 사례를 통해 효과적인 이력서 작성 방식을 안내`,
      ],
    },
    {
      title: `4. 직무별\n합격자 사례 제공`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `같은 직무의 합격자 사례로 이력서 작성 방향, 효과적인 성과 및 강점 작성 방법 제시`,
      ],
    },
    {
      title: `5. 채용공고 맞춤형 리포트\n(프리미엄 플랜)`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `공고에 명시된 요구사항과 우대 조건을 기반으로, 이력서에 강조할 역량과 경험을 구체적으로 제안`,
      ],
    },
    {
      title: `6. 이력서 작성 고민에 대한\n1:1 상담`,
      src: '/images/report/report_example_resume_1.png',
      description: [
        `신청 시 작성한 고민을 바탕으로, 이력서 작성 방향과 구체적인 조언을 제공`,
      ],
    },
  ],
  PERSONAL_STATEMENT: [
    {
      title: `1. 5가지 핵심 기준으로\n진단한 총평과 문항 분석`,
      src: '/images/report/report_example_1.png',
      description: [
        `5가지 기준으로 분석한 총평 제공`,
        `문항 분석을 통한 효과적인 작성 방향 제안`,
      ],
    },
    {
      title: `2. 가독성,  구조 및 구성 중심의\n강점과 약점 진단`,
      src: '/images/report/report_example_2.png',
      description: [
        `가독성 및 구조 중심으로 자소서 표현력 진단`,
        `보완이 필요한 영역과 효과적으로 작성된 영역에 대한 구체적인 진단 리포트 제공`,
      ],
    },
    {
      title: `3. 구체성과 직무 연관성을\n바탕으로 한 강점과 약점 진단`,
      src: '/images/report/report_example_1.png',
      description: [
        `첨삭 예시와 구체적인 수정 방향을 제안`,
        `항목별 작성 팁과 사례를 통해 효과적인 이력서 작성 방식을 안내`,
      ],
    },
    {
      title: `4. 자소서 핵심 키워드 설정과\n스토리 전개 방향 제안`,
      src: '/images/report/report_example_2.png',
      description: [
        `직무 연관성과 구체성 중심의 자소서 진단`,
        `전문성과 신뢰성을 높일 수 있는 영역과 개선이 필요한 요소에 대한 구체적인 리포트 제공`,
      ],
    },
    {
      title: `5. 자소서 내용에 대한\n구체적 질문과 방향성 제안`,
      src: '/images/report/report_example_1.png',
      description: [
        `경험과 성과를 바탕으로 핵심 키워드 설정`,
        `직무와의 연관성을 효과적으로 전달할 수 있는 수정 방향을 제안`,
      ],
    },
    {
      title: `6. 현직자의 시선으로 보는\n자소서 피드백`,
      src: '/images/report/report_example_2.png',
      description: [
        `제출된 자소서 기반 구체적인 질문을 통해 부족한 부분을 진단하고 방향성을 제시`,
      ],
    },
    {
      title: `7. 직무별 합격 비결을 담은\n자소서 예시 제공`,
      src: '/images/report/report_example_1.png',
      description: [
        `지원 직무와 유사한 합격자 사례를 참고하여, 직무적합성과 설득력을 높이는 자소서 작성 방향을 제안`,
      ],
    },
    {
      title: `8. 현직자의 시선으로 보는\n자소서 피드백`,
      src: '/images/report/report_example_2.png',
      description: [
        `현직자의 경험과 직무 이해를 바탕으로 작성한 자소서를 심층적으로 피드백`,
      ],
    },
  ],
  PORTFOLIO: [
    {
      title: `6가지 핵심 기준을 바탕으로\n진단한 총평과 형식 피드백`,
      src: '/images/report/report_example_1.png',
      description: [
        `6가지 핵심 기준 :\n가독성 / 구조 및 구성 / 직무 적합성 / 정확성 / 간결성 / 구체성`,
        `이력서의 강점과 약점을 분석하여 총평과 개선 방향을 제공합니다.`,
        `직무에 적합한 형식, 가독성 높은 구성 등 형식 개선에 대한 구체적인 피드백을 제안합니다`,
      ],
    },
    {
      title: `구체성과 설득력을 높이는\n맞춤형 내용 피드백`,
      src: '/images/report/report_example_2.png',
      description: [
        `지원 직무와 연관된 경험과 역량을 효과적으로 표현할 수 있는 방향을 제시합니다.`,
        `불필요한 내용을 정리하고, 내용 전개의 방향을 제안하여 간결하면서도 설득력 있는 이력서 작성 방법을 제공합니다.`,
      ],
    },
  ],
};

export type reportIntroItemType = {
  section0: {
    images: {
      image: string;
      desc: string;
    }[];
  };
  section1: {
    title: string;
    questions: string[];
  };
  section2: {
    title: string;
    subTitle: string;
    description: string;
    pointSrc: string;
  };
  section3: {
    title: string;
    description: string;
    before: string[];
    after: string[];
  };
  section4: {
    title: string;
    checkList: string[];
  };
};

export const REPORT_INTRO: Record<ReportType, reportIntroItemType> = {
  RESUME: {
    section0: {
      images: [
        {
          image: '/images/report/report_intro_section0_resume_1.png',
          desc: '온라인 제출 →',
        },
        {
          image: '/images/report/report_intro_section0_resume_2.png',
          desc: '72시간 이내 진단 →',
        },
        {
          image: '/images/report/report_intro_section0_resume_3.png',
          desc: '피드백 리포트 발송',
        },
      ],
    },
    section1: {
      title: `혹시 반복되는 탈락에도\n매번 같은 이력서로\n\n지원하고 있지 않나요?`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        `채용공고에 나와 있는 직무 필수 역량을\n내 이력서에 제대로 담아냈을까?`,
        `성과, 이렇게 수치화해서\n\n적는 게 맞는 걸까?`,
      ],
    },
    section2: {
      title: `매번 서류 전형에서 탈락하는 이유는\n나의 역량을 제대로 보여주지\n\n못했기 때문일 수 있습니다.`,
      subTitle: '채용 담당자는 단 몇 초 만에 서류를 스캔합니다.',
      description: `평가자의 시선을 사로잡는 구조, 직무와 딱 맞는 내용,\n\n그리고 설득력 있는 표현을 갖춘다면,\n서류 전형 합격은 더 이상 나와 동떨어진 이야기가 아닙니다.`,
      pointSrc: '/images/report/report_intro_resume.png',
    },
    section3: {
      title: `렛츠커리어의\n\n이력서 피드백 REPORT는\n평가자의 시선을 사로잡는\n\n서류로 합격의 가능성을 높여드립니다.`,
      description: `나의 강점과 직무에 적합한 역량을\n\n명확히 전달하는 서류,\n이것이 바로 합격의 시작입니다.`,
      before: [
        '중구난방인 구조와 낮은 가독성',
        '뾰족이 정리되지 않은 강점',
        '직무와 무관해 보이는 경험',
        '수치화가 안된 임팩트 없는 성과',
      ],
      after: [
        '깔끔한 구조와 높은 가독성',
        '명확하게 정리된 나의 강점',
        '직무와 Fit한 경험 정리',
        '수치화를 통한 임팩트 극대화',
      ],
    },
    section4: {
      title: `합격을 위한 이력서 진단,\n이런 분들에게 추천합니다!`,
      checkList: [
        '기업별 채용공고에 맞춰\n\n이력서 작성이 어려우신 분',
        '자신의 서류에서 강점과\n\n약점을 명확히 파악하고 싶은 분',
        '작성한 이력서가 직무에\n\n적합한지 확신이 없는 분',
        '이력서의 문제점을 알지 못한 채\n\n무작정 지원만 하고 계신 분',
      ],
    },
  },
  PERSONAL_STATEMENT: {
    section0: {
      images: [
        {
          image: '/images/report/report_intro_section0_personal_1.png',
          desc: '온라인 제출 →',
        },
        {
          image: '/images/report/report_intro_section0_personal_2.png',
          desc: '48시간 이내 진단 →',
        },
        {
          image: '/images/report/report_intro_section0_personal_3.png',
          desc: '피드백 리포트 발송',
        },
      ],
    },
    section1: {
      title: `혹시 마감에 급급해 충분히 다듬지 못한\n자소서를 그대로 제출하고 있지 않나요?`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        `채용공고에 나와 있는 직무 필수 역량을\n내 이야기로 설득력 있게 담아냈을까?`,
        `성과, 이렇게 수치화해서\n\n적는 게 맞는 걸까?`,
      ],
    },
    section2: {
      title: `매번 서류 전형에서 탈락하는 이유는\n나의 이야기를 충분히 설득력 있게 전달하지 못했기 때문일 수 있습니다.`,
      subTitle:
        '채용 담당자는 수많은 자소서를 읽으며, 몇 초 만에 평가를 내립니다.',
      description: `평가자의 관심을 끄는 도입부, 직무와 딱 맞는 경험과 역량, 그리고 자연스러운 스토리텔링을 갖춘다면,\n서류 전형 합격은 더 이상 나와 동떨어진 이야기가 아닙니다.`,
      pointSrc: '/images/report/report_intro_personal.png',
    },
    section3: {
      title: `렛츠커리어의 자기소개서 피드백 REPORT는\n평가자의 시선을 사로잡는 자소서로 합격의 가능성을 높여드립니다.`,
      description: `나의 강점과 직무에 적합한 역량을\n\n명확히 전달하는 자소서,\n이것이 바로 합격의 시작입니다.`,
      before: [
        '불분명한 지원 동기',
        '두루뭉술한 경험 서술',
        '뾰족이 정리되지 않은 강점',
        '뚝뚝 끊기는 이야기 전개',
      ],
      after: [
        '직무와 연관된 확실한 지원 동기',
        '구체적인 경험 서술',
        '명확하게 정리된 나의 강점',
        '매끄러운 스토리텔링',
      ],
    },
    section4: {
      title: `합격을 위한 자기소개서 피드백 REPORT,\n이런 분들에게 추천합니다!`,
      checkList: [
        `자소서 문항의 의도를 정확히 파악하지 못해\n답변에 어려움을 겪으시는 분`,
        `채용공고별로 다른 자소서 문항에\n어떻게 대응해야 할지 고민이신 분`,
        `자소서에서 직무와의 연관성을\n충분히 드러내지 못해 고민이신 분`,
        `기업별 채용공고에 맞춰 자소서 작성이 어려우신 분`,
      ],
    },
  },
  PORTFOLIO: {
    section0: {
      images: [
        {
          image: '/images/report/report_intro_section0_resume_1.png',
          desc: '온라인 제출 →',
        },
        {
          image: '/images/report/report_intro_section0_resume_2.png',
          desc: '48시간 이내 진단 →',
        },
        {
          image: '/images/report/report_intro_section0_resume_3.png',
          desc: '피드백 리포트 발송',
        },
      ],
    },
    section1: {
      title: `혹시 반복되는 탈락에도\n매번 같은 이력서로 지원하고 있지 않나요?`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        '채용공고에 나와 있는 직무 필수 역량을 내 이력서에 제대로 담아냈을까?',
        '성과, 이렇게 수치화해서 적는 게 맞는 걸까?',
      ],
    },
    section2: {
      title:
        '매번 서류 전형에서 탈락하는 이유는\n나의 역량을 제대로 보여주지 못했기 때문일 수 있습니다.',
      subTitle: '채용 담당자는 단 몇 초 만에 서류를 스캔합니다.',
      description: `평가자의 시선을 사로잡는 구조, 직무와 딱 맞는 내용, 그리고 설득력 있는 표현을 갖춘다면,\n서류 전형 합격은 더 이상 나와 동떨어진 이야기가 아닙니다.`,
      pointSrc: '/images/report/report_intro_portfolio.png',
    },
    section3: {
      title: `렛츠커리어의 이력서 피드백 REPORT는\n평가자의 시선을 사로잡는 서류로 합격의 가능성을 높여드립니다.`,
      description: `나의 강점과 직무에 적합한 역량을\n\n명확히 전달하는 서류,\n이것이 바로 합격의 시작입니다.`,
      before: [
        '중구난방인 구조와 낮은 가독성',
        '뾰족이 정리되지 않은 강점',
        '직무와 무관해 보이는 경험',
        '수치화가 안된 임팩트 없는 성과',
      ],
      after: [
        '깔끔한 구조와 높은 가독성',
        '명확하게 정리된 나의 강점',
        '직무와 Fit한 경험 정리',
        '수치화를 통한 임팩트 극대화',
      ],
    },
    section4: {
      title: `합격을 위한 이력서 진단,\n이런 분들에게 추천합니다!`,
      checkList: [
        '기업별 채용공고에 맞춰 이력서 작성이 어려우신 분',
        '자신의 서류에서 강점과 약점을 명확히 파악하고 싶은 분',
        '작성한 이력서가 직무에 적합한지 확신이 없는 분',
        '이력서의 문제점을 알지 못한 채 무작정 지원만 하고 계신 분',
      ],
    },
  },
};
