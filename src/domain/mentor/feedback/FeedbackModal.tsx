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

  const currentMenteeIndex = useMemo(
    () =>
      attendanceData?.attendanceList?.findIndex(
        (a) => a.id === selectedAttendanceId,
      ) ?? -1,
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

  const handlePrevMentee = useMemo(() => {
    if (currentMenteeIndex <= 0) return undefined;
    const prevId = attendanceData?.attendanceList?.[currentMenteeIndex - 1]?.id;
    return prevId ? () => handleSelectMentee(prevId) : undefined;
  }, [currentMenteeIndex, attendanceData, handleSelectMentee]);

  const handleNextMentee = useMemo(() => {
    const list = attendanceData?.attendanceList;
    if (!list || currentMenteeIndex >= list.length - 1) return undefined;
    const nextId = list[currentMenteeIndex + 1]?.id;
    return nextId ? () => handleSelectMentee(nextId) : undefined;
  }, [currentMenteeIndex, attendanceData, handleSelectMentee]);

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
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        {/* Left */}
        <div className="w-1/3 text-sm font-semibold text-gray-800">
          {challengeTitle ?? '챌린지'} · {missionTh ?? ''}차 피드백
        </div>
        
        {/* Center */}
        <div className="flex w-1/3 justify-center items-center gap-3 text-sm">
          <span className="font-medium text-gray-700">
            총 {attendanceData?.attendanceList?.length ?? 0}명
          </span>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-red-500">
              시작 전 {attendanceData?.attendanceList?.filter((a) => a.feedbackStatus === 'WAITING' || !a.feedbackStatus).length ?? 0}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-amber-500">
              진행 중 {attendanceData?.attendanceList?.filter((a) => a.feedbackStatus === 'IN_PROGRESS').length ?? 0}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-green-600">
              완료 {attendanceData?.attendanceList?.filter((a) => a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED').length ?? 0}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex w-1/3 justify-end items-center gap-6">
          <a
            href="https://letsintern.notion.site/3c6c138f7aeb4a6ebec397cf1e29e9cb" // Example guide link, could be passed or empty for now
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
          >
            피드백 가이드 라인
          </a>
          <button
            type="button"
            onClick={handleClose}
            className="text-xl font-bold text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            X
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100% - 49px)' }}>
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
            onPrevMentee={handlePrevMentee}
            onNextMentee={handleNextMentee}
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
