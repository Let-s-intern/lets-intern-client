import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PurchaseCloseButton from './PurchaseCloseButton';
import { closePurchaseWindow } from '../utils/purchaseWindow';

let mockParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockParams,
}));
jest.mock('../utils/purchaseWindow', () => ({
  closePurchaseWindow: jest.fn(),
}));

describe('PurchaseCloseButton', () => {
  it('누르면 쿼리의 returnUrl 로 창 닫기를 시도한다', async () => {
    mockParams = new URLSearchParams({ returnUrl: 'https://ogonggo.co.kr/r' });

    render(<PurchaseCloseButton label="확인" />);
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(closePurchaseWindow).toHaveBeenCalledWith('https://ogonggo.co.kr/r');
  });

  it('returnUrl 이 없으면 null 로 닫기만 시도한다', async () => {
    mockParams = new URLSearchParams();

    render(<PurchaseCloseButton label="닫기" />);
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(closePurchaseWindow).toHaveBeenCalledWith(null);
  });
});
