import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

// @mui/x-charts의 PieChart는 SVG 측정을 위해 ResizeObserver 등 jsdom 미지원
// API를 요구한다. 스모크 테스트 범위에서는 mock으로 충분하다.
vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: (props: {
    series: Array<{ data: Array<{ label: string; value: number }> }>;
  }) => (
    <div data-testid="pie-chart">
      {props.series[0]?.data.map((d) => `${d.label}:${d.value}`).join(',')}
    </div>
  ),
}));

import WishFieldPieChart from './WishFieldPieChart';

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

describe('WishFieldPieChart', () => {
  it('데이터가 있으면 차트와 캡션을 렌더한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({ magnetApplicationId: 1, wishField: '개발' }),
      buildApplication({ magnetApplicationId: 2, wishField: '개발' }),
      buildApplication({ magnetApplicationId: 3, wishField: '디자인' }),
    ];

    const { getByTestId, getByText } = render(
      <WishFieldPieChart applications={applications} />,
    );

    expect(getByText('희망 직군 분포')).toBeInTheDocument();
    expect(getByTestId('pie-chart')).toHaveTextContent('개발:2');
    expect(getByTestId('pie-chart')).toHaveTextContent('디자인:1');
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(<WishFieldPieChart applications={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
