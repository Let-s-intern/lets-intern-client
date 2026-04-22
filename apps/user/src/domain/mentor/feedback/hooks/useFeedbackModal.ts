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
import mentorConfig from '@/domain/mentor/constants/config';

interface UseFeedbackModalParams {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
}

export function useFeedbackModal({
  isOpen,
  onClose,
  challengeId,
  missionId,
}: UseFeedbackModalParams) {
  const queryClient = useQueryClient();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [editorContent, setEditorContent] = useState(emptyEditorState);
  const [serverContent, setServerContent] = useState(emptyEditorState);

  // Promise-based confirm for dirty check
  const confirmResolveRef = useRef<((v: boolean) => void) | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });

  const isDirty = editorContent !== serverContent;

  // Fetch attendance list — /mentee endpoint filters by ChallengeApplication.challengeMentor
  const { data: attendanceData } =
    useMentorAttendanceQuery({
      challengeId,
      missionId,
      enabled: isOpen && !!challengeId && !!missionId,
    });

  const attendanceList = attendanceData?.attendanceList ?? [];

  // Current mentee from list
  const currentMentee = attendanceList[selectedIndex] ?? null;
  const selectedAttendanceId = currentMentee?.id ?? null;

  // Fetch selected mentee detail — only when mentee has submitted (id exists)
  const { data: feedbackData, dataUpdatedAt } = useFeedbackAttendanceQuery({
    challengeId,
    missionId,
    attendanceId: selectedAttendanceId ?? undefined,
  });

  // Auto-select first mentee when modal opens
  useEffect(() => {
    if (isOpen && attendanceList.length > 0 && selectedIndex === -1) {
      setSelectedIndex(0);
    }
  }, [isOpen, attendanceList.length, selectedIndex]);

  // Sync editor content when selected mentee or feedbackData changes
  useEffect(() => {
    if (selectedIndex < 0) return;
    if (!selectedAttendanceId) {
      // 미제출자: 에디터 초기화
      setEditorContent(emptyEditorState);
      setServerContent(emptyEditorState);
      return;
    }
    const content =
      feedbackData?.attendanceDetailVo?.feedback || emptyEditorState;
    setEditorContent(content);
    setServerContent(content);
  }, [feedbackData, selectedIndex, selectedAttendanceId, dataUpdatedAt]);

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

  const isReadOnly =
    currentMentee?.feedbackStatus === 'COMPLETED' ||
    currentMentee?.feedbackStatus === 'CONFIRMED';

  const isAbsent = currentMentee?.status === 'ABSENT' || currentMentee?.id == null;

  return {
    selectedIndex,
    selectedAttendanceId,
    editorContent,
    setEditorContent,
    currentMentee,
    isReadOnly,
    isAbsent,
    attendanceList,
    handleSelectByIndex,
    handleClose,
    handleMutationSuccess,
    editorKey: `${selectedIndex}-${dataUpdatedAt}`,
    confirmModal,
    handleConfirmResult,
  };
}
