/**
 * 캘린더 미리보기용 데모 챌린지 mock.
 *
 * 실제 운영에서는 노출 처리된 챌린지가 백엔드에서 자동 반영되지만, 현재는 백엔드가
 * 없어 미리보기에서 막대(기간)를 보여주기 위한 고정 날짜 데모 데이터를 둔다.
 * 기간이 서로 겹치도록 배치해 레인(막대 줄 나눔)이 동작하는지 확인할 수 있다.
 */
import { ChallengeType } from '@/schema';

export interface CalendarChallengeFixture {
  id: string;
  title: string;
  challengeType: ChallengeType; // 타입별 막대 색상에 사용
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export const calendarChallengeFixtures: CalendarChallengeFixture[] = [
  {
    id: 'ch-1',
    title: '기필코 경험정리 챌린지 7기',
    challengeType: 'EXPERIENCE_SUMMARY',
    startDate: '2026-09-01',
    endDate: '2026-09-14',
  },
  {
    id: 'ch-2',
    title: '포트폴리오 완성 챌린지 3기',
    challengeType: 'PORTFOLIO',
    startDate: '2026-08-25',
    endDate: '2026-09-07',
  },
  {
    id: 'ch-3',
    title: '대기업 자소서 챌린지 12기',
    challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
    startDate: '2026-09-08',
    endDate: '2026-09-28',
  },
  {
    id: 'ch-4',
    title: '면접 마스터 챌린지 5기',
    challengeType: 'MEETING_PREPARATION',
    startDate: '2026-09-15',
    endDate: '2026-10-05',
  },
  {
    id: 'ch-5',
    title: '직무 탐색 2주 챌린지',
    challengeType: 'CAREER_START',
    startDate: '2026-09-21',
    endDate: '2026-10-02',
  },
];
