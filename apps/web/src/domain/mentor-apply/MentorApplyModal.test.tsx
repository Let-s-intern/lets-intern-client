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

import MentorApplyModal from './MentorApplyModal';

const post = axios.post as jest.Mock;
const confirm = jest.spyOn(window, 'confirm');

const renderModal = (open = true) => {
  const onClose = jest.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <MentorApplyModal open={open} onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
};

const requiredField = (label: string) =>
  screen.getByLabelText(new RegExp(`^${label}\\s*\\*`));

const close = () =>
  userEvent.click(screen.getByRole('button', { name: '닫기' }));

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
  await screen.findByRole('heading', { name: '신청서가 제출되었습니다' });
};

beforeEach(() => {
  post.mockReset();
  confirm.mockReset();
  Element.prototype.scrollIntoView = jest.fn();
});

describe('MentorApplyModal', () => {
  it('open 이 false 면 그리지 않는다', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('고친 값이 없으면 확인 없이 닫는다', async () => {
    const onClose = renderModal();
    expect(
      screen.getByRole('dialog', { name: '멘토 신청서' }),
    ).toBeInTheDocument();

    await close();

    expect(confirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('입력 중에 닫으면 확인을 받고, 취소하면 머문다', async () => {
    confirm.mockReturnValue(false);
    const onClose = renderModal();
    await userEvent.type(requiredField('성함'), '홍');

    await close();

    expect(confirm).toHaveBeenCalledWith(
      '작성 중인 신청서는 저장되지 않습니다. 닫으시겠습니까?',
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('입력 중에 Esc 로 닫아도 확인을 받고, 승인하면 닫는다', async () => {
    confirm.mockReturnValue(true);
    const onClose = renderModal();
    await userEvent.type(requiredField('성함'), '홍');

    await userEvent.keyboard('{Escape}');

    expect(confirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('완료 화면에서는 확인 없이 닫고, 홈으로는 모달 닫기다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 3 } } });
    const onClose = renderModal();
    await fillAndSubmit();

    await close();
    await userEvent.click(screen.getByRole('button', { name: '홈으로' }));

    expect(confirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
