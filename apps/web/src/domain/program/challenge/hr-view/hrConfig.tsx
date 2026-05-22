import {
  CheckListSectionConfig,
  CurriculumPointsSectionConfig,
  DifferentiatorsSectionConfig,
  FeatureCardConfig,
  IntroFeaturesSectionConfig,
  IntroSectionConfig,
  OverviewSectionConfig,
  ReviewSectionConfig,
} from '@/domain/program/challenge/template-view/types';

export const hrIntroConfig: IntroSectionConfig = {
  backgroundColor: '#FFFAF7',
  primaryColor: '#ff5e00',
  bubbleBackgroundColor: '#FEEFE6',
  bubbleTextColor: '#3D3D3D',
  titleLine1: 'HR/인사 직무,',
  description: (
    <>
      HR 준비가 어려운 이유는 &apos;정답이 없어서&apos;가 아니라,{' '}
      <br className="md:hidden" />
      &apos;정리된 흐름이 없기 때문&apos;입니다.
    </>
  ),
  bubbles: [
    {
      text: (
        <>
          HRD랑 HRM, 차이는 알겠는데
          <br />
          그래서 나는 뭘 준비해야 할까요?
        </>
      ),
      align: 'left',
    },
    {
      text: (
        <>
          채용 공고는 보는데
          <br />내 경험을 어떻게 연결해야 할지 모르겠어요
        </>
      ),
      align: 'right',
    },
    {
      text: (
        <>
          자기소개서랑 포트폴리오는
          <br />꼭 필요한 건지, 어디서부터 시작해야 할지 막막해요
        </>
      ),
      align: 'left',
    },
  ],
  userImageSrc: '/images/hr-user-with-laptop.svg',
};

const HR_FEATURE_CARDS: FeatureCardConfig[] = [
  {
    title: <>HR 직무 구조 이해</>,
    description: (
      <>
        HRM·HRD·채용 등 세부 직무를 <br />
        역할과 업무 기준으로 구조화해 <br />
        이해할 수 있어요.
      </>
    ),
    mobileImg: 'hr-point1-desktop.png',
    desktopImg: 'hr-point1-desktop.png',
    alt: 'point1 이미지',
  },
  {
    title: (
      <>
        채용 공고 기반 <br />
        나만의 스토리 정리
      </>
    ),
    description: (
      <>
        채용 공고를 기준으로 <br />
        내 경험을 HR이 원하는 역량 스토리로 <br />
        재정리해요.
      </>
    ),
    mobileImg: 'hr-point2-desktop.png',
    desktopImg: 'hr-point2-desktop.png',
    alt: 'point2 이미지',
  },
  {
    title: (
      <>
        자기소개서 & 포트폴리오 <br />
        결과물 완성
      </>
    ),
    description: (
      <>
        미션과 피드백을 통해 <br />
        지원에 바로 활용 가능한 결과물을 <br />
        완성해요.
      </>
    ),
    mobileImg: 'hr-point3-desktop.png',
    desktopImg: 'hr-point3-desktop.png',
    alt: 'point3 이미지',
  },
];

export const hrIntroFeaturesConfig: IntroFeaturesSectionConfig = {
  getTitle: (weekText) => (
    <>
      <div>
        <span style={{ color: '#FF5E00' }}>{weekText} 만에</span>{' '}
        <span>HR 직무 이해부터</span>
      </div>
      <div>
        <span>자기소개서·포트폴리오까지 완성해요!</span>
      </div>
    </>
  ),
  description: (
    <>
      막연한 HR 관심에서 끝나지 않도록, <br className="md:hidden" /> 직무
      탐색부터 경험 정리, 결과물 완성까지 함께합니다.
    </>
  ),
  cards: HR_FEATURE_CARDS,
  primaryColor: '#FF5E00',
  cardGradient: 'linear-gradient(180deg, #FEF4EF 0%, #FEE6D8 100%)',
};

export const hrCheckListConfig: CheckListSectionConfig = {
  items: [
    {
      title: ['HR 직무에 관심은 있지만,', '실제로 어떤 일을 하는지 몰라요'],
      content: [
        ['HR 직무가 궁금하지만 HRD, HRM 차이가 헷갈리는 분'],
        ['HR 직무를 "막연히 좋다"고만 생각해왔던 분'],
      ],
    },
    {
      title: [
        '채용 공고는 보고 있지만',
        '내 경험을 어떻게 풀어야 할지 막막해요',
      ],
      content: [
        ['체계적으로 기초적인 뼈대부터 잡아가며 완성하고 싶은 분'],
        ['채용 공고를 봐도 내 경험을 어떻게 연결해야 할지 모르는 분'],
        ['HR에서 원하는 역량이 무엇인지 감이 안오시는 분'],
      ],
    },
    {
      title: [
        '포트폴리오를 시작은 하지만 늘 미완성으로',
        '끝나거나, 이게 맞는 방향인지 확신이 없어요',
      ],
      content: [
        ['혼자 하려고 하니 집중도 잘 안되고, 포폴 완성까지 하기 힘든 분'],
        ['실제 합격 포트폴리오 예시를 보고 제작에 참고하고 싶은 분'],
      ],
    },
  ],
  boxBackgroundColor: '#FEEEE5',
  badgeBackgroundColor: '#FF5E00',
  checkboxColor: '#FF5E00',
};

