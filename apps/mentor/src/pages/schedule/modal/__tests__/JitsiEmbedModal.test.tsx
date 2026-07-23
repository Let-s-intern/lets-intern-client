import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import JitsiEmbedModal from '../JitsiEmbedModal';

// JitsiEmbed(@letscareer/ui)는 실제 @jitsi/react-sdk를 끌어오므로 목으로 대체.
// topLeftSlot(타이머)과 onClose(닫기)를 그대로 노출해 테스트에서 검증할 수 있게 한다.
vi.mock('@letscareer/ui/JitsiEmbed', () => ({
  JitsiEmbed: ({
    roomUrl,
    onClose,
    topLeftSlot,
  }: {
    roomUrl: string;
    onClose: () => void;
    topLeftSlot?: React.ReactNode;
  }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl}>
      {topLeftSlot}
      <button type="button" onClick={onClose}>
        jitsi-close
      </button>
    </div>
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

  it('사전 Q&A·제출물 버튼을 각각 누르면 해당 자료만 보인다', async () => {
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
    // 화상은 항상 노출, 자료는 처음엔 버튼 뒤에 숨어있다.
    expect(screen.getByTestId('jitsi-embed')).toBeInTheDocument();
    expect(
      screen.queryByText('자기소개서 피드백을 받고 싶습니다.'),
    ).not.toBeInTheDocument();

    // 사전 QA 버튼 → 사전 Q&A만 표시
    await user.click(screen.getByRole('button', { name: '사전 QA' }));
    expect(
      screen.getByText('자기소개서 피드백을 받고 싶습니다.'),
    ).toBeInTheDocument();

    // 멘티 제출물 버튼 → 제출물 패널로 전환
    await user.click(screen.getByRole('button', { name: '멘티 제출물' }));
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

  it('출석은 클릭 즉시 저장하지 않고, 모달 닫힐 때 일괄 저장한다', async () => {
    const onSaveAttendance = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <JitsiEmbedModal
        isOpen
        onClose={onClose}
        meetingUrl={TEST_URL}
        menteeName="이지수"
        isMentor
        menteeStatus="PENDING"
        onSaveAttendance={onSaveAttendance}
      />,
    );

    // 참석 클릭만으로는 저장되지 않는다(지연 저장).
    await user.click(screen.getByRole('button', { name: '출석' }));
    expect(onSaveAttendance).not.toHaveBeenCalled();

    // 모달이 닫히면 보관된 출석이 전송된다.
    await user.click(screen.getByRole('button', { name: 'jitsi-close' }));
    expect(onSaveAttendance).toHaveBeenCalledWith('PRESENT');
    expect(onClose).toHaveBeenCalled();
  });

  it('참석을 한번 더 누르면 해제되어 닫혀도 저장되지 않는다', async () => {
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

    await user.click(screen.getByRole('button', { name: '출석' }));
    await user.click(screen.getByRole('button', { name: '출석' })); // 해제
    await user.click(screen.getByRole('button', { name: 'jitsi-close' }));
    expect(onSaveAttendance).not.toHaveBeenCalled();
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
      screen.queryByRole('button', { name: '출석' }),
    ).not.toBeInTheDocument();
  });
});
