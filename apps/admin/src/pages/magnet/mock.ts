// TODO: API 준비 후 React Query 훅으로 교체
import { MANAGEABLE_MAGNET_TYPES, MagnetListItem } from './types';

const MOCK_MAGNETS: MagnetListItem[] = [
  {
    magnetId: 5,
    type: 'MATERIAL',
    programType: null,
    challengeType: null,
    title: 'HR 직무 자료집',
    startDate: '2026-01-15T00:00:00',
    endDate: '2026-06-30T23:59:59',
    isVisible: false,
    applicationCount: 9,
  },
  {
    magnetId: 4,
    type: 'VOD',
    programType: null,
    challengeType: null,
    title: '취준생이 모르면 안되는 AI 역량 VOD',
    startDate: '2026-01-10T00:00:00',
    endDate: '2026-07-31T23:59:59',
    isVisible: true,
    applicationCount: 99,
  },
  {
    magnetId: 3,
    type: 'FREE_TEMPLATE',
    programType: null,
    challengeType: null,
    title: '자유양식 이력서 템플릿',
    startDate: '2026-01-05T00:00:00',
    endDate: '2026-12-31T23:59:59',
    isVisible: true,
    applicationCount: 999,
  },
  {
    magnetId: 2,
    type: 'LAUNCH_ALERT',
    programType: null,
    challengeType: null,
    title: '리틀리 프로그램',
    startDate: null,
    endDate: null,
    isVisible: false,
    applicationCount: 0,
  },
  {
    magnetId: 1,
    type: 'EVENT',
    programType: null,
    challengeType: null,
    title: '리틀리 프로그램',
    startDate: null,
    endDate: null,
    isVisible: false,
    applicationCount: 0,
  },
];

export function fetchManageableMagnets(): MagnetListItem[] {
  return MOCK_MAGNETS.filter((m) => MANAGEABLE_MAGNET_TYPES.includes(m.type));
}
