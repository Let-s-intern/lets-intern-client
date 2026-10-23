import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/common/lexical/EditorApp', () => ({
  emptyEditorState: 'EMPTY',
  default: ({
    initialEditorStateJsonString,
    onChange,
  }: {
    initialEditorStateJsonString: string;
    onChange: (json: string) => void;
  }) => (
    <div>
      <span data-testid="editor-initial">{initialEditorStateJsonString}</span>
      <button type="button" onClick={() => onChange('CHANGED')}>
        입력
      </button>
    </div>
  ),
}));

import MentorDescriptionField from '../MentorDescriptionField';

describe('MentorDescriptionField', () => {
  it('저장된 본문을 초기값으로 쓴다', () => {
    render(
      <MentorDescriptionField initialDescription="SAVED" onChange={vi.fn()} />,
    );
    expect(screen.getByTestId('editor-initial')).toHaveTextContent('SAVED');
  });

  it('본문이 없으면 빈 에디터로 시작한다', () => {
    render(
      <MentorDescriptionField initialDescription={null} onChange={vi.fn()} />,
    );
    expect(screen.getByTestId('editor-initial')).toHaveTextContent('EMPTY');
  });

  it('고치면 onChange 로 본문을 알린다', () => {
    const onChange = vi.fn();
    render(
      <MentorDescriptionField initialDescription="SAVED" onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '입력' }));
    expect(onChange).toHaveBeenCalledWith('CHANGED');
  });
});
