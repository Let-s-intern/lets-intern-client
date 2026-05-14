import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

import MarketingAgreeStat from './MarketingAgreeStat';

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

describe('MarketingAgreeStat', () => {
  it('4건 중 3건 동의 시 75%와 비율을 표시한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({ magnetApplicationId: 1, marketingAgree: true }),
      buildApplication({ magnetApplicationId: 2, marketingAgree: true }),
      buildApplication({ magnetApplicationId: 3, marketingAgree: true }),
      buildApplication({ magnetApplicationId: 4, marketingAgree: false }),
    ];

    const { getByText } = render(
      <MarketingAgreeStat applications={applications} />,
    );

    expect(getByText('마케팅 동의율')).toBeInTheDocument();
    expect(getByText('75.00%')).toBeInTheDocument();
    expect(getByText('3 / 4명')).toBeInTheDocument();
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(<MarketingAgreeStat applications={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
