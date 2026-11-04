'use client';

// usePassChallengeApply 컨트롤러의 바텀시트 + 완료 모달 렌더(챌린지 탭·캘린더 공용).
import AlertModal from '@/common/alert/AlertModal';
import PricePlanBottomSheet from '@/domain/program/PricePlanBottomSheet';
import type { PassChallengeApplyController } from './usePassChallengeApply';

const PassChallengeApplySheet = ({
  controller,
}: {
  controller: PassChallengeApplyController;
}) => {
  const {
    sheetProgramId,
    appliedChallenge,
    sheetVersion,
    completedTitle,
    closeSheet,
    clearCompleted,
    handleFreeApply,
  } = controller;

  return (
    <>
      {appliedChallenge && sheetProgramId != null && (
        <PricePlanBottomSheet
          challenge={appliedChallenge}
          challengeId={String(sheetProgramId)}
          challengeVersionId={sheetVersion?.challengeVersionId ?? null}
          isOpen
          onClose={closeSheet}
          showMembershipBenefit
          onFreeApply={handleFreeApply}
        />
      )}
      {completedTitle && (
        <AlertModal
          title="신청 완료"
          confirmText="확인"
          showCancel={false}
          onConfirm={clearCompleted}
        >
          <p className="text-neutral-30">
            [{completedTitle}] 신청이 완료되었어요. &apos;참여 중&apos;에서
            확인할 수 있어요.
          </p>
        </AlertModal>
      )}
    </>
  );
};

export default PassChallengeApplySheet;
