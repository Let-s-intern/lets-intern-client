import { ReportType } from '@/api/report';

export const REPORT_PROCESS: Record<string, string[]> = {
  RESUME: [
    '분야별 진단으로 정확한 이력서 상태 파악',
    '구체적인 첨삭 제안으로 명확한 개선 방향 제시',
    '이력서 작성 고민에 대한 맞춤형 솔루션 제공',
    '채용공고 맞춤형 피드백',
    '현직자 피드백으로 전문가의 조언까지!',
  ],
  PERSONAL_STATEMENT: [
    '자기소개서 제출',
    '진단 완료',
    '리포트 발송',
    '리포트 확인',
    '리포트 다운로드',
  ],
  PORTFOLIO: [
    '포트폴리오 제출',
    '진단 완료',
    '리포트 발송',
    '리포트 확인',
    '리포트 다운로드',
  ],
};

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

export type reportInterviewType = {
  title: string;
  question: string;
  answer: {
    title: string;
    content: string;
  };
  user: {
    img: string;
    reportName: string;
    job: string;
    name: string;
  };
};

export const REPORT_INTERVIEW: Record<
  ReportType,
  {
    interviewList: reportInterviewType[];
  }
> = {
  RESUME: {
    interviewList: [
      {
        title: 'A기업 합격',
        question:
          '이력서 피드백 REPORT를 이용하시면서 어떤 점이 가장 도움이 되었나요?',
        answer: {
          title: '구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었어요.',
          content:
            '10번 지원하면 10번 다 떨어지던 서류가 이제는 10번 지원하면 N번은 합격하는 서류로 바뀌었어요. 구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었습니다.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 진단',
          job: '프로덕트 디자이너',
          name: '임호정',
        },
      },
      {
        title: 'B기업 합격',
        question: 'Q. 서비스 이용 전, 가장 고민되던 부분은 무엇이었나요?',
        answer: {
          title: '탈락의 이유를 몰라서 답답했어요.',
          content:
            '항상 탈락의 이유를 경험 부족이라고 생각했는데, 이번 진단 리포트를 통해 제가 가진 경험과 역량을 제대로 표현하지 못한 게 문제라는 걸 알게 되었어요.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 피드백',
          job: '백엔드 개발자',
          name: '임호정',
        },
      },
      {
        title: 'A기업 합격',
        question:
          '이력서 피드백 REPORT를 이용하시면서 어떤 점이 가장 도움이 되었나요?',
        answer: {
          title: '구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었어요.',
          content:
            '10번 지원하면 10번 다 떨어지던 서류가 이제는 10번 지원하면 N번은 합격하는 서류로 바뀌었어요. 구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었습니다.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 진단',
          job: '프로덕트 디자이너',
          name: '임호정',
        },
      },
      {
        title: 'B기업 합격',
        question: 'Q. 서비스 이용 전, 가장 고민되던 부분은 무엇이었나요?',
        answer: {
          title: '탈락의 이유를 몰라서 답답했어요.',
          content:
            '항상 탈락의 이유를 경험 부족이라고 생각했는데, 이번 진단 리포트를 통해 제가 가진 경험과 역량을 제대로 표현하지 못한 게 문제라는 걸 알게 되었어요.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 피드백',
          job: '백엔드 개발자',
          name: '임호정',
        },
      },
    ],
  },

  PERSONAL_STATEMENT: {
    interviewList: [
      {
        title: 'A기업 합격',
        question:
          '이력서 피드백 REPORT를 이용하시면서 어떤 점이 가장 도움이 되었나요?',
        answer: {
          title: '구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었어요.',
          content:
            '10번 지원하면 10번 다 떨어지던 서류가 이제는 10번 지원하면 N번은 합격하는 서류로 바뀌었어요. 구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었습니다.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 진단',
          job: '프로덕트 디자이너',
          name: '임호정',
        },
      },
      {
        title: 'B기업 합격',
        question: 'Q. 서비스 이용 전, 가장 고민되던 부분은 무엇이었나요?',
        answer: {
          title: '탈락의 이유를 몰라서 답답했어요.',
          content:
            '항상 탈락의 이유를 경험 부족이라고 생각했는데, 이번 진단 리포트를 통해 제가 가진 경험과 역량을 제대로 표현하지 못한 게 문제라는 걸 알게 되었어요.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 피드백',
          job: '백엔드 개발자',
          name: '임호정',
        },
      },
    ],
  },

  PORTFOLIO: {
    interviewList: [
      {
        title: 'A기업 합격',
        question:
          '이력서 피드백 REPORT를 이용하시면서 어떤 점이 가장 도움이 되었나요?',
        answer: {
          title: '구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었어요.',
          content:
            '10번 지원하면 10번 다 떨어지던 서류가 이제는 10번 지원하면 N번은 합격하는 서류로 바뀌었어요. 구체적인 첨삭 제안과 합격자 예시가 큰 도움이 되었습니다.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 진단',
          job: '프로덕트 디자이너',
          name: '임호정',
        },
      },
      {
        title: 'B기업 합격',
        question: 'Q. 서비스 이용 전, 가장 고민되던 부분은 무엇이었나요?',
        answer: {
          title: '탈락의 이유를 몰라서 답답했어요.',
          content:
            '항상 탈락의 이유를 경험 부족이라고 생각했는데, 이번 진단 리포트를 통해 제가 가진 경험과 역량을 제대로 표현하지 못한 게 문제라는 걸 알게 되었어요.',
        },
        user: {
          img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s',
          reportName: '이력서 피드백',
          job: '백엔드 개발자',
          name: '임호정',
        },
      },
    ],
  },
};
