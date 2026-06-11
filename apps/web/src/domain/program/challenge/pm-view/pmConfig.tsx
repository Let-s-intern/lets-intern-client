import {
  CalendarItemConfig,
  CheckListSectionConfig,
  CurriculumPointsSectionConfig,
  CurriculumSectionConfig,
  DifferentiatorsSectionConfig,
  FeatureCardConfig,
  IntroFeaturesSectionConfig,
  IntroSectionConfig,
  OverviewSectionConfig,
  ReviewSectionConfig,
} from '@/domain/program/challenge/template-view/types';

const PM_THEME = {
  primary: '#1BC47D',
  lightAccent: '#D1F3E5',
  morelightAccent: '#E8F9F2',
};

export const pmIntroConfig: IntroSectionConfig = {
  primaryColor: PM_THEME.primary,
  lightAccentColor: PM_THEME.primary,
  backgroundColor: PM_THEME.morelightAccent,
  isTextWhite: true,
  titleLine1: 'PM/PO 직무,',
  description: (
    <>
      PM 준비가 어려운 이유는 &apos;정답이 없어서&apos;가 아니라,{' '}
      <br className="md:hidden" />
      &apos;정리된 흐름이 없기 때문&apos;입니다.
    </>
  ),
  bubbles: [
    {
      text: (
        <>
          PM, PO, 서비스기획자,
          <br />다 다른 직무인건가요? 같은 직무인가요?
        </>
      ),
      align: 'left',
    },
    {
      text: (
        <>
          대기업, AI기업, IT기업, 스타트업 각각에서
          <br />
          신입 PM은 어떤 일을 하나요?
        </>
      ),
      align: 'right',
    },
    {
      text: (
        <>
          PM/서비스기획 직무에 필수라는 포트폴리오, <br />
          어떻게 만드는 것이 베스트일까요?
        </>
      ),
      align: 'left',
    },
  ],
};

const PM_FEATURE_CARDS: FeatureCardConfig[] = [
  {
    title: <>PM 직무 구조 이해</>,
    description: (
      <>
        대기업, 스타트업, IT기업 등 <br />
        산업/기업별 PM 직무의 특성을 <br />
        이해하며 직무를 탐색해요.
      </>
    ),
    bgImg: 'pm-point1-desktop.png',
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
        내 경험을 PM 직무에서 <br />
        원하는 역량 스토리로 재정리해요.
      </>
    ),
    bgImg: 'pm-point2-desktop.png',
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
        탄탄한 학습 자료, LIVE 세미나, <br />
        템플릿과 피드백을 통해 <br />
        바로 제출할 수 있는 서류를 만들어요.
      </>
    ),
    bgImg: 'pm-point3-desktop.png',
    alt: 'point3 이미지',
  },
];

export const pmIntroFeaturesConfig: IntroFeaturesSectionConfig = {
  primaryColor: PM_THEME.primary,
  getTitle: (weekText) => (
    <>
      <div>
        <span style={{ color: PM_THEME.primary }}>{weekText} 만에</span>{' '}
        <span className="hidden md:inline">Product Manager</span>
        <span className="md:hidden">PM</span>
        <span> 직무 이해부터</span>
      </div>
      <div>
        <span>자기소개서·포트폴리오까지 완성해요!</span>
      </div>
    </>
  ),
  description: (
    <>
      PM 사이드 프로젝트 경험 만드는 방법 배우고, <br />
      직무 탐색, 회사 탐색, 그리고 서류 완성까지 함께 해요.
    </>
  ),
  cards: PM_FEATURE_CARDS,
  cardGradient: 'linear-gradient(180deg, #EAF9F3 0%, #D0F0E4 100%)',
};

