import { render, screen, within } from '@testing-library/react';

import type { MentorProgramListItem } from '@/api/mentor/mentorSchema';

import MentorProgramSection from './MentorProgramSection';

// 실제 컨테이너는 swiper 를 써서 jest 가 파싱하지 못한다. 카드만 그대로 그린다
jest.mock('./MentorProgramContainer', () => {
  const MentorProgramItem = jest.requireActual('../ui/MentorProgramItem')
    .default as typeof import('../ui/MentorProgramItem').default;
  return {
    __esModule: true,
    default: ({
      title,
      programs,
    }: {
      title: string;
      programs: import('../ui/MentorProgramItem').MentorProgramItemProps[];
    }) => (
      <section aria-label={title}>
        {programs.map((program) => (
          <MentorProgramItem key={program.url} {...program} />
        ))}
      </section>
    ),
  };
});

const program = (
  overrides: Partial<MentorProgramListItem>,
): MentorProgramListItem => ({
  programType: 'CHALLENGE',
  programId: 1,
  title: '챌린지',
  thumbnail: null,
  startDate: '2026-10-01T00:00:00',
  endDate: '2026-10-31T00:00:00',
  beginning: '2026-09-01T00:00:00',
  deadline: '2026-10-25T00:00:00',
  ...overrides,
});

const renderSection = (
  proceedingProgramList: MentorProgramListItem[],
  postProgramList: MentorProgramListItem[] = [],
) =>
  render(
    <MentorProgramSection
      proceedingProgramList={proceedingProgramList}
      postProgramList={postProgramList}
    />,
  );

describe('MentorProgramSection 세미나·VOD (LC-3503)', () => {
  it('LIVE 카드는 /program/live 로 가고 LIVE 라벨과 진행기간을 단다', () => {
    renderSection([
      program({ programType: 'LIVE', programId: 11, title: '세미나' }),
    ]);
    const card = screen.getByRole('link', { name: /세미나/ });
    expect(card).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/program\/live\/11\//),
    );
    expect(within(card).getByText('LIVE')).toBeInTheDocument();
    expect(within(card).getByText('진행기간')).toBeInTheDocument();
  });

  it('VOD 카드는 /program/vod 로 가고, 기간이 없어 진행기간 대신 「상시」 를 단다', () => {
    renderSection([
      program({
        programType: 'VOD',
        programId: 21,
        title: '강의',
        startDate: null,
        endDate: null,
        beginning: null,
        deadline: null,
      }),
    ]);
    const card = screen.getByRole('link', { name: /강의/ });
    expect(card).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/program\/vod\/21\//),
    );
    expect(within(card).getByText('VOD')).toBeInTheDocument();
    expect(within(card).getByText('상시')).toBeInTheDocument();
    expect(within(card).queryByText('진행기간')).not.toBeInTheDocument();
  });

  it('챌린지는 지금처럼 라벨 없이 모집 마감을 단다', () => {
    renderSection([program({})]);
    const card = screen.getByRole('link', { name: /챌린지/ });
    expect(within(card).queryByText('LIVE')).not.toBeInTheDocument();
    expect(within(card).getByText('~10/25 모집 마감')).toBeInTheDocument();
  });

  it('진행했던 프로그램에는 마감 라벨이 없다', () => {
    renderSection([], [program({ programType: 'LIVE', title: '지난 세미나' })]);
    const past = screen.getByRole('region', { name: '진행했던 프로그램' });
    expect(within(past).queryByText(/모집 마감|상시/)).not.toBeInTheDocument();
  });
});
