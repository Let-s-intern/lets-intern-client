jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GuestLookupSection from './GuestLookupSection';

const post = axios.post as jest.Mock;

const item = (submittedAt: string, status: string) => ({
  submittedAt,
  status,
  expectedReplyDate: '2026-11-04',
});

const renderSection = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <GuestLookupSection />
    </QueryClientProvider>,
  );

const lookup = async (name = '홍길동', phone = '01012345678') => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('성함'), name);
  await user.type(screen.getByLabelText('연락처'), phone);
  await user.click(screen.getByRole('button', { name: '조회하기' }));
};

describe('GuestLookupSection', () => {
  beforeEach(() => post.mockReset());

  it('연락처는 하이픈을 붙여 보여 주고 숫자만 보낸다', async () => {
    post.mockResolvedValue({ data: { data: [] } });
    renderSection();

    await lookup(' 홍길동 ', '01012345678');

    expect(screen.getByLabelText('연락처')).toHaveValue('010-1234-5678');
    expect(post).toHaveBeenCalledWith('/mentor-application/status', {
      name: '홍길동',
      phoneNum: '01012345678',
    });
  });

  it('결과가 있으면 폼 아래에 카드를 그린다', async () => {
    post.mockResolvedValue({
      data: { data: [item('2026-10-28T10:00:00', 'REVIEWING')] },
    });
    renderSection();

    await lookup();

    expect(await screen.findByText('신청일 2026. 10. 28.')).toBeInTheDocument();
    expect(screen.getByText('11월 4일 (수)')).toBeInTheDocument();
  });

  it('여러 건이면 받은 순서(최신순) 그대로 나열한다', async () => {
    post.mockResolvedValue({
      data: {
        data: [
          item('2026-10-28T10:00:00', 'CHECKING'),
          item('2026-09-01T10:00:00', 'REPLIED'),
        ],
      },
    });
    renderSection();

    await lookup();

    const dates = await screen.findAllByText(/^신청일 /);
    expect(dates.map((d) => d.textContent)).toEqual([
      '신청일 2026. 10. 28.',
      '신청일 2026. 9. 1.',
    ]);
  });

  it('결과가 없으면 안내 문구를 보인다', async () => {
    post.mockResolvedValue({ data: { data: [] } });
    renderSection();

    await lookup();

    expect(
      await screen.findByText(
        '일치하는 신청 내역이 없습니다. 성함과 연락처를 다시 확인해주세요.',
      ),
    ).toBeInTheDocument();
  });

  it('429 면 잠시 후 다시 시도하라고 알린다', async () => {
    post.mockRejectedValue({ status: 429 });
    renderSection();

    await lookup();

    expect(
      await screen.findByText('잠시 후 다시 시도해주세요.'),
    ).toBeInTheDocument();
  });

  it('결과 영역은 aria-live 로 알린다', () => {
    const { container } = renderSection();
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('비어 있거나 형식이 틀리면 요청하지 않는다', async () => {
    renderSection();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '조회하기' }));
    expect(
      await screen.findByText('성함을 입력해 주세요.'),
    ).toBeInTheDocument();
    expect(screen.getByText('연락처를 입력해 주세요.')).toBeInTheDocument();

    await lookup('홍길동', '0212345678');
    await waitFor(() =>
      expect(
        screen.getByText('올바른 연락처를 입력해 주세요.'),
      ).toBeInTheDocument(),
    );
    expect(post).not.toHaveBeenCalled();
  });
});
