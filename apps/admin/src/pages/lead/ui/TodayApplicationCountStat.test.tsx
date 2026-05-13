import { render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

import TodayApplicationCountStat from './TodayApplicationCountStat';

const buildApplication = (
  overrides: Partial<MagnetApplicationByMagnet> & { createDate: string },
): MagnetApplicationByMagnet => ({
  magnetApplicationId: 1,
  name: '홍길동',
  phoneNum: '01000000000',
  grade: '3학년',
  wishField: '개발',
  wishJob: '프론트엔드',
  wishIndustry: 'IT',
  wishCompany: '렛츠커리어',
  marketingAgree: true,
  questionAnswerList: [],
  ...overrides,
});

describe('TodayApplicationCountStat', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-13T12:00:00'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('오늘 날짜와 일치하는 신청만 카운트하고 누적은 전체 길이로 표시한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        createDate: '2026-05-13T08:00:00',
      }),
      buildApplication({
        magnetApplicationId: 2,
        createDate: '2026-05-13T23:59:00',
      }),
      buildApplication({
        magnetApplicationId: 3,
        createDate: '2026-05-12T18:00:00',
      }),
      buildApplication({
        magnetApplicationId: 4,
        createDate: '2026-04-01T10:00:00',
      }),
    ];

    const { getByText } = render(
      <TodayApplicationCountStat applications={applications} />,
    );

    expect(getByText('2명')).toBeInTheDocument();
    expect(getByText('누적 4명')).toBeInTheDocument();
    expect(getByText('오늘 신청자수')).toBeInTheDocument();
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(
      <TodayApplicationCountStat applications={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('invalid date는 카운트에서 제외된다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({ magnetApplicationId: 1, createDate: 'invalid' }),
      buildApplication({
        magnetApplicationId: 2,
        createDate: '2026-05-13T09:00:00',
      }),
    ];

    const { getByText } = render(
      <TodayApplicationCountStat applications={applications} />,
    );

    expect(getByText('1명')).toBeInTheDocument();
    expect(getByText('누적 2명')).toBeInTheDocument();
  });
});
