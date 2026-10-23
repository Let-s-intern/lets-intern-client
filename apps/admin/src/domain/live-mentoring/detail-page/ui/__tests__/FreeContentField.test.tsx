import { fireEvent, render, screen, within } from '@testing-library/react';
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
      <button type="button" onClick={() => onChange('NEW_CONTENT')}>
        본문 입력
      </button>
    </div>
  ),
}));

import FreeContentField from '../FreeContentField';

const value = {
  visible: false,
  content: null,
  position: 'AFTER_MENTORING_TYPES' as const,
};

describe('FreeContentField', () => {
  it('노출 토글을 반영한다', () => {
    const onChange = vi.fn();
    render(<FreeContentField value={value} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('상세페이지에 표시'));
    expect(onChange).toHaveBeenLastCalledWith({ ...value, visible: true });
  });

  it('위치를 한글 이름으로 고르고 enum 값으로 반영한다', () => {
    const onChange = vi.fn();
    render(<FreeContentField value={value} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(
      within(screen.getByRole('listbox')).getByText('취업 성공 전략 뒤'),
    );
    expect(onChange).toHaveBeenLastCalledWith({
      ...value,
      position: 'AFTER_STRATEGY',
    });
  });

  it('본문을 고치면 content 로 반영한다', () => {
    const onChange = vi.fn();
    render(<FreeContentField value={value} onChange={onChange} />);
    expect(screen.getByTestId('editor-initial')).toHaveTextContent('EMPTY');
    fireEvent.click(screen.getByRole('button', { name: '본문 입력' }));
    expect(onChange).toHaveBeenLastCalledWith({
      ...value,
      content: 'NEW_CONTENT',
    });
  });

  it('배치 미리보기에서 고른 섹션 바로 뒤에 자유 입력란을 보인다', () => {
    render(
      <FreeContentField
        value={{ ...value, position: 'AFTER_VIDEO' }}
        onChange={vi.fn()}
      />,
    );
    const items = screen.getAllByRole('listitem');
    const videoItem = items.find((item) =>
      item.textContent?.startsWith('소개 영상'),
    );
    expect(videoItem).toHaveTextContent('소개 영상자유 입력란');
  });
});
