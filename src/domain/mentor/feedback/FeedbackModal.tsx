'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import BaseModal from '@/common/modal/BaseModal';
import {
  useMentorMissionFeedbackAttendanceQuery,
  MentorMissionFeedbackAttendanceQueryKey,
  useFeedbackAttendanceQuery,
  FeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';

import { emptyEditorState } from '@/domain/admin/lexical/EditorApp';

import StatusIndicator from './StatusIndicator';
import MenteeList from './MenteeList';
import MenteeInfo from './MenteeInfo';
import FeedbackEditor from './FeedbackEditor';
import FeedbackActions from './FeedbackActions';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  challengeId,
  missionId,
  challengeTitle,
  missionTh,
}: FeedbackModalProps) => {
  const queryClient = useQueryClient();

  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    number | null
  >(null);
  const [editorContent, setEditorContent] = useState(emptyEditorState);
  const [serverContent, setServerContent] = useState(emptyEditorState);

  const isDirty = editorContent !== serverContent;

  // Fetch attendance list for auto-select
  const { data: attendanceData } =
    useMentorMissionFeedbackAttendanceQuery({
      challengeId,
      missionId,
      enabled: isOpen && !!challengeId && !!missionId,
    });

  // Fetch selected mentee detail
  const { data: feedbackData } = useFeedbackAttendanceQuery({
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

  // Auto-select first mentee when modal opens
  useEffect(() => {
    if (isOpen && attendanceData?.attendanceList?.length && !selectedAttendanceId) {
      setSelectedAttendanceId(attendanceData.attendanceList[0].id);
    }
  }, [isOpen, attendanceData, selectedAttendanceId]);

  // Sync editor content when feedbackData changes
  useEffect(() => {
    const content =
      feedbackData?.attendanceDetailVo?.feedback || emptyEditorState;
    setEditorContent(content);
    setServerContent(content);
  }, [feedbackData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAttendanceId(null);
      setEditorContent(emptyEditorState);
      setServerContent(emptyEditorState);
    }
  }, [isOpen]);

  const confirmIfDirty = useCallback(
    (message: string): boolean => {
      if (!isDirty) return true;
      return window.confirm(message);
    },
    [isDirty],
  );

  const handleSelectMentee = useCallback(
    (attendanceId: number) => {
      if (attendanceId === selectedAttendanceId) return;
      if (
        !confirmIfDirty(
          '저장하지 않은 변경사항이 있습니다. 다른 멘티로 이동하시겠습니까?',
        )
      ) {
        return;
      }
      setSelectedAttendanceId(attendanceId);
    },
    [selectedAttendanceId, confirmIfDirty],
  );

  const handleClose = useCallback(() => {
    if (
      !confirmIfDirty(
        '저장하지 않은 변경사항이 있습니다. 모달을 닫으시겠습니까?',
      )
    ) {
      return;
    }
    onClose();
  }, [confirmIfDirty, onClose]);

  const handleMutationSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [MentorMissionFeedbackAttendanceQueryKey, challengeId, missionId],
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 h-[700px] w-[1060px] max-w-full"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-4 top-4 z-10 text-xl font-bold text-gray-500 hover:text-gray-800"
        aria-label="닫기"
      >
        X
      </button>

      <div className="flex h-full">
        {/* Left panel: 30% mentee list */}
        <div className="w-[30%] shrink-0">
          <MenteeList
            challengeId={challengeId}
            missionId={missionId}
            challengeTitle={challengeTitle}
            missionTh={missionTh}
            selectedAttendanceId={selectedAttendanceId}
            onSelectMentee={handleSelectMentee}
          />
        </div>

        {/* Right panel: 70% */}
        <div className="flex w-[70%] flex-col px-6 py-4">
          {/* Status indicator */}
          <StatusIndicator
            feedbackStatus={currentMentee?.feedbackStatus ?? null}
          />

          {/* Mentee info */}
          <MenteeInfo
            challengeId={challengeId}
            missionId={missionId}
            attendanceId={selectedAttendanceId}
            challengeTitle={challengeTitle}
            missionLink={currentMentee?.link}
          />

          {/* Feedback editor */}
          <FeedbackEditor
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            readOnly={isReadOnly}
          />

          {/* Actions */}
          <FeedbackActions
            attendanceId={selectedAttendanceId}
            editorContent={editorContent}
            missionLink={currentMentee?.link ?? null}
            feedbackStatus={currentMentee?.feedbackStatus ?? null}
            onSaveSuccess={handleMutationSuccess}
            onSubmitSuccess={handleMutationSuccess}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default FeedbackModal;
