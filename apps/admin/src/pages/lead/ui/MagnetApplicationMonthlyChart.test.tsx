import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

vi.mock('@mui/x-charts/LineChart', () => ({
  LineChart: (props: {
    series: Array<{ label: string; showMark?: boolean }>;
  }) => (
    <div
      data-testid="line-chart"
      data-show-mark={String(props.series[0]?.showMark ?? true)}
    >
      {props.series[0]?.label}
    </div>
  ),
}));

import MagnetApplicationMonthlyChart from './MagnetApplicationMonthlyChart';

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

describe('MagnetApplicationMonthlyChart', () => {
  it('데이터가 있으면 월 단위 캡션과 차트를 렌더한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        createDate: '2026-03-10T09:00:00',
      }),
      buildApplication({
        magnetApplicationId: 2,
        createDate: '2026-05-12T18:30:00',
      }),
    ];

    const { getByTestId, getByText } = render(
      <MagnetApplicationMonthlyChart applications={applications} />,
    );

    expect(getByTestId('line-chart')).toBeInTheDocument();
    // 2026-03 ~ 2026-05 = 3개월(중간 04월 0건 포함), 총 2건
    expect(
      getByText(/월별 신청자 수 \(총 2건, 3개월\)/),
    ).toBeInTheDocument();
  });

  it('선 그래프의 동그라미 마커는 표시하지 않는다 (showMark=false)', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        createDate: '2026-05-12T18:30:00',
      }),
    ];

    const { getByTestId } = render(
      <MagnetApplicationMonthlyChart applications={applications} />,
    );
    expect(getByTestId('line-chart').getAttribute('data-show-mark')).toBe(
      'false',
    );
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(
      <MagnetApplicationMonthlyChart applications={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
