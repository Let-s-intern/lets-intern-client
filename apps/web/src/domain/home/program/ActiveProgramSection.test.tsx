import { render } from '@testing-library/react';

import ActiveProgramSection from './ActiveProgramSection';

const mockPrograms = jest.fn();
const mockContainer = jest.fn();

// 실제 모듈은 api 패키지까지 끌고 와 jest 에서 import.meta 로 깨진다
jest.mock('../banner/MainCurationSection', () => ({
  getProgramUrl: ({ programId }: { programId: number }) =>
    `/program/challenge/${programId}`,
  getDuration: () => '',
  getBadgeText: () => '',
}));

jest.mock('@/api/program', () => ({
  useGetUserProgramQuery: () => ({ data: { programList: mockPrograms() } }),
}));

jest.mock('./ProgramContainer', () => ({
  __esModule: true,
  default: (props: { programs: { url: string }[] }) => {
    mockContainer(props);
    return null;
  },
}));

const program = (challengeVersionId: number | null, title: string) => ({
  programInfo: {
    id: 10,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    title,
    thumbnail: '',
    deadline: '2026-10-10T00:00:00',
    startDate: '2026-10-11T00:00:00',
    endDate: '2026-10-30T00:00:00',
    challengeVersionId,
  },
  classificationList: [],
});

describe('ActiveProgramSection', () => {
  it('같은 챌린지의 버전 카드는 각 버전 상세 링크를 갖는다', () => {
    mockPrograms.mockReturnValue([
      program(1, '무경력자 챌린지'),
      program(2, '경력자 챌린지'),
      program(null, '버전 없는 챌린지'),
    ]);

    render(<ActiveProgramSection />);

    const urls = mockContainer.mock.calls[0][0].programs.map(
      (p: { url: string }) => p.url,
    );
    expect(urls).toEqual([
      `/program/challenge/10/${encodeURIComponent('무경력자-챌린지')}?version=1`,
      `/program/challenge/10/${encodeURIComponent('경력자-챌린지')}?version=2`,
      '/program/challenge/10',
    ]);
  });
});
