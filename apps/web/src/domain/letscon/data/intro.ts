export const EMPATHY_WORRIES = [
  '서류를 계속 떨어지니까 취준하기가 싫어요.',
  '이번 공채도 떨어졌는데, 이제 뭘 해야 할지 모르겠어요.',
  '다음 상반기 공채까지 뭘 준비해야 할까요?',
  '경험이 부족한 것 같은데, 지금부터 뭘 할 수 있을까요?',
  '대기업에 가고 싶은데, 중견기업이나 스타트업에도 지원해야 할까요?',
];

interface IntroTextPart {
  text: string;
  strong?: boolean;
}

export const INTRO_PARAGRAPHS: IntroTextPart[][] = [
  [
    { text: '이번 렛츠콘에서는 ' },
    {
      text: '마케팅·HR·기획(PM) 직무 멘토님들과 대기업 면접관 출신 멘토님을 모시고,',
      strong: true,
    },
    {
      text: ' 작은 경험들을 합격으로 연결한 이야기, 현직자가 바라보는 신입 채용 이야기까지 나눠보려고 합니다.',
    },
  ],
  [
    {
      text: '가고 싶은 대기업은 계속 목표로 두세요. 그 사이 도전하는 중견기업·스타트업·인턴 채용도 다음 기회를 위한 경험이 될 수 있어요. ',
    },
    {
      text: '렛츠콘에서 선배들의 경험을 듣고, 나의 다음 행동을 찾아보세요.',
      strong: true,
    },
  ],
];

export type IntroStoryIcon = 'puzzle' | 'sweat' | 'rocket' | 'gem' | 'calendar';

export const INTRO_STORIES: { icon: IntroStoryIcon; text: string }[] = [
  {
    icon: 'puzzle',
    text: '원하는 커리어로 시작하기 위해 어떤 경험과 노력을 쌓았는지',
  },
  { icon: 'sweat', text: '취준을 포기하고 싶었던 순간은 언제였는지' },
  {
    icon: 'rocket',
    text: '중견기업·스타트업·인턴 경험이 이후 취업에 어떻게 도움이 되었는지',
  },
  {
    icon: 'gem',
    text: '당시에는 의미 없어 보였지만 결국 합격으로 이어진 경험은 무엇이었는지',
  },
  {
    icon: 'calendar',
    text: '지금 취준생이라면, 남은 2026년을 어떻게 보낼 것인지',
  },
];
