import {
  LETSCON_FREEZZOA_INSTAGRAM_URL,
  LETSCON_PARK_INSTAGRAM_URL,
} from './links';

export const LINEUP_TOPICS = [
  {
    title: '멘토의 커리어 여정과 Connecting the Dots',
    description:
      '직무를 선택한 계기, 취준 과정의 시행착오, 과거 경험이 지금 커리어로 이어진 방식',
  },
  {
    title: '원하는 결과를 만들기까지',
    description:
      '가장 중요했던 선택, 원하는 결과를 얻지 못했을 때 방향을 다시 잡은 방법, 실제 합격으로 이어진 전략',
  },
  {
    title: '후배들에게',
    description:
      '2027년 상반기를 준비하는 사람이 지금부터 하면 좋을 것, 직무별로 갖추면 좋은 역량과 경험',
  },
];

export type LineupBlockTone = 'primary' | 'deep' | 'dark';

export interface LineupBlock {
  title: string;
  minutes: number;
  description: string;
  tone: LineupBlockTone;
}

export interface LineupSession {
  label: string;
  track: string;
  offline: boolean;
  time: string;
  /** 미정이면 비워 둔다. 줄바꿈은 \n */
  title?: string;
  speaker: string;
  /** 미정이면 비워 둔다. \n 은 모바일 줄바꿈이다 */
  profile?: string;
  instagramUrl?: string;
  /** 없으면 실루엣을 그린다 */
  photo?: { src: string; width: number; height: number };
}

export interface LineupDay {
  label: string;
  schedule: string;
  blocks: LineupBlock[];
  sessions: LineupSession[];
}

const MAIN_TALK_DESCRIPTION = '멘토의 커리어 여정과 Connecting the Dots';

export const LINEUP_DAYS: LineupDay[] = [
  {
    label: 'Day 1',
    schedule: '11/14(토) 온라인',
    blocks: [
      {
        title: '본강의',
        minutes: 60,
        description: MAIN_TALK_DESCRIPTION,
        tone: 'primary',
      },
      {
        title: 'QNA',
        minutes: 30,
        description: '온라인 실시간 질문',
        tone: 'dark',
      },
    ],
    sessions: [
      {
        label: 'Session 1',
        track: '서비스 기획 / PM',
        offline: false,
        time: '19:00 - 20:30',
        title: '신입 PM은 안 뽑는다?\n결국 원하는 회사에 합격하는 방법',
        speaker: '헤이즐 멘토',
        profile: '9년차 · 전) 배달의민족 PM ·\n현) 국내 대표 핀테크 기업 PO',
        photo: { src: '/letscon/hazel.png', width: 249, height: 369 },
      },
      {
        label: 'Session 2',
        track: 'HR',
        offline: false,
        time: '20:40 - 22:10',
        speaker: '연사 공개 예정',
      },
    ],
  },
  {
    label: 'Day 2',
    schedule: '11/15(일) 오프라인 + 온라인',
    blocks: [
      {
        title: '본강의',
        minutes: 50,
        description: MAIN_TALK_DESCRIPTION,
        tone: 'primary',
      },
      {
        title: '무료 서류 Live 피드백',
        minutes: 40,
        description: '사전 제출 서류 중 선정작 공개 피드백',
        tone: 'deep',
      },
      {
        title: 'QNA',
        minutes: 20,
        description: '현장 질문 우선',
        tone: 'dark',
      },
    ],
    sessions: [
      {
        label: 'Session 1',
        track: '마케팅',
        offline: true,
        time: '14:30 - 16:30',
        title: '가고 싶은 회사의 마케터가 되기 위해,\n소중한 경험을 하나씩 쌓아온 이야기',
        speaker: '팀장 박주삼 멘토',
        profile: '13년차 · 전) 올리브영, 에이블리,\n지그재그 · 현) 뷰티 브랜드',
        instagramUrl: LETSCON_PARK_INSTAGRAM_URL,
        photo: { src: '/letscon/park.svg', width: 270, height: 363 },
      },
      {
        label: 'Session 2',
        track: '대기업 면접관 관점',
        offline: true,
        time: '16:45 - 18:45',
        title: '면접관이 뽑고 싶은\n인턴/신입은 누구인가',
        speaker: '프리쪼아 멘토',
        profile: '11년차 · 창업, 스타트업,\n대기업 모두 거친 6년차 면접관',
        instagramUrl: LETSCON_FREEZZOA_INSTAGRAM_URL,
        photo: { src: '/letscon/freezzoa.png', width: 270, height: 363 },
      },
    ],
  },
];
