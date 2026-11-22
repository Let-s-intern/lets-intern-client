import { Dayjs } from 'dayjs';

export const DEMO_USER_NAME = '렛츠커리어';

/** 체험에서 열어 둔 회차. 나머지는 모두 잠근다. */
export const DEMO_OPEN_MISSION_TH = 0;

export interface DemoSchedule {
  th: number;
  title: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

// 0회차(OT)는 오늘부터 사흘 동안 열려 있고, 1회차는 그다음 날부터 하루씩 열린다.
const ZERO_MISSION_DAYS = 3;

// 인덱스가 곧 회차다.
const MISSION_TITLES = [
  'OT 시청 및 목표 작성',
  '나의 경험 리스트업',
  '경험 상세 정리',
  '직무 탐색',
  '공고 분석',
  '나만의 강점 찾기',
  '이력서 초안 작성',
  '이력서 피드백 반영',
  '자기소개서 문항 분석',
  '자기소개서 초안 작성',
  '최종 점검',
];

/** 오늘 0회차가 열린 것처럼 0~10회차 일정을 만든다 */
export const buildDemoSchedules = (today: Dayjs): DemoSchedule[] => {
  const dayStart = today.startOf('day');

  return MISSION_TITLES.map((title, th) => {
    const startDay = th === 0 ? 0 : ZERO_MISSION_DAYS + th - 1;
    const lastDay = th === 0 ? ZERO_MISSION_DAYS - 1 : startDay;
    return {
      th,
      title,
      startDate: dayStart.add(startDay, 'day'),
      endDate: dayStart.add(lastDay, 'day').endOf('day'),
    };
  });
};

export const DEMO_GUIDES = [
  { id: 1, title: '대시보드 이용 가이드' },
  { id: 2, title: '미션 제출 가이드' },
  { id: 3, title: '수료증 발급 안내' },
];

export const DEMO_SCORE = { current: 0, total: 100 };

export const DEMO_ZERO_MISSION = {
  description:
    '환영합니다!\n챌린지가 시작하기 전에, 전체적인 챌린지 흐름과 일정, 미션 제출 방법 등을 미리 알아보는 시간이에요.\n\n이번 0회차에서는 OT 영상을 보고, 챌린지 참여 목표를 적어 주세요.',
  guide:
    '0회차는 앞으로의 챌린지를 어렵지 않게 시작하기 위한 준비 운동이에요.\nOT 자료를 확인하고, 챌린지를 통해 이루고 싶은 목표를 자유롭게 정리해 봅시다.',
  materials: [
    { label: '미션 템플릿', name: '0회차 미션 템플릿' },
    { label: '필수 콘텐츠', name: '챌린지 OT 자료' },
    { label: '추가 콘텐츠', name: '선배들의 챌린지 목표 예시' },
  ],
};

/**
 * 대시보드 위에 순서대로 띄우는 안내. 화면 위에서 아래 순서를 따른다.
 * 0 메뉴, 1 미션 제목·마감, 2 미션 수행하기, 3 점수, 4 수료증 발급, 5 챌린지 가이드, 6 일정
 */
export const DEMO_TIPS = [
  '여기서 대시보드와 나의 미션\n화면을 오갈 수 있어요.',
  '지금 열려 있는 회차와\n마감기한이에요.',
  '오늘 열린 미션이에요.\n미션 수행하기를 눌러 0회차를 직접 해 보세요.',
  '미션을 낼 때마다 점수가 쌓여요.',
  '80점 이상이면 챌린지가 끝난 뒤\n수료증을 받을 수 있어요.',
  '대시보드 이용법과 미션 제출\n방법을 가이드로 볼 수 있어요.',
  '회차별 일정과 제출 현황을\n한눈에 볼 수 있어요.\n0회차 카드를 눌러도 미션으로 가요.',
];

/** 나의 미션 화면 안내. 0 회차 달력, 1 미션 설명·가이드, 2 OT 영상, 3 제출 */
export const DEMO_MISSION_TIPS = [
  '회차 카드를 누르면 그날의 미션으로\n이동해요. 지금은 0회차만 열려 있어요.',
  '미션 설명과 가이드, 자료를\n여기서 확인해요.',
  'OT 영상을 보고 챌린지 흐름을\n미리 알아 가요.',
  '미션을 마치면 여기서 제출해요.\n제출하면 점수가 쌓여요.',
];
