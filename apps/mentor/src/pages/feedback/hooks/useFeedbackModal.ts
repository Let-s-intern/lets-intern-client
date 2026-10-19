import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useFeedbackAttendanceQuery,
  FeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import {
  useMentorAttendanceQuery,
  getMentorAttendanceQueryKey,
} from './useMentorAttendanceQuery';
import { emptyEditorState } from '@/common/lexical/EditorApp';
import mentorConfig from '@/constants/config';
import {
  clearFeedbackDraft,
  loadFeedbackDraft,
  saveFeedbackDraft,
} from '../utils/feedbackLocalDraft';
import {
  canWriteWrittenFeedback,
  resolveWrittenSubmissionState,
} from '../utils/writtenSubmissionState';

interface UseFeedbackModalParams {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
  /** 진입 시 초기 선택할 멘티의 출석 id (없으면 첫 멘티). */
  initialAttendanceId?: number | null;
}

export function useFeedbackModal({
  isOpen,
  onClose,
  challengeId,
  missionId,
  initialAttendanceId,
}: UseFeedbackModalParams) {
  const queryClient = useQueryClient();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [editorContent, setEditorContent] = useState(emptyEditorState);
  const [serverContent, setServerContent] = useState(emptyEditorState);
  // 로컬 초안으로 복원했는지. 에디터는 마운트 때만 초기값을 읽으므로 횟수를 key 에 섞어 재마운트한다.
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [draftRestoreCount, setDraftRestoreCount] = useState(0);

  // Promise-based confirm for dirty check
  const confirmResolveRef = useRef<((v: boolean) => void) | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });

  const isDirty = editorContent !== serverContent;

  // Fetch attendance list — /mentee endpoint filters by ChallengeApplication.challengeMentor
  const { data: attendanceData } = useMentorAttendanceQuery({
    challengeId,
    missionId,
    enabled: isOpen && !!challengeId && !!missionId,
  });

  // 초기 선택 effect가 배열 참조를 dep 으로 쓰므로 안정적인 참조로 메모.
  const attendanceList = useMemo(
    () => attendanceData?.attendanceList ?? [],
    [attendanceData],
  );

  // Current mentee from list
  const currentMentee = attendanceList[selectedIndex] ?? null;
  const selectedAttendanceId = currentMentee?.id ?? null;

  const isReadOnly =
    currentMentee?.feedbackStatus === 'COMPLETED' ||
    currentMentee?.feedbackStatus === 'CONFIRMED';

  // 제출 상태(미제출/지각 제출/제출) — 표기와 작성 가능 여부의 단일 판정.
  const submissionState = resolveWrittenSubmissionState({
    status: currentMentee?.status,
    attendanceId: currentMentee?.id,
  });

  // 로컬 초안은 실제로 쓸 수 있는 피드백에만 둔다.
  const canWriteDraft = !isReadOnly && canWriteWrittenFeedback(submissionState);

  // Fetch selected mentee detail — only when mentee has submitted (id exists)
  const { data: feedbackData, dataUpdatedAt } = useFeedbackAttendanceQuery({
    challengeId,
    missionId,
    attendanceId: selectedAttendanceId ?? undefined,
  });

  // 진입 시 초기 선택: 클릭한 멘티(initialAttendanceId)를 우선, 못 찾으면 첫 멘티.
  useEffect(() => {
    if (isOpen && attendanceList.length > 0 && selectedIndex === -1) {
      const targetIndex =
        initialAttendanceId != null
          ? attendanceList.findIndex((a) => a.id === initialAttendanceId)
          : -1;
      setSelectedIndex(targetIndex >= 0 ? targetIndex : 0);
    }
  }, [isOpen, attendanceList, selectedIndex, initialAttendanceId]);

  // Sync editor content when selected mentee or feedbackData changes
  useEffect(() => {
    if (selectedIndex < 0) return;
    if (!selectedAttendanceId) {
      // 미제출자: 에디터 초기화
      setEditorContent(emptyEditorState);
      setServerContent(emptyEditorState);
      setIsDraftRestored(false);
      return;
    }
    const content =
      feedbackData?.attendanceDetailVo?.feedback || emptyEditorState;
    setServerContent(content);

    // 저장하지 않은 로컬 초안이 서버 내용과 다르면 그것으로 복원한다.
    const draft = loadFeedbackDraft(selectedAttendanceId);
    if (draft && canWriteDraft && draft !== content) {
      setEditorContent(draft);
      setIsDraftRestored(true);
      setDraftRestoreCount((count) => count + 1);
      return;
    }
    // 쓸 수 없는 상태이거나 서버와 같아진 초안은 남겨둘 이유가 없다.
    if (draft) clearFeedbackDraft(selectedAttendanceId);
    setEditorContent(content);
    setIsDraftRestored(false);
  }, [
    feedbackData,
    selectedIndex,
    selectedAttendanceId,
    dataUpdatedAt,
    canWriteDraft,
  ]);

  // 에디터 입력 — 서버 임시저장 전에 창이 닫혀도 남도록 로컬에도 보관한다.
  const handleEditorChange = useCallback(
    (content: string) => {
      setEditorContent(content);
      if (!selectedAttendanceId || !canWriteDraft) return;
      if (content === serverContent) clearFeedbackDraft(selectedAttendanceId);
      else saveFeedbackDraft(selectedAttendanceId, content);
    },
    [selectedAttendanceId, canWriteDraft, serverContent],
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1);
      setEditorContent(emptyEditorState);
      setServerContent(emptyEditorState);
    }
  }, [isOpen]);

  const requestConfirm = useCallback(
    (message: string): Promise<boolean> => {
      if (!isDirty) return Promise.resolve(true);
      return new Promise((resolve) => {
        confirmResolveRef.current = resolve;
        setConfirmModal({ isOpen: true, message });
      });
    },
    [isDirty],
  );

  const handleConfirmResult = useCallback((result: boolean) => {
    confirmResolveRef.current?.(result);
    confirmResolveRef.current = null;
    setConfirmModal({ isOpen: false, message: '' });
  }, []);

  const handleSelectByIndex = useCallback(
    async (index: number) => {
      if (index === selectedIndex) return;
      const ok = await requestConfirm(mentorConfig.feedback.unsavedWarning);
      if (!ok) return;
      setSelectedIndex(index);
    },
    [selectedIndex, requestConfirm],
  );

  const handleClose = useCallback(async () => {
    const ok = await requestConfirm(mentorConfig.feedback.closeWarning);
    if (!ok) return;
    onClose();
  }, [requestConfirm, onClose]);

  const handleMutationSuccess = useCallback(() => {
    // 서버에 저장됐으니 로컬 초안은 낡은 것이 된다.
    if (selectedAttendanceId) clearFeedbackDraft(selectedAttendanceId);
    setIsDraftRestored(false);
    queryClient.invalidateQueries({
      queryKey: [
        getMentorAttendanceQueryKey(challengeId),
        challengeId,
        missionId,
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        FeedbackAttendanceQueryKey,
        challengeId,
        missionId,
        selectedAttendanceId,
      ],
    });
  }, [queryClient, challengeId, missionId, selectedAttendanceId]);

  // 멘티 사전 질문 — 서면 상세 응답(attendanceDetailVo)에서 파생. BE 미배포 시 null.
  const preQuestion = feedbackData?.attendanceDetailVo?.preQuestion ?? null;

  return {
    selectedIndex,
    selectedAttendanceId,
    editorContent,
    setEditorContent: handleEditorChange,
    isDraftRestored,
    currentMentee,
    preQuestion,
    isReadOnly,
    submissionState,
    attendanceList,
    handleSelectByIndex,
    handleClose,
    handleMutationSuccess,
    editorKey: `${selectedIndex}-${dataUpdatedAt}-${draftRestoreCount}`,
    confirmModal,
    handleConfirmResult,
  };
}