export const hrCurriculumPointsConfig: CurriculumPointsSectionConfig = {
  getTitle: (weekText) => (
    <>
      <span>누적 5,000건 이상의 피드백,</span>
      <span>100+회 챌린지 운영 노하우를 집약해</span>
      <div>
        <span style={{ color: '#FF5E00' }}>단 {weekText} 만에 끝내는 </span>
        <br className="md:hidden" />
        <span>실전형 커리큘럼을 설계했습니다.</span>
      </div>
    </>
  ),
  getCurriculumCards: (lectureCount) => [
    {
      title: 'HR 실무 역량 Class',
      description: (
        <>
          HR 직무에서 수행해야 하는 사전 과제,
          <br />
          HR 관련 뉴스기사, 아티클 등 수집하는
          <br />
          스터디까지 지원해드려요
        </>
      ),
    },
    {
      title: '현직자의 LIVE 세미나',
      description: (
        <>
          {lectureCount}명의 HR 현직자 선배들이
          <br />
          어떻게 HR 커리어를 시작했는지,
          <br />그 이야기를 직접 들려드릴게요
        </>
      ),
    },
    {
      title: '챌린지를 통한 서류 완성',
      description: (
        <>
          채용 공고에 바로 지원이 가능하도록,
          <br />
          수준급의 서류를 무조건 완성해요
        </>
      ),
    },
  ],
  primaryColor: '#FF5E00',
};

export const hrDifferentiatorsConfig: DifferentiatorsSectionConfig = {
  subtitle: 'HR/인사 직무 챌린지, 왜 다를까요?',
  title: (
    <>
      <span>단순한 정보 전달이 아닌,</span>
      <span>
        지원 가능한 상태까지 <br className="md:hidden" />
        만드는 구조로 설계했습니다.
      </span>
    </>
  ),
  differentiators: [
    {
      number: '01',
      title: 'HR 직무를 아는 수준에서 설명할 수 있는 수준으로',
      before: [
        { text: 'HRM과 HRD의 차이를 명확히 구분하기 어렵다' },
        { text: '조직 내 HR 직무가 어떤 역할을 하는지 모호하다' },
        { text: '"HR은 무슨 일을 하나요?"라는 질문에 답변이 막힌다' },
      ],
      after: [
        { text: 'HR의 세부 직무를 구조적으로 정리할 수 있다' },
        { text: '각 직무의 역할과 책임을 명확히 이해한다' },
        { text: 'HR 직무를 본인만의 언어로 설명할 수 있다' },
      ],
    },
    {
      number: '02',
      title: 'HR 트렌드를 정보가 아닌 성장 방향으로 연결',
      before: [
        { text: '최신 HR 트렌드를 단편적인 정보로만 알고 있다' },
        { text: '현재 시장이 요구하는 HR의 핵심 역량을 모른다' },
        { text: '앞으로 어떤 커리어를 쌓아야 할지 막연하다' },
      ],
      after: [
        { text: '트렌드와 실제 HR 과제를 연결하여 이해한다' },
        { text: '조직이 기대하는 HR의 역할을 구체적으로 인식한다' },
        { text: '나만의 성장 방향과 커리어 로드맵을 그릴 수 있다' },
      ],
    },
    {
      number: '03',
      title: '채용 공고를 기준으로 설계된 실전 구조',
      before: [
        { text: 'HR 관련 경험을 직무 역량으로 풀어내기 어렵다' },
        { text: '서류나 면접에서 직무에 대한 진심을 보여주기 힘들다' },
        { text: '내 경험과 공고를 연결하지 못한다' },
      ],
      after: [
        { text: 'HR 탐색 및 아카이빙을 통한 실무 데이터가 쌓인다' },
        { text: '자소서와 포트폴리오에 구체적인 방향성을 담아낸다' },
        { text: '지원 시 설득력 있는 스토리 구성 할 수 있다' },
      ],
    },
  ],
  primaryColor: '#FF5E00',
  activeBoxBgColor: '#FEEEE5',
};

export const hrReviewConfig: ReviewSectionConfig = {
  reviewLinkQuery: { program: 'challenge_review', challenge: 'hr' },
  starBadgeBgColor: '#FEEEE5',
  starColor: '#FF5E00',
  bubbleBgColor: '#FF9B61',
  buttonBgColor: '#F55A00',
};

export const hrOverviewConfig: OverviewSectionConfig = {
  backgroundColor: '#290F00',
  stepBadgeBackgroundColor: '#FFBD96',
  titleBadgeColor: '#FF5E00',
  getTitle: (weekText) => `${weekText} 여정 한 번에 보기`,
};
