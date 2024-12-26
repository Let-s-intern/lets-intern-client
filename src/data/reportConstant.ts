import { ReportType } from '@/api/report';

export type reportExampleContentType = {
  title: string;
  src: string;
  description: string[];
};

export const REPORT_EXAMPLE: Record<
  ReportType,
  {
    name: string;
    hopeJob: string;
    problem: string;
    header: string;
    content: reportExampleContentType[];
  }
> = {
  RESUME: {
    name: '임*정',
    hopeJob: 'PM 직무 희망',
    problem:
      '지금까지 한 경험들을 직무 역량에 맞게 어떻게 정리해야할지 모르겠어요.',
    header: '렛츠커리어가 제시하는 맞춤 이력서 솔루션!',
    content: [
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
  },
  PERSONAL_STATEMENT: {
    name: '임*정',
    hopeJob: 'PM 직무 희망',
    problem:
      '지금까지 한 경험들을 직무 역량에 맞게 어떻게 정리해야할지 모르겠어요.',
    header: '렛츠커리어가 제시하는 맞춤 자소서 솔루션!',
    content: [
      {
        title: '6가지 핵심 기준을 바탕으로 진단한 총평과 형식 피드백',
        src: 'images/report/report_example_1.png',
        description: [
          `6가지 핵심 기준 :\n가독성 / 구조 및 구성 / 직무 적합성 / 정확성 / 간결성 / 구체성`,
          `이력서의 강점과 약점을 분석하여 총평과 개선 방향을 제공합니다.`,
          `직무에 적합한 형식, 가독성 높은 구성 등 형식 개선에 대한 구체적인 피드백을 제안합니다`,
        ],
      },
      {
        title: '구체성과 설득력을 높이는 맞춤형 내용 피드백',
        src: 'images/report/report_example_2.png',
        description: [
          `지원 직무와 연관된 경험과 역량을 효과적으로 표현할 수 있는 방향을 제시합니다.`,
          `불필요한 내용을 정리하고, 내용 전개의 방향을 제안하여 간결하면서도 설득력 있는 이력서 작성 방법을 제공합니다.`,
        ],
      },
    ],
  },
  PORTFOLIO: {
    name: '임*정',
    hopeJob: 'PM 직무 희망',
    problem:
      '지금까지 한 경험들을 직무 역량에 맞게 어떻게 정리해야할지 모르겠어요.',
    header: '렛츠커리어가 제시하는 맞춤 자소서 솔루션!',
    content: [
      {
        title: '6가지 핵심 기준을 바탕으로 진단한 총평과 형식 피드백',
        src: 'images/report/report_example_1.png',
        description: [
          `6가지 핵심 기준 :\n가독성 / 구조 및 구성 / 직무 적합성 / 정확성 / 간결성 / 구체성`,
          `이력서의 강점과 약점을 분석하여 총평과 개선 방향을 제공합니다.`,
          `직무에 적합한 형식, 가독성 높은 구성 등 형식 개선에 대한 구체적인 피드백을 제안합니다`,
        ],
      },
      {
        title: '구체성과 설득력을 높이는 맞춤형 내용 피드백',
        src: 'images/report/report_example_2.png',
        description: [
          `지원 직무와 연관된 경험과 역량을 효과적으로 표현할 수 있는 방향을 제시합니다.`,
          `불필요한 내용을 정리하고, 내용 전개의 방향을 제안하여 간결하면서도 설득력 있는 이력서 작성 방법을 제공합니다.`,
        ],
      },
    ],
  },
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
    description: string;
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
          desc: '피드백 리포트 발송 →',
        },
      ],
    },
    section1: {
      title: `혹시 반복되는 탈락에도\n매번 같은 이력서로\n\n지원하고 있지 않나요?`,
      description: `점점 높아져 가는 서류 통과의 허들,\n\n불합격만 N번째 반복 중이라면\n지금이 바로 제출 중인 이력서를 점검해 볼 때입니다.`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        `채용공고에 나와 있는 직무필수역량을\n내 이력서에 제대로 담아냈을까?`,
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
      description: `취업 성공은\n\n내 가능성을 정확히 전달하는 서류에서 시작됩니다.\n나의 강점과 직무에 적합한 역량을\n\n명확히 전달하는 서류, 이것이 바로 합격의 시작입니다.`,
      before: [
        '중구난방인 구조와 낮은 가독성',
        '뾰족히 정리되지 않은 강점',
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
          desc: '피드백 리포트 발송 →',
        },
      ],
    },
    section1: {
      title: `혹시 마감에 급급해 충분히 다듬지 못한\n자소서를 그대로 제출하고 있지 않나요?`,
      description: `내 경험들이 자소서에 제대로 녹아들었는지 확인하지 못한 채 제출하고 있었다면,\n지금이야말로 자소서를 점검하고 더 완벽하게 다듬을 기회입니다.`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        `채용공고에 나와 있는 직무필수역량을\n내 이야기로 설득력 있게 담아냈을까?`,
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
      description: `취업 성공은 내 가능성을 정확히 전달하는 자소서에서 시작됩니다.\n나의 강점과 직무에 적합한 역량을 명확히 전달하는 자소서, 이것이 바로 합격의 시작입니다.`,
      before: [
        '불분명한 지원동기',
        '두루뭉실한 경험 서술',
        '뾰족히 정리되지 않은 강점',
        '뚝뚝 끊기는 이야기 전개',
      ],
      after: [
        '직무와 연관된 확실한 지원동기',
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
          image: '/images/report/report_intro_section0_portfolio_1.png',
          desc: '온라인 제출 →',
        },
        {
          image: '/images/report/report_intro_section0_portfolio_2.png',
          desc: '48시간 이내 진단 →',
        },
        {
          image: '/images/report/report_intro_section0_portfolio_3.png',
          desc: '피드백 리포트 발송 →',
        },
      ],
    },
    section1: {
      title: `혹시 반복되는 탈락에도\n매번 같은 이력서로 지원하고 있지 않나요?`,
      description: `점점 높아져 가는 서류 통과의 허들, 불합격만 N번째 반복 중이라면\n지금이 바로 제출 중인 이력서를 점검해 볼 때입니다.`,
      questions: [
        '왜 내 서류는 자꾸 탈락할까?',
        '채용공고에 나와 있는 직무필수역량을 내 이력서에 제대로 담아냈을까?',
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
      description: `취업 성공은 내 가능성을 정확히 전달하는 서류에서 시작됩니다.\n나의 강점과 직무에 적합한 역량을 명확히 전달하는 서류, 이것이 바로 합격의 시작입니다.`,
      before: [
        '중구난방인 구조와 낮은 가독성',
        '뾰족히 정리되지 않은 강점',
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
