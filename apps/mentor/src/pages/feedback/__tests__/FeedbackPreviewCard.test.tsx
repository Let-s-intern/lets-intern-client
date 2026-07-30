/**
 * Component tests for FeedbackPreviewCard.
 *
 * 이 카드는 라이브 모달 기본 화면의 **유일한 작성 진입점**이다. 그래서 진입 문구가
 * 현재 상태를 정확히 말해야 한다 — 제출을 마쳤는데 "이어서 수정하기" 가 남으면
 * 수정할 수 있는 것처럼 읽힌다(실제로는 서버가 잠근다).
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeedbackPreviewCard from '../ui/FeedbackPreviewCard';

/** 최소 Lexical editor state — 본문 "있음" 판정용. */
const CONTENT = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '지원 동기 문항을 두괄식으로 고쳐보세요.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

const noop = () => {};

describe('FeedbackPreviewCard 진입 문구', () => {
  it('작성분이 없으면 "피드백 작성하기" 를 노출한다', () => {
    render(<FeedbackPreviewCard onOpen={noop} content={null} />);

    expect(screen.getByText('피드백 작성하기')).toBeInTheDocument();
    expect(
      screen.getByText('아직 작성한 피드백이 없습니다'),
    ).toBeInTheDocument();
  });

  it('작성분이 있고 수정 가능하면 "이어서 수정하기" 를 노출한다', () => {
    render(<FeedbackPreviewCard onOpen={noop} content={CONTENT} canEdit />);

    expect(screen.getByText('이어서 수정하기')).toBeInTheDocument();
    expect(screen.queryByText('피드백 보기')).not.toBeInTheDocument();
  });

  it('제출 완료(수정 불가)면 "피드백 보기" 로 바뀐다', () => {
    render(
      <FeedbackPreviewCard
        onOpen={noop}
        content={CONTENT}
        canEdit={false}
        statusLabel="제출 완료"
      />,
    );

    expect(screen.getByText('피드백 보기')).toBeInTheDocument();
    expect(screen.queryByText('이어서 수정하기')).not.toBeInTheDocument();
    expect(screen.getByText('· 제출 완료')).toBeInTheDocument();
  });

  it('수정 불가·작성분 없음이면 작성 유도 문구를 띄우지 않는다', () => {
    render(
      <FeedbackPreviewCard onOpen={noop} content={null} canEdit={false} />,
    );

    expect(
      screen.getByText('아직 작성한 피드백이 없습니다'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('눌러서 작성을 시작하세요'),
    ).not.toBeInTheDocument();
  });

  it('작성분을 본문으로 렌더한다', () => {
    render(<FeedbackPreviewCard onOpen={noop} content={CONTENT} />);

    expect(
      screen.getByText('지원 동기 문항을 두괄식으로 고쳐보세요.'),
    ).toBeInTheDocument();
  });

  it('깨진 JSON 은 본문 없음으로 취급한다', () => {
    render(<FeedbackPreviewCard onOpen={noop} content="not-json" />);

    expect(
      screen.getByText('아직 작성한 피드백이 없습니다'),
    ).toBeInTheDocument();
    expect(screen.getByText('피드백 작성하기')).toBeInTheDocument();
  });

  it('카드를 누르면 onOpen 을 호출한다 (제출 완료여도 열람은 가능)', async () => {
    const onOpen = vi.fn();
    render(
      <FeedbackPreviewCard onOpen={onOpen} content={CONTENT} canEdit={false} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /작성한 피드백 피드백 보기/ }),
    );
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
