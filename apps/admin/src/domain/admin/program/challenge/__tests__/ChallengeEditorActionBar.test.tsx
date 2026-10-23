import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChallengeEditorActionBar, {
  CHALLENGE_EDITOR_SECTIONS,
} from '../ChallengeEditorActionBar';

describe('ChallengeEditorActionBar', () => {
  it('섹션 바로가기를 누르면 그 앵커로 스크롤한다', () => {
    const anchor = document.createElement('span');
    anchor.id = 'challenge-section-version';
    anchor.scrollIntoView = vi.fn();
    document.body.appendChild(anchor);
    render(<ChallengeEditorActionBar onSave={vi.fn()} saving={false} />);

    fireEvent.click(screen.getByRole('button', { name: '버전' }));

    expect(anchor.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    anchor.remove();
  });

  it('개설·수정 화면의 섹션을 모두 바로가기로 둔다', () => {
    render(<ChallengeEditorActionBar onSave={vi.fn()} saving={false} />);

    expect(
      screen
        .getByRole('navigation', { name: '섹션 바로가기' })
        .querySelectorAll('button'),
    ).toHaveLength(CHALLENGE_EDITOR_SECTIONS.length);
  });

  it('저장을 누르면 onSave 를 부르고, 저장 중에는 막는다', () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <ChallengeEditorActionBar onSave={onSave} saving={false} />,
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(onSave).toHaveBeenCalledTimes(1);

    rerender(<ChallengeEditorActionBar onSave={onSave} saving />);
    expect(screen.getByRole('button', { name: '저장 중' })).toBeDisabled();
  });
});
