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

  const attendanceList = attendanceData?.attendanceList ?? [];
  const waitingCount = attendanceList.filter(
    (a) => a.feedbackStatus === 'WAITING' || !a.feedbackStatus,
  ).length;
  const inProgressCount = attendanceList.filter(
    (a) => a.feedbackStatus === 'IN_PROGRESS',
  ).length;
  const completedCount = attendanceList.filter(
    (a) => a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED',
  ).length;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="mx-4 h-[720px] w-[960px] max-w-full rounded-3xl"
    >
      {/* Header bar */}
      <div className="flex items-center gap-4 bg-sky-50 px-6 pb-3 pt-6">
        <div className="flex flex-1 items-center justify-between">
          {/* Left: title */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-700">
              {challengeTitle ?? '챌린지'} · {missionTh ?? ''}차 피드백
            </span>
          </div>

          {/* Center: stats */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1 px-1">
              <span className="text-xs font-medium text-neutral-700">총</span>
              <span className="text-xs font-medium text-neutral-700">
                {attendanceList.length}명
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-red-500">시작 전</span>
              <span className="text-xs font-medium text-red-500">
                {waitingCount}
              </span>
              <span className="text-xs font-medium text-neutral-700">·</span>
              <span className="text-xs font-medium text-neutral-700">진행 중</span>
              <span className="text-xs font-medium text-neutral-700">
                {inProgressCount}
              </span>
              <span className="text-xs font-medium text-neutral-700">·</span>
              <span className="text-xs font-medium text-neutral-700">완료</span>
              <span className="text-xs font-medium text-neutral-700">
                {completedCount}
              </span>
            </div>
          </div>

          {/* Right: guide button */}
          <a
            href="https://letsintern.notion.site/3c6c138f7aeb4a6ebec397cf1e29e9cb"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700"
          >
            피드백 가이드 라인
          </a>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="p-1 text-neutral-500 hover:text-neutral-700"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 px-10 pb-10 pt-2.5" style={{ height: 'calc(100% - 72px)' }}>
        {/* Left panel: mentee list */}
        <div className="flex w-60 shrink-0 flex-col">
          <MenteeList
            challengeId={challengeId}
            missionId={missionId}
            selectedAttendanceId={selectedAttendanceId}
            onSelectMentee={handleSelectMentee}
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col gap-5 pl-5">
          {/* Navigation + Mentee info */}
          <div className="flex flex-col">
            {/* Navigation */}
            <div className="flex items-center justify-between py-2">
              <button
                type="button"
                onClick={handlePrevMentee}
                disabled={!handlePrevMentee}
                className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:invisible"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 9L10 13L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                이전 멘티
              </button>
              <button
                type="button"
                onClick={handleNextMentee}
                disabled={!handleNextMentee}
                className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:invisible"
              >
                다음 멘티
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 9L14 13L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Mentee info card */}
            <MenteeInfo
              challengeId={challengeId}
              missionId={missionId}
              attendanceId={selectedAttendanceId}
              challengeTitle={challengeTitle}
            />
          </div>

          {/* Feedback editor */}
          <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
            <FeedbackEditor
              initialEditorStateJsonString={editorContent}
              onChange={setEditorContent}
              readOnly={isReadOnly}
            />
          </div>

          {/* Actions */}
          <FeedbackActions
            attendanceId={selectedAttendanceId}
            editorContent={editorContent}
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
