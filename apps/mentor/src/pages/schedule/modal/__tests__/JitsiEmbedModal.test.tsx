import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import JitsiEmbedModal from '../JitsiEmbedModal';

// JitsiEmbed(@letscareer/ui)는 실제 @jitsi/react-sdk를 끌어오므로 목으로 대체
vi.mock('@letscareer/ui/JitsiEmbed', () => ({
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
}));

const TEST_URL = 'https://meet.jit.si/letscareer-x7k2p9';

describe('JitsiEmbedModal', () => {
  it('isOpen=false면 아무것도 렌더하지 않는다', () => {
    const { container } = render(
      <JitsiEmbedModal
        isOpen={false}
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('isOpen=true이고 meetingUrl이 있으면 회의실(jitsi-embed)을 BE URL로 렌더한다', () => {
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
      />,
    );
    const embed = screen.getByTestId('jitsi-embed');
    expect(embed).toBeInTheDocument();
    expect(embed).toHaveAttribute('data-room-url', TEST_URL);
  });

  it('meetingUrl이 null이면 회의실 대신 준비 중 안내를 표시한다', () => {
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={null}
        menteeName="이지수"
      />,
    );
    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
    expect(
      screen.getByText(/회의실이 아직 준비되지 않았습니다/),
    ).toBeInTheDocument();
  });

  it('자료 FAB를 누르면 폰 프레임에 사전 Q&A·제출물이 보인다', async () => {
    const user = userEvent.setup();
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
        preQuestion="자기소개서 피드백을 받고 싶습니다."
        submissionUrl="https://example.com/submission/1"
      />,
    );
    // 화상은 항상 노출, 자료는 처음엔 FAB 뒤에 숨어있다.
    expect(screen.getByTestId('jitsi-embed')).toBeInTheDocument();
    expect(screen.queryByText('사전 Q&A')).not.toBeInTheDocument();

    // 동그란 자료 버튼을 누르면 폰 프레임에 표시된다.
    await user.click(screen.getByRole('button', { name: '멘티 자료 보기' }));
    expect(screen.getByText('사전 Q&A')).toBeInTheDocument();
    expect(
      screen.getByText('자기소개서 피드백을 받고 싶습니다.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '새 탭에서 열기' }),
    ).toBeInTheDocument();
  });

  it('startDate/endDate 가 있으면 세션 타이머(현재/남은)를 렌더한다', () => {
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
        startDate={new Date(Date.now() - 60_000).toISOString()}
        endDate={new Date(Date.now() + 600_000).toISOString()}
      />,
    );
    expect(screen.getByText('현재')).toBeInTheDocument();
    expect(screen.getByText('남은')).toBeInTheDocument();
  });

  it('isMentor=true 면 멘티 출석 체크 버튼을 노출하고 클릭 시 onSaveAttendance 를 호출한다', async () => {
    const onSaveAttendance = vi.fn();
    const user = userEvent.setup();
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
        isMentor
        menteeStatus="PENDING"
        onSaveAttendance={onSaveAttendance}
      />,
    );
    expect(screen.getByText(/이지수 님 출석/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '참석' }));
    expect(onSaveAttendance).toHaveBeenCalledWith('PRESENT');

    await user.click(screen.getByRole('button', { name: '불참' }));
    expect(onSaveAttendance).toHaveBeenCalledWith('ABSENT');
  });

  it('isMentor=false(미지정) 면 멘티 출석 체크 버튼을 노출하지 않는다', () => {
    render(
      <JitsiEmbedModal
        isOpen
        onClose={() => {}}
        meetingUrl={TEST_URL}
        menteeName="이지수"
      />,
    );
    expect(screen.queryByText(/출석 체크/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '참석' }),
    ).not.toBeInTheDocument();
  });
});
