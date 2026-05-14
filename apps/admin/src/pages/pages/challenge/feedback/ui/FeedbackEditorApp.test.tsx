/**
 * FeedbackEditorApp 분기 테스트
 *
 * 목적: 피드백 관리 페이지가 (a) 편집 가능 모드에서 EditorApp(=툴바 포함)을
 *       마운트하고 (b) 완료/확인 상태일 때만 read-only LexicalContent를
 *       렌더한다는 분기 동작을 단언한다.
 *
 * 가짜 데이터 흐름:
 *   - useIsCompleted: localStorage 의 attendance.feedbackStatus 로 결정
 *   - EditorApp: 실제 Lexical 컴포지터가 무거우므로 가벼운 마커로 mock
 */
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// EditorApp을 가벼운 마커로 mock — 실제 Lexical 마운트 비용을 피하면서
// `<EditorApp />` 분기로 진입했는지 단언
vi.mock('@/common/lexical/EditorApp', () => ({
  default: ({
    initialEditorStateJsonString,
  }: {
    initialEditorStateJsonString?: string;
  }) => (
    <div
      data-testid="editor-app-marker"
      data-initial={initialEditorStateJsonString ?? ''}
    />
  ),
}));

vi.mock('@/common/lexical/LexicalContent', () => ({
  default: () => <div data-testid="lexical-content-marker" />,
}));

import FeedbackEditorApp from './FeedbackEditorApp';

const VALID_JSON = JSON.stringify({
  root: {
    children: [
      {
        children: [{ text: '예시', type: 'text', version: 1, format: 0 }],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

const setAttendance = (status: string) => {
  localStorage.setItem(
    'attendance',
    JSON.stringify({ feedbackStatus: status }),
  );
};

describe('FeedbackEditorApp', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('진행중(IN_PROGRESS) 상태에서는 EditorApp(=툴바 포함)을 렌더한다', async () => {
    setAttendance('IN_PROGRESS');
    render(<FeedbackEditorApp initialEditorStateJsonString={VALID_JSON} />);
    expect(await screen.findByTestId('editor-app-marker')).toBeInTheDocument();
    expect(
      screen.queryByTestId('lexical-content-marker'),
    ).not.toBeInTheDocument();
  });

  it('대기중(WAITING) 상태에서는 EditorApp을 렌더한다', async () => {
    setAttendance('WAITING');
    render(<FeedbackEditorApp />);
    expect(await screen.findByTestId('editor-app-marker')).toBeInTheDocument();
  });

  it('확인완료(CONFIRMED) + 유효 JSON 이면 LexicalContent(읽기 전용)만 렌더한다', async () => {
    setAttendance('CONFIRMED');
    render(<FeedbackEditorApp initialEditorStateJsonString={VALID_JSON} />);
    expect(
      await screen.findByTestId('lexical-content-marker'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('editor-app-marker')).not.toBeInTheDocument();
  });

  it('완료(COMPLETED) + 잘못된 JSON 이면 EditorApp 으로 fallthrough', async () => {
    setAttendance('COMPLETED');
    render(<FeedbackEditorApp initialEditorStateJsonString="not-json" />);
    expect(await screen.findByTestId('editor-app-marker')).toBeInTheDocument();
  });
});
