import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const get = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import CareerEditDialog, { type CareerEditValues } from '../CareerEditDialog';

const initialValues: CareerEditValues = {
  company: '렛츠커리어',
  job: '마케터',
  field: '마케팅',
  position: '팀장',
  department: '그로스팀',
  employmentType: '정규직',
  startDate: '2020-01',
  endDate: '',
  companyLogoId: 5,
  logoImgUrl: 'https://cdn.test/old.png',
  logoName: '옛로고',
  isRepresentative: false,
};

const renderDialog = (values = initialValues) => {
  const onSubmit = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CareerEditDialog
        initialValues={values}
        isSaving={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    </QueryClientProvider>,
  );
  return onSubmit;
};

describe('CareerEditDialog', () => {
  it('기존 값을 채워 연다', () => {
    renderDialog();
    expect(screen.getByLabelText(/^회사/)).toHaveValue('렛츠커리어');
    expect(screen.getByLabelText(/^직무/)).toHaveValue('마케터');
    expect(screen.getByLabelText(/^직책/)).toHaveValue('팀장');
    expect(screen.getByLabelText(/^부서/)).toHaveValue('그로스팀');
    expect(screen.getByLabelText(/^시작/)).toHaveValue('2020-01');
  });

  it('고친 값과 대표 경력 체크를 넘긴다', () => {
    const onSubmit = renderDialog();
    fireEvent.change(screen.getByLabelText(/^회사/), {
      target: { value: '새 회사' },
    });
    fireEvent.change(screen.getByLabelText(/^종료/), {
      target: { value: '2023-05' },
    });
    fireEvent.click(screen.getByLabelText(/대표 경력으로 설정/));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(onSubmit).toHaveBeenCalledWith({
      ...initialValues,
      company: '새 회사',
      endDate: '2023-05',
      isRepresentative: true,
    });
  });

  it('회사가 비거나 종료가 시작보다 앞이면 저장할 수 없다', () => {
    renderDialog();
    fireEvent.change(screen.getByLabelText(/^종료/), {
      target: { value: '2019-01' },
    });
    expect(
      screen.getByText('종료는 시작 이후여야 합니다.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/^종료/), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/^회사/), {
      target: { value: ' ' },
    });
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('이미 대표인 경력은 대표 체크를 풀 수 없다', () => {
    renderDialog({ ...initialValues, isRepresentative: true });
    const checkbox = screen.getByLabelText(/대표 경력으로 설정/);
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });
});

describe('CareerEditDialog 경력 로고 (LC-3499)', () => {
  it('라이브러리에서 고른 로고 주소를 넘긴다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          companyLogoList: [
            { id: 3, name: '네이버', imageUrl: 'https://cdn.test/naver.png' },
          ],
        },
      },
    });
    const onSubmit = renderDialog();
    fireEvent.click(
      screen.getByRole('button', { name: '라이브러리에서 선택' }),
    );
    fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(onSubmit.mock.lastCall?.[0]).toMatchObject({
      companyLogoId: 3,
      logoImgUrl: 'https://cdn.test/naver.png',
      logoName: '네이버',
    });
  });

  it('연결된 라이브러리 로고의 회사명을 보인다', () => {
    renderDialog();
    expect(screen.getByText('라이브러리: 옛로고')).toBeInTheDocument();
  });

  it('로고를 해제하면 연결 id 를 null 로 넘긴다', () => {
    const onSubmit = renderDialog();
    fireEvent.click(screen.getByRole('button', { name: '로고 해제' }));
    expect(
      screen.queryByRole('button', { name: '로고 해제' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(onSubmit.mock.lastCall?.[0]).toMatchObject({
      companyLogoId: null,
      logoImgUrl: '',
    });
  });
});
