import { render, screen } from '@testing-library/react';

import PlanUpgradeFailContent from './PlanUpgradeFailContent';

const replace = jest.fn();
let search = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace }),
  useSearchParams: () => new URLSearchParams(search),
}));

const renderPage = (query: string) => {
  search = query;
  return render(<PlanUpgradeFailContent applicationId="7" />);
};

beforeEach(() => {
  replace.mockReset();
});

describe('PlanUpgradeFailContent', () => {
  it('결제창을 닫았으면 실패 화면 없이 고른 플랜으로 업그레이드 화면에 돌아간다', () => {
    renderPage(
      'plan=STANDARD&code=PAY_PROCESS_CANCELED&message=%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80%20%EA%B2%B0%EC%A0%9C%EB%A5%BC%20%EC%B7%A8%EC%86%8C%ED%95%98%EC%98%80%EC%8A%B5%EB%8B%88%EB%8B%A4&orderId=plan-upgrade-7-1760000000000',
    );

    expect(replace).toHaveBeenCalledWith('/plan-upgrade/7?plan=STANDARD');
    expect(
      screen.queryByRole('heading', { name: '결제에 실패했어요' }),
    ).not.toBeInTheDocument();
  });

  it('그 외 실패는 토스 문구와 다시 시도·마이페이지 버튼을 보인다', () => {
    const params = new URLSearchParams({
      plan: 'STANDARD',
      code: 'REJECT_CARD_COMPANY',
      message: '카드 한도가 초과되었습니다.',
      orderId: 'plan-upgrade-7-1760000000000',
    });

    renderPage(params.toString());

    expect(replace).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: '결제에 실패했어요' }),
    ).toHaveClass('text-primary');
    expect(screen.getByText('카드 한도가 초과되었습니다.')).toHaveClass(
      'text-neutral-20',
    );
    expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
      'href',
      '/plan-upgrade/7?plan=STANDARD',
    );
    expect(screen.getByRole('link', { name: '마이페이지로' })).toHaveAttribute(
      'href',
      '/mypage/application',
    );
  });

  it('쿼리가 올바르지 않으면 잘못된 접근으로 보이고 플랜 없이 되돌린다', () => {
    renderPage('code=REJECT_CARD_COMPANY');

    expect(screen.getByText('잘못된 접근입니다.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
      'href',
      '/plan-upgrade/7',
    );
  });
});
