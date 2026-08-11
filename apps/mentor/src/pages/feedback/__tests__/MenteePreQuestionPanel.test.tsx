/**
 * Component tests for MenteePreQuestionPanel.
 *
 * 이 패널의 존재 이유는 "높이를 스스로 가둔다"는 것이다. 카드 인라인이던 시절엔
 * 사전 질문이 길수록 에디터가 밀려 0px까지 줄어들었다. 따라서 내용 렌더뿐 아니라
 * 스크롤 컨테이너가 유지되는지도 함께 검증한다.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenteePreQuestionPanel from '../ui/MenteePreQuestionPanel';

const noop = () => {};

describe('MenteePreQuestionPanel', () => {
  it('사전 질문 내용을 줄바꿈 유지한 채 노출한다', () => {
    render(
      <MenteePreQuestionPanel
        onClose={noop}
        preQuestion={'첫 줄 질문\n둘째 줄 질문'}
        menteeName="홍길동"
      />,
    );

    const body = screen.getByText(/첫 줄 질문/);
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('whitespace-pre-wrap');
  });

  it('멘티 이름을 제목에 포함한다', () => {
    render(
      <MenteePreQuestionPanel
        onClose={noop}
        preQuestion="질문"
        menteeName="홍길동"
      />,
    );

    expect(screen.getByText('홍길동 님의 사전 질문')).toBeInTheDocument();
  });

  it('내용이 없으면 안내 문구를 노출한다', () => {
    render(<MenteePreQuestionPanel onClose={noop} preQuestion="   " />);

    expect(screen.getByText('작성한 내용이 없습니다.')).toBeInTheDocument();
  });

  it('본문 영역이 자체 스크롤 컨테이너를 유지한다 (에디터 높이 침범 방지)', () => {
    render(<MenteePreQuestionPanel onClose={noop} preQuestion="질문" />);

    const scroller = screen.getByText('질문').parentElement;
    expect(scroller).toHaveClass('overflow-y-auto');
    expect(scroller).toHaveClass('min-h-0');
  });

  it('닫기 버튼이 onClose 를 호출한다', async () => {
    const onClose = vi.fn();
    render(<MenteePreQuestionPanel onClose={onClose} preQuestion="질문" />);

    await userEvent.click(
      screen.getByRole('button', { name: '사전 질문 패널 닫기' }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
