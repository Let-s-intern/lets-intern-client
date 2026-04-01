import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useMentorMenteeAttendanceQuery,
  MentorMenteeAttendanceQueryKey,
  useFeedbackAttendanceQuery,
  FeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { emptyEditorState } from '@/domain/admin/lexical/EditorApp';
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

  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    number | null
  >(null);
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
    useMentorMenteeAttendanceQuery({
      challengeId,
      missionId,
      enabled: isOpen && !!challengeId && !!missionId,
    });

  // Fetch selected mentee detail — staleTime: 0 ensures refetch on re-open
  const { data: feedbackData, dataUpdatedAt } = useFeedbackAttendanceQuery({
    challengeId,
    missionId,
    attendanceId: selectedAttendanceId ?? undefined,
  });

  // Current mentee from list
  const currentMentee = useMemo(
    () =>
      attendanceData?.attendanceList?.find(
        (a) => a.id === selectedAttendanceId,
      ),
    [attendanceData, selectedAttendanceId],
  );

  // Auto-select first mentee with a valid attendance when modal opens
  useEffect(() => {
    if (
      isOpen &&
      attendanceData?.attendanceList?.length &&
      !selectedAttendanceId
    ) {
      const first = attendanceData.attendanceList.find((a) => a.id != null);
      if (first?.id != null) setSelectedAttendanceId(first.id);
    }
  }, [isOpen, attendanceData, selectedAttendanceId]);

  // Sync editor content when selected mentee or feedbackData changes
  // dataUpdatedAt ensures we pick up refetched data even if the object reference is stable
  useEffect(() => {
    if (!selectedAttendanceId) return;
    const content =
      feedbackData?.attendanceDetailVo?.feedback || emptyEditorState;
    setEditorContent(content);
    setServerContent(content);
  }, [feedbackData, selectedAttendanceId, dataUpdatedAt]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAttendanceId(null);
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

  const handleSelectMentee = useCallback(
    async (attendanceId: number) => {
      if (attendanceId === selectedAttendanceId) return;
      const ok = await requestConfirm(mentorConfig.feedback.unsavedWarning);
      if (!ok) return;
      setSelectedAttendanceId(attendanceId);
    },
    [selectedAttendanceId, requestConfirm],
  );

  const handleClose = useCallback(async () => {
    const ok = await requestConfirm(mentorConfig.feedback.closeWarning);
    if (!ok) return;
    onClose();
  }, [requestConfirm, onClose]);

  const handleMutationSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        MentorMenteeAttendanceQueryKey,
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

  const isAbsent = currentMentee?.status === 'ABSENT';

  const attendanceList = attendanceData?.attendanceList ?? [];

  return {
    selectedAttendanceId,
    editorContent,
    setEditorContent,
    currentMentee,
    isReadOnly,
    isAbsent,
    attendanceList,
    handleSelectMentee,
    handleClose,
    handleMutationSuccess,
    editorKey: `${selectedAttendanceId}-${dataUpdatedAt}`,
    confirmModal,
    handleConfirmResult,
  };
}
