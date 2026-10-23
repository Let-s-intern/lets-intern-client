import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const get = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import CompanyLogoPickerDialog from '../CompanyLogoPickerDialog';

const logos = [
  { id: 1, name: '렛츠커리어', imageUrl: 'https://cdn.test/lc.png' },
  { id: 2, name: '카카오', imageUrl: 'https://cdn.test/kakao.png' },
];

const renderPicker = () => {
  get.mockResolvedValue({ data: { data: { companyLogoList: logos } } });
  const onSelect = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CompanyLogoPickerDialog onClose={vi.fn()} onSelect={onSelect} />
    </QueryClientProvider>,
  );
  return onSelect;
};

describe('CompanyLogoPickerDialog', () => {
  it('고르기 전에는 선택할 수 없고, 고르면 이미지 주소를 돌려준다', async () => {
    const onSelect = renderPicker();
    await screen.findByText('카카오');
    expect(screen.getByRole('button', { name: '선택' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /카카오/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(onSelect).toHaveBeenCalledWith('https://cdn.test/kakao.png');
  });

  it('회사명으로 거른다', async () => {
    renderPicker();
    await screen.findByText('카카오');
    fireEvent.change(screen.getByLabelText('회사명 검색'), {
      target: { value: '렛츠' },
    });
    expect(screen.getByText('렛츠커리어')).toBeInTheDocument();
    expect(screen.queryByText('카카오')).not.toBeInTheDocument();
  });
});
