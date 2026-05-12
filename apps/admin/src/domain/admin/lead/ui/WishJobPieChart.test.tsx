import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: (props: {
    series: Array<{ data: Array<{ label: string; value: number }> }>;
  }) => (
    <div data-testid="pie-chart">
      {props.series[0]?.data.map((d) => `${d.label}:${d.value}`).join(',')}
    </div>
  ),
}));

import WishJobPieChart from './WishJobPieChart';

const buildApplication = (
  overrides: Partial<MagnetApplicationByMagnet>,
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
  createDate: '2026-05-10T09:00:00',
  ...overrides,
});

describe('WishJobPieChart', () => {
  it('데이터가 있으면 차트, 캡션, 카드 하단 자체 범례를 렌더한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({ magnetApplicationId: 1, wishJob: '프론트엔드' }),
      buildApplication({ magnetApplicationId: 2, wishJob: '백엔드' }),
      buildApplication({ magnetApplicationId: 3, wishJob: '프론트엔드' }),
    ];

    const { getByTestId, getByText, getByRole } = render(
      <WishJobPieChart applications={applications} />,
    );

    expect(getByText('희망 직무 분포')).toBeInTheDocument();
    expect(getByTestId('pie-chart')).toBeInTheDocument();

    const legend = getByRole('list');
    expect(legend).toHaveTextContent('프론트엔드');
    expect(legend).toHaveTextContent('(2)');
    expect(legend).toHaveTextContent('백엔드');
    expect(legend).toHaveTextContent('(1)');
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(<WishJobPieChart applications={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('모든 wishJob이 미입력이면 차트를 렌더하지 않는다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({ magnetApplicationId: 1, wishJob: null }),
      buildApplication({ magnetApplicationId: 2, wishJob: '' }),
      buildApplication({ magnetApplicationId: 3, wishJob: '-' }),
    ];

    const { container } = render(
      <WishJobPieChart applications={applications} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
