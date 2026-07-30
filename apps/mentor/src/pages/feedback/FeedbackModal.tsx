'use client';

import { Suspense, lazy, useEffect, useState } from 'react';

import BaseModal from '@/common/modal/BaseModal';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

import FeedbackActions from './ui/FeedbackActions';
import FeedbackComposer from './ui/FeedbackComposer';
import FeedbackHeader from './ui/FeedbackHeader';
import FeedbackLayout from './ui/FeedbackLayout';
import FeedbackMenteeNavigation from './ui/FeedbackMenteeNavigation';
import MenteeInfo from './ui/MenteeInfo';
import MenteeList from './ui/MenteeList';
import SidebarGuideLinks from './ui/SidebarGuideLinks';

import { useFeedbackModal } from './hooks/useFeedbackModal';
import { useFeedbackStatus } from './hooks/useFeedbackStatus';
import { useMenteeNavigation } from './hooks/useMenteeNavigation';
import { isNotionUrl } from './utils/notion';

// 열기 전 번들 로드 불필요 → 동적 임포트 (Vercel BP: bundle-dynamic-imports)
const MenteeExperienceModal = lazy(() => import('./ui/MenteeExperienceModal'));
const MenteeExperiencePanel = lazy(() => import('./ui/MenteeExperiencePanel'));
const MenteeLinkPanel = lazy(() => import('./ui/MenteeLinkPanel'));
const MenteePreQuestionPanel = lazy(
  () => import('./ui/MenteePreQuestionPanel'),
);

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
  initialAttendanceId?: number | null;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  challengeId,
  missionId,
  challengeTitle,
  missionTh,
  initialAttendanceId,
}: FeedbackModalProps) => {
  const {
    selectedIndex,
    selectedAttendanceId,
    editorContent,
    setEditorContent,
    currentMentee,
    preQuestion,
    isReadOnly,
    isAbsent,
    attendanceList,
    handleSelectByIndex,
    handleClose,
    handleMutationSuccess,
    editorKey,
    confirmModal,
    handleConfirmResult,
  } = useFeedbackModal({
    isOpen,
    onClose,
    challengeId,
    missionId,
    initialAttendanceId,
  });

  const { hasPrevMentee, hasNextMentee, handlePrevMentee, handleNextMentee } =
    useMenteeNavigation({
      listLength: attendanceList.length,
      selectedIndex,
      onSelectByIndex: handleSelectByIndex,
    });

  const { waitingCount, inProgressCount, completedCount } =
    useFeedbackStatus(attendanceList);

  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  // 왼쪽 사이드 패널 — 한번 열면 멘티를 전환해도 열린 상태 유지,
  // 표시 내용(경험정리/노션 임베드)은 현재 멘티의 제출 유형에 따라 자동 결정
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  // 오른쪽 사전 질문 패널 — 멘티를 전환해도 열린 상태 유지(내용만 교체)
  const [isPreQuestionPanelOpen, setIsPreQuestionPanelOpen] = useState(false);
  // "크게 보기" — 모달을 전체화면으로 넓힌다(상태는 FeedbackLayout 이 소유).
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 모달을 닫으면 화면 상태를 초기화한다(라이브 모달과 동일 사유 — 부모가 항상 마운트).
  useEffect(() => {
    if (isOpen) return;
    setIsFullscreen(false);
    setIsPreQuestionPanelOpen(false);
    setIsSidePanelOpen(false);
    setIsExperienceModalOpen(false);
  }, [isOpen]);

  const isMenteeSubmitted =
    currentMentee != null &&
    currentMentee.id != null &&
    currentMentee.status !== 'ABSENT';
  // 경험정리형 제출 멘티(제출됨·링크 없음)
  const hasExperienceSubmission =
    isMenteeSubmitted && !currentMentee.link && currentMentee.userId != null;
  // 노션 링크 제출 멘티
  const hasEmbeddableLink =
    isMenteeSubmitted && isNotionUrl(currentMentee.link);
  const showExperiencePanel = isSidePanelOpen && hasExperienceSubmission;
  const showLinkPanel = isSidePanelOpen && hasEmbeddableLink;
  const showLeftPanel = showExperiencePanel || showLinkPanel;
  // 사전 질문이 없는 멘티로 전환하면 패널을 띄우지 않는다(빈 패널 방지).
  const showPreQuestionPanel =
    isPreQuestionPanelOpen && !!preQuestion && preQuestion.trim().length > 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className={twMerge(
        feedbackModalDesign.modalContainer,
        // 패널이 실제로 열렸을 때만 모달을 넓혀 패널+에디터를 함께 표시
        (showLeftPanel || showPreQuestionPanel) &&
          feedbackModalDesign.modalContainerWide,
        showLeftPanel &&
          showPreQuestionPanel &&
          feedbackModalDesign.modalContainerWidest,
        // 전체화면은 위 폭 지정을 모두 덮어야 하므로 마지막에 합성한다.
        isFullscreen && feedbackModalDesign.modalContainerFullscreen,
      )}
    >
      <FeedbackHeader
        challengeTitle={challengeTitle}
        missionTh={missionTh}
        totalCount={attendanceList.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        // 크게 보기 중에는 닫기가 모달 종료가 아니라 기본 화면 복귀다(라이브와 동일).
        onClose={isFullscreen ? () => setIsFullscreen(false) : handleClose}
      />

      <FeedbackLayout
        isExpanded={isFullscreen}
        onExpandedChange={setIsFullscreen}
        sidebar={
          <div className="flex h-full flex-col gap-3">
            <div className="min-h-0 flex-1">
              <MenteeList
                attendanceList={attendanceList}
                selectedIndex={selectedIndex}
                onSelectByIndex={handleSelectByIndex}
              />
            </div>
            <SidebarGuideLinks
              labels={['자소서챌린지 피드백 가이드', '서면 피드백 가이드']}
            />
          </div>
        }
        navigation={
          <FeedbackMenteeNavigation
            onPrev={handlePrevMentee}
            onNext={handleNextMentee}
            hasPrev={hasPrevMentee}
            hasNext={hasNextMentee}
          />
        }
        navigationCompact={
          <FeedbackMenteeNavigation
            compact
            onPrev={handlePrevMentee}
            onNext={handleNextMentee}
            hasPrev={hasPrevMentee}
            hasNext={hasNextMentee}
          />
        }
        sidePanel={
          showExperiencePanel ? (
            <Suspense fallback={null}>
              <MenteeExperiencePanel
                onClose={() => setIsSidePanelOpen(false)}
                missionId={missionId}
                userId={currentMentee?.userId}
                menteeName={currentMentee?.name}
              />
            </Suspense>
          ) : showLinkPanel && currentMentee?.link ? (
            <Suspense fallback={null}>
              <MenteeLinkPanel
                onClose={() => setIsSidePanelOpen(false)}
                link={currentMentee.link}
                menteeName={currentMentee.name}
              />
            </Suspense>
          ) : undefined
        }
        rightPanel={
          showPreQuestionPanel ? (
            <Suspense fallback={null}>
              <MenteePreQuestionPanel
                onClose={() => setIsPreQuestionPanelOpen(false)}
                preQuestion={preQuestion}
                menteeName={currentMentee?.name}
              />
            </Suspense>
          ) : undefined
        }
        menteeInfo={(collapsed) => (
          <MenteeInfo
            mentee={currentMentee}
            challengeTitle={challengeTitle}
            collapsed={collapsed}
            preQuestion={preQuestion}
            onViewExperience={() => setIsExperienceModalOpen(true)}
            // 한번 더 클릭하면 닫힘(토글)
            onViewExperienceSide={() => setIsSidePanelOpen((prev) => !prev)}
            onViewLinkSide={() => setIsSidePanelOpen((prev) => !prev)}
            onViewPreQuestion={() => setIsPreQuestionPanelOpen((prev) => !prev)}
          />
        )}
        editor={
          // 라이브 모달과 동일한 작성 카드(라벨 + 에디터).
          <FeedbackComposer
            editorKey={editorKey}
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
            hint={isReadOnly ? '제출 완료되어 수정할 수 없습니다' : null}
            isAbsent={isAbsent}
            hasMentee={!!currentMentee}
          />
        }
        actions={
          <FeedbackActions
            attendanceId={selectedAttendanceId}
            editorContent={editorContent}
            feedbackStatus={currentMentee?.feedbackStatus ?? null}
            isAbsent={isAbsent}
            onSaveSuccess={handleMutationSuccess}
            onSubmitSuccess={handleMutationSuccess}
            onAlert={(opts) =>
              showAlert({ title: opts.title, variant: opts.variant })
            }
            onConfirm={(opts) =>
              showConfirm({
                title: opts.title,
                description: opts.description,
                onConfirm: opts.onConfirm,
              })
            }
          />
        }
      />

      {/* Dirty-check confirm modal */}
      <MentorAlertModal
        isOpen={confirmModal.isOpen}
        onClose={() => handleConfirmResult(false)}
        onConfirm={() => handleConfirmResult(true)}
        title="변경사항이 저장되지 않았습니다"
        description={confirmModal.message}
        confirmText="이동"
        cancelText="취소"
        variant="confirm"
      />

      {/* Alert/Confirm modal for save/submit */}
      <MentorAlertModal {...alertProps} />

      {/* 경험정리형 제출물 보기 서브모달 */}
      {isExperienceModalOpen && (
        <Suspense fallback={null}>
          <MenteeExperienceModal
            isOpen={isExperienceModalOpen}
            onClose={() => setIsExperienceModalOpen(false)}
            missionId={missionId}
            userId={currentMentee?.userId}
            menteeName={currentMentee?.name}
          />
        </Suspense>
      )}
    </BaseModal>
  );
};

export default FeedbackModal;
