import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChallengeVersionContentEditor from '../ChallengeVersionContentEditor';

// 하위 편집기는 실제 화면과 같은 컴포넌트지만 여기서는 본문 동기화만 본다
vi.mock('@/common/lexical/EditorApp', () => ({ default: () => null }));
vi.mock('@/pages/program/challenge/ChallengeLecture', () => ({
  default: () => null,
}));
vi.mock('@/domain/admin/program/challenge/ChallengeCurriculum', () => ({
  default: () => null,
}));
vi.mock('@/domain/admin/program/ChallengeBlogReviewSection', () => ({
  default: () => null,
}));
vi.mock('@/domain/admin/program/ProgramBestReview', () => ({
  default: () => null,
}));
vi.mock('@/domain/program-recommend/ProgramRecommendEditor', () => ({
  default: () => null,
}));
vi.mock('@/domain/admin/program/challenge/ChallengePoint', () => ({
  default: ({
    setContent,
  }: {
    setContent: (
      update: (prev: Record<string, unknown>) => Record<string, unknown>,
    ) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        setContent((prev) => ({ ...prev, challengePoint: { list: [1] } }))
      }
    >
      포인트 수정
    </button>
  ),
}));

const DESCRIPTION = JSON.stringify({ intro: { a: 1 }, challengePoint: {} });

describe('ChallengeVersionContentEditor', () => {
  it('열기만 하면 본문을 올리지 않는다', () => {
    const onChange = vi.fn();
    render(
      <ChallengeVersionContentEditor
        description={DESCRIPTION}
        onChange={onChange}
      />,
    );

    expect(onChange).not.toHaveBeenCalled();
  });

  it('하위 편집기가 바꾼 본문을 JSON 으로 올린다', () => {
    const onChange = vi.fn();
    render(
      <ChallengeVersionContentEditor
        description={DESCRIPTION}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '포인트 수정' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(JSON.parse(onChange.mock.calls[0][0])).toEqual({
      intro: { a: 1 },
      challengePoint: { list: [1] },
    });
  });
});
