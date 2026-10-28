jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

// 자동 채우기가 `@/api/user/user` 를 물고 오므로 그 모듈의 v2 네트워크 계층(`import.meta`)을 막는다
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));

import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MentorApplyFlow from './MentorApplyFlow';

const post = axios.post as jest.Mock;

const renderFlow = (props: Parameters<typeof MentorApplyFlow>[0] = {}) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <MentorApplyFlow heading={<h1>멘토 신청서</h1>} {...props} />
    </QueryClientProvider>,
  );

const requiredField = (label: string) =>
  screen.getByLabelText(new RegExp(`^${label}\\s*\\*`));

/** 필수 항목만 채우고 제출한다 */
const fillAndSubmit = async () => {
  await userEvent.type(requiredField('성함'), '홍길동');
  await userEvent.type(requiredField('소속'), '렛츠커리어');
  await userEvent.type(requiredField('직무'), '백엔드 개발');
  await userEvent.type(requiredField('연차'), '5');
  await userEvent.type(requiredField('전화번호'), '01012345678');
  await userEvent.type(requiredField('이메일'), 'mentor@example.com');
  await userEvent.click(screen.getByRole('checkbox', { name: '전화번호' }));
  await userEvent.click(screen.getByLabelText('데이터·AI'));
  await userEvent.click(screen.getByLabelText('서류 첨삭'));
  await userEvent.click(
    screen.getByLabelText(/개인정보 수집·이용에 동의합니다/),
  );
  await userEvent.click(
    screen.getByRole('button', { name: '신청서 제출하기' }),
  );
};

beforeEach(() => {
  post.mockReset();
  Element.prototype.scrollIntoView = jest.fn();
});

describe('MentorApplyFlow', () => {
  it('제출에 성공하면 같은 자리에서 완료 화면으로 바뀐다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 1 } } });
    renderFlow();
    expect(
      screen.getByRole('heading', { name: '멘토 신청서' }),
    ).toBeInTheDocument();

    await fillAndSubmit();

    expect(
      await screen.findByRole('heading', { name: '신청서가 제출되었습니다' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/귀한 시간 내주시어 감사합니다\./),
    ).toHaveTextContent(
      '귀한 시간 내주시어 감사합니다.5영업일 내로 선택해주신 연락 수단을 통해 회신드리겠습니다.',
    );
    expect(
      screen.queryByRole('heading', { name: '멘토 신청서' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '신청서 제출하기' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '신청 현황 조회' }),
    ).toHaveAttribute('href', '/mentor-apply/status');
    expect(screen.getByRole('link', { name: '홈으로' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('onHome 을 받으면 홈으로는 링크가 아니라 그 동작을 부른다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 2 } } });
    const onHome = jest.fn();
    renderFlow({ onHome });

    await fillAndSubmit();
    await userEvent.click(
      await screen.findByRole('button', { name: '홈으로' }),
    );

    expect(onHome).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('link', { name: '홈으로' }),
    ).not.toBeInTheDocument();
  });

  it('제출에 실패하면 신청서에 머문다', async () => {
    post.mockRejectedValue(new Error('500'));
    renderFlow();

    await fillAndSubmit();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '신청서가 제출되었습니다' }),
    ).not.toBeInTheDocument();
  });
});