export const pmCheckListConfig: CheckListSectionConfig = {
  primaryColor: PM_THEME.primary,
  lightAccentColor: PM_THEME.lightAccent,
  backgroundColor: '#F4F9F7',
  items: [
    {
      title: ['PM 직무에 관심은 있지만,', '실제로 어떤 일을 하는지 몰라요'],
      content: [
        ['PM 직무가 궁금하지만 PO·서비스기획자와의 차이가 헷갈리는 분'],
        ['PM 직무를 ‘막연히 좋아 보인다’고만 생각해왔던 분'],
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
        ['PM에서 원하는 역량이 무엇인지 감이 안오시는 분'],
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
};

export const pmCurriculumPointsConfig: CurriculumPointsSectionConfig = {
  primaryColor: PM_THEME.primary,
  getTitle: (weekText) => (
    <>
      <span>렛츠커리어의 합격 노하우와</span>
      <span>100+회 챌린지 운영 경력을 집약해</span>
      <div>
        <span style={{ color: PM_THEME.primary }}>
          단 {weekText} 만에 끝내는{' '}
        </span>
        <br className="md:hidden" />
        <span>실전형 커리큘럼을 설계했습니다.</span>
      </div>
    </>
  ),
};

export const pmDifferentiatorsConfig: DifferentiatorsSectionConfig = {
  primaryColor: PM_THEME.primary,
  lightAccentColor: PM_THEME.morelightAccent,
  subtitle: 'PM/서비스 기획 직무 챌린지, 왜 다를까요?',
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
      title: 'PM 직무를 아는 수준에서 설명할 수 있는 수준으로',
      before: [
        { text: 'PM·PO·서비스기획자의 차이가 헷갈린다' },
        { text: 'PM이 실제로 어떤 일을 하는지 모르겠다' },
        { text: '“PM은 무슨 일을 하나요?”라는 질문에 답하기 막막하다' },
      ],
      after: [
        { text: 'PM의 세부 역할과 업무 구조를 설명할 수 있다' },
        { text: '실제 서비스 회사 PM의 업무 흐름을 이해한다' },
        { text: 'PM 직무를 본인만의 언어로 설명할 수 있다' },
      ],
    },
    {
      number: '02',
      title: 'PM 트렌드를 정보가 아닌 성장 방향으로 연결',
      before: [
        { text: '최신 PM 트렌드를 단편적인 정보로만 알고 있다' },
        { text: '현재 시장이 요구하는 PM 역량을 모른다' },
        { text: '앞으로 어떤 경험을 쌓아야 할지 막막하다' },
      ],
      after: [
        { text: '실제 PM 채용 기준과 트렌드를 이해한다' },
        { text: '서비스 기업이 원하는 PM 역량을 구체적으로 인식한다' },
        { text: '나만의 성장 방향과 커리어 로드맵을 그릴 수 있다' },
      ],
    },
    {
      number: '03',
      title: '채용 공고를 기준으로 설계된 실전 구조',
      before: [
        { text: 'PM 관련 경험을 직무 역량으로 풀어내기 어렵다' },
        { text: '포트폴리오에서 PM다운 관점을 보여주기 힘들다' },
        { text: '내 경험과 공고를 연결하지 못한다' },
      ],
      after: [
        { text: '문제 정의·가설·해결 과정을 구조적으로 정리할 수 있다' },
        { text: '포트폴리오에 데이터·유저 관점을 담아낼 수 있다' },
        { text: '지원 시 설득력 있는 PM 포트폴리오를 만들 수 있다' },
      ],
    },
  ],
};

export const pmReviewConfig: ReviewSectionConfig = {
  primaryColor: PM_THEME.primary,
  lightAccentColor: PM_THEME.lightAccent,
  bubbleBgColor: '#009C89',
  buttonBgColor: PM_THEME.primary,
};

export const pmOverviewConfig: OverviewSectionConfig = {
  primaryColor: PM_THEME.primary,
  backgroundColor: '#0E2E21',
  stepBadgeBackgroundColor: '#A4E7CB',
};

const PM_CALENDAR_ITEMS = (lectureCount: number): CalendarItemConfig[] => [
  {
    number: 1,
    title: '합격 콘텐츠 & 미션 6회차',
    description: (
      <div className="leading-[20px] md:leading-[22px]">
        챌린지 대시보드를 통해 PM 서류 작성 콘텐츠를 <br />
        확인 후 회차별 미션을 제출합니다.
      </div>
    ),
  },
  {
    number: 2,
    title: `현직자 LIVE 세미나 ${lectureCount}회`,
    description: (
      <div className="leading-[20px] md:leading-[22px]">
        스타트업부터 카카오, 현대차 대기업까지 <br />
        다양한 분야의 <strong>PM 현직자의 이야기</strong>를 들어요.
      </div>
    ),
  },
  {
    number: 3,
    title: 'PM 현직자 1:1 멘토링',
    description: (
      <div className="leading-[20px] md:leading-[22px]">
        미션으로 완성한 자소서·포트폴리오를 기반으로, <br />
        나의 상황에 맞는 현직자 멘토와의 1:1 멘토링으로
        <br />
        최종 서류를 완성해요.
      </div>
    ),
  },
];

export const pmCurriculumSectionConfig: CurriculumSectionConfig = {
  primaryColor: PM_THEME.primary,
  lightAccentColor: PM_THEME.morelightAccent,
  getTitle: (lectureCount, weekText) => (
    <>
      <span>
        6회의 미션 <br className="md:hidden" />+ 현직자 LIVE 세미나{' '}
        {lectureCount}회와 함께
      </span>
      <span>만드는 밀도 있는 {weekText}간의 여정</span>
    </>
  ),
  description: (
    <>
      막연한 PM 관심에서 끝나지 않도록, 직무 탐색부터 경험 정리, 결과물 완성까지
      함께합니다.
    </>
  ),
  getCalendarItems: PM_CALENDAR_ITEMS,
  bonusItems: [
    {
      description: (
        <>
          현직자 상주 커뮤니티에 참여하여
          <br />
          상시 질의응답을 진행합니다.
        </>
      ),
    },
  ],
};
