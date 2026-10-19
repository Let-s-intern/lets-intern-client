import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// react-query 처럼 렌더 사이에 같은 참조를 돌려줘야 한다. 매 렌더 새 객체를 주면
// 데이터가 바뀐 것으로 보고 동기화 effect 가 끝없이 돈다.
const mocks = vi.hoisted(() => ({
  attendance: { id: 10, status: 'PRESENT', feedbackStatus: 'IN_PROGRESS' },
  attendanceData: {} as { attendanceList: unknown[] },
  feedbackData: {} as { attendanceDetailVo: { feedback: string } },
}));

vi.mock('@/common/lexical/EditorApp', () => ({ emptyEditorState: 'EMPTY' }));
vi.mock('@/api/challenge/challenge', () => ({
  FeedbackAttendanceQueryKey: 'feedbackAttendance',
  useFeedbackAttendanceQuery: () => ({
    data: mocks.feedbackData,
    dataUpdatedAt: 1,
  }),
}));
vi.mock('../useMentorAttendanceQuery', () => ({
  getMentorAttendanceQueryKey: () => 'mentorAttendance',
  useMentorAttendanceQuery: () => ({ data: mocks.attendanceData }),
}));

import {
  loadFeedbackDraft,
  saveFeedbackDraft,
} from '../../utils/feedbackLocalDraft';
import { useFeedbackModal } from '../useFeedbackModal';

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

const renderModalHook = () =>
  renderHook(
    () =>
      useFeedbackModal({
        isOpen: true,
        onClose: vi.fn(),
        challengeId: 1,
        missionId: 2,
      }),
    { wrapper },
  );

describe('useFeedbackModal 로컬 초안', () => {
  beforeEach(() => {
    mocks.attendance = {
      id: 10,
      status: 'PRESENT',
      feedbackStatus: 'IN_PROGRESS',
    };
    mocks.attendanceData = { attendanceList: [mocks.attendance] };
    mocks.feedbackData = { attendanceDetailVo: { feedback: 'SERVER' } };
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('서버 내용과 다른 입력은 로컬 초안으로 저장한다', () => {
    const { result } = renderModalHook();

    act(() => result.current.setEditorContent('DRAFT'));

    expect(loadFeedbackDraft(10)).toBe('DRAFT');
  });

  it('입력이 서버 내용과 같아지면 로컬 초안을 지운다', () => {
    saveFeedbackDraft(10, 'DRAFT');
    const { result } = renderModalHook();

    act(() => result.current.setEditorContent('SERVER'));

    expect(loadFeedbackDraft(10)).toBeNull();
  });

  it('저장하지 않은 로컬 초안이 있으면 열 때 복원하고 에디터를 다시 마운트한다', () => {
    saveFeedbackDraft(10, 'DRAFT');

    const { result } = renderModalHook();

    expect(result.current.editorContent).toBe('DRAFT');
    expect(result.current.isDraftRestored).toBe(true);
    expect(result.current.editorKey).toBe('0-1-1');
  });

  it('로컬 초안이 없으면 서버 내용을 그대로 쓴다', () => {
    const { result } = renderModalHook();

    expect(result.current.editorContent).toBe('SERVER');
    expect(result.current.isDraftRestored).toBe(false);
    expect(result.current.editorKey).toBe('0-1-0');
  });

  it('서버 저장에 성공하면 로컬 초안을 지운다', () => {
    saveFeedbackDraft(10, 'DRAFT');
    const { result } = renderModalHook();

    act(() => result.current.handleMutationSuccess());

    expect(loadFeedbackDraft(10)).toBeNull();
    expect(result.current.isDraftRestored).toBe(false);
  });

  it('제출 완료된 피드백은 로컬 초안을 복원하지 않고 지운다', () => {
    mocks.attendance.feedbackStatus = 'COMPLETED';
    saveFeedbackDraft(10, 'DRAFT');

    const { result } = renderModalHook();

    expect(result.current.editorContent).toBe('SERVER');
    expect(loadFeedbackDraft(10)).toBeNull();
  });

  it('지각 제출 등 작성할 수 없는 상태는 초안을 저장하지 않는다', () => {
    mocks.attendance.status = 'LATE';
    const { result } = renderModalHook();

    act(() => result.current.setEditorContent('DRAFT'));

    expect(loadFeedbackDraft(10)).toBeNull();
  });
});
