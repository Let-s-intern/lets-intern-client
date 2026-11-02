import {
  LETSCON_FREEZZOA_INSTAGRAM_URL,
  LETSCON_PARK_INSTAGRAM_URL,
} from './links';

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
  /** \n 은 데스크톱 줄바꿈이다 */
  title: string;
  speaker: string;
  profile: string;
  instagramUrl?: string;
  photo: { src: string; width: number; height: number };
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
        track: 'HR',
        offline: false,
        time: '16:00 - 17:30',
        title: '심리학 전공자가 1년 만에\n현대자동차 채용 직무에 합격하기까지',
        speaker: '덕양 멘토',
        profile:
          '6년차 · 전) 카카오 계열사 · 당근 · 현대자동차 근무 · 현) 국내 IT 예비유니콘 채용 담당자',
        photo: { src: '/letscon/mentor-deokyang.png', width: 303, height: 450 },
      },
      {
        label: 'Session 2',
        track: '서비스 기획 / PM',
        offline: false,
        time: '19:00 - 20:30',
        title: '신입 PM은 안 뽑는다?\n결국 원하는 회사에 합격하는 방법',
        speaker: '헤이즐 멘토',
        profile: '9년차 · 전) 배달의민족 PM · 현) 국내 대표 핀테크 기업 PO',
        photo: { src: '/letscon/mentor-hazel.png', width: 226, height: 450 },
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
        title: '꿈꾸던 마케터가 되기 위해\n하나씩 쌓아온 경험의 이야기',
        speaker: '팀장 박주삼 멘토',
        profile: '13년차 · 전) 올리브영, 에이블리, 지그재그 · 현) 뷰티 브랜드',
        instagramUrl: LETSCON_PARK_INSTAGRAM_URL,
        photo: { src: '/letscon/mentor-park.png', width: 306, height: 450 },
      },
      {
        label: 'Session 2',
        track: '대기업 면접관 관점',
        offline: true,
        time: '16:45 - 18:45',
        title: '면접관이 뽑고 싶은\n인턴/신입은 누구인가',
        speaker: '프리쪼아 멘토',
        profile: '11년차 · 창업, 스타트업, 대기업 모두 거친 6년차 면접관',
        instagramUrl: LETSCON_FREEZZOA_INSTAGRAM_URL,
        photo: { src: '/letscon/mentor-freezzoa.png', width: 360, height: 450 },
      },
    ],
  },
];
