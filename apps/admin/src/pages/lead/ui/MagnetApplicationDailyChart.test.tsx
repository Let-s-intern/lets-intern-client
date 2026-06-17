import { render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

// @mui/x-charts의 LineChart는 SVG 측정을 위해 ResizeObserver 등 jsdom 미지원
// API를 요구한다. 스모크 테스트 범위에서는 mock으로 충분하다.
vi.mock('@mui/x-charts/LineChart', () => ({
  LineChart: (props: { series: Array<{ label: string }> }) => (
    <div data-testid="line-chart">{props.series[0]?.label}</div>
  ),
}));

import MagnetApplicationDailyChart from './MagnetApplicationDailyChart';

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

describe('MagnetApplicationDailyChart', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-13T12:00:00'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('최근 한 달 내 데이터가 있으면 차트와 캡션을 렌더한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        createDate: '2026-05-10T09:00:00',
      }),
      buildApplication({
        magnetApplicationId: 2,
        createDate: '2026-05-12T18:30:00',
      }),
    ];

    const { getByTestId, getByText } = render(
      <MagnetApplicationDailyChart applications={applications} />,
    );

    expect(getByTestId('line-chart')).toBeInTheDocument();
    // 2026-05-10 ~ 2026-05-12 = 3일치, 총 2건이 최근 30일 윈도우(2026-04-14~2026-05-13) 내
    expect(
      getByText(/일자별 신청자 수 \(최근 한 달 총 2건, 3일\)/),
    ).toBeInTheDocument();
  });

  it('한 달 이전 데이터는 제외된다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        // 2026-05-13 기준 30일보다 이전
        createDate: '2026-01-01T09:00:00',
      }),
    ];

    const { container } = render(
      <MagnetApplicationDailyChart applications={applications} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('데이터가 비어 있으면 null을 반환하여 영역을 렌더하지 않는다', () => {
    const { container } = render(
      <MagnetApplicationDailyChart applications={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
