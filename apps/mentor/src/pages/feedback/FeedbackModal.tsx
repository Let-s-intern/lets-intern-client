'use client';

import { Suspense, lazy, useState } from 'react';

import BaseModal from '@/common/modal/BaseModal';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

import FeedbackActions from './ui/FeedbackActions';
import FeedbackEditor from './ui/FeedbackEditor';
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
  const {
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
    editorKey,
    confirmModal,
    handleConfirmResult,
  } = useFeedbackModal({ isOpen, onClose, challengeId, missionId });

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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className={twMerge(
        feedbackModalDesign.modalContainer,
        // 제출물 패널이 실제로 열렸을 때만 모달을 넓혀 임베드+에디터를 함께 표시
        (showExperiencePanel || showLinkPanel) &&
          feedbackModalDesign.modalContainerWide,
      )}
    >
      <FeedbackHeader
        challengeTitle={challengeTitle}
        missionTh={missionTh}
        totalCount={attendanceList.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        onClose={handleClose}
      />

      <FeedbackLayout
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
        menteeInfo={(collapsed) => (
          <MenteeInfo
            mentee={currentMentee}
            challengeTitle={challengeTitle}
            collapsed={collapsed}
            onViewExperience={() => setIsExperienceModalOpen(true)}
            // 한번 더 클릭하면 닫힘(토글)
            onViewExperienceSide={() => setIsSidePanelOpen((prev) => !prev)}
            onViewLinkSide={() => setIsSidePanelOpen((prev) => !prev)}
          />
        )}
        editor={
          <FeedbackEditor
            key={editorKey}
            initialEditorStateJsonString={editorContent}
            onChange={setEditorContent}
            isReadOnly={isReadOnly}
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
