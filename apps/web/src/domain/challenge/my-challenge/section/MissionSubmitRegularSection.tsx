import { useParams } from 'next/navigation';
import BonusMissionModal from '../../bonus-mission/BonusMissionModal';
import DashboardCreateReviewModal from '../../dashboard/modal/DashboardCreateReviewModal';
import MobileReviewModal from '../../modal/MobileReviewModal';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import LinkInputSection from './LinkInputSection';
import { MissionSubmitListForm } from './mission-submit-list-form';
import { MissionReviewInputSection } from './MissionReviewInputSection';
import {
  type MissionSubmitRegularAttendanceInfo,
  useMissionSubmitRegular,
} from './mission-submit-regular/useMissionSubmitRegular';

interface MissionSubmitRegularSectionProps {
  className?: string;
  selectedMissionTh: number;
  missionId?: number;
  attendanceInfo?: MissionSubmitRegularAttendanceInfo | null;
  onRefreshMissionData?: () => void;
  onSubmitLastMission?: () => void;
}

const MissionSubmitRegularSection = ({
  className,
  selectedMissionTh,
  missionId,
  attendanceInfo,
  onRefreshMissionData,
  onSubmitLastMission,
}: MissionSubmitRegularSectionProps) => {
  const params = useParams<{ applicationId: string; programId: string }>();

  const {
    currentSelectedMission,
    bonusMission,
    missionType,
    setSelectedExperienceIds,
    setSelectedMission,
    textareaValue,
    isSubmitted,
    showToast,
    toastMessage,
    setShowToast,
    linkValue,
    isLinkVerified,
    isEditing,
    modalOpen,
    isBonusMissionModalOpen,
    setIsBonusMissionModalOpen,
    setModalOpen,
    isSubmitPeriodEnded,
    isResubmitBlocked,
    canSubmit,
    handleTextareaChange,
    handleSubmit,
    handleCancelEdit,
    handleSaveEdit,
    handleLinkChange,
    handleLinkVerified,
  } = useMissionSubmitRegular({
    selectedMissionTh,
    missionId,
    attendanceInfo,
    onRefreshMissionData,
    onSubmitLastMission,
  });

  return (
    <>
      <section className={className}>
        {!currentSelectedMission?.missionInfo?.missionType ? (
          <>
            <h2 className="text-small18 text-neutral-0 mb-6 font-bold">
              미션 제출하기
            </h2>

            <LinkInputSection
              disabled={(isSubmitted && !isEditing) || isResubmitBlocked}
              onLinkChange={handleLinkChange}
              onLinkVerified={handleLinkVerified}
              todayTh={selectedMissionTh}
              initialLink={linkValue}
              text={`미션 링크는 .notion.site 형식의 퍼블릭 링크만 입력 가능합니다.
          제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.`}
            />
          </>
        ) : (
          <MissionSubmitListForm
            onExperienceIdsChange={setSelectedExperienceIds}
            initialExperienceIds={attendanceInfo?.submittedUserExperienceIds}
            isSubmitted={isSubmitted}
            isEditing={isEditing}
            missionType={missionType}
          />
        )}
        <MissionReviewInputSection
          value={textareaValue}
          onChange={handleTextareaChange}
          disabled={(isSubmitted && !isEditing) || isResubmitBlocked}
        />

        {!isSubmitPeriodEnded && (
          <MissionSubmitButton
            isSubmitted={isSubmitted}
            hasContent={canSubmit}
            onButtonClick={handleSubmit}
            isEditing={isEditing}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            disabled={isResubmitBlocked}
          />
        )}
        <MissionToast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </section>

      {modalOpen && (
        <DashboardCreateReviewModal
          className="hidden md:flex"
          programId={params.programId ?? ''}
          applicationId={params.applicationId ?? ''}
          onClose={() => setModalOpen(false)}
        />
      )}

      <MobileReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      {bonusMission && (
        <BonusMissionModal
          isOpen={isBonusMissionModalOpen}
          onClose={() => setIsBonusMissionModalOpen(false)}
          onClickModal={() => {
            const { id, th } = bonusMission.missionInfo;
            if (!th) return;
            setSelectedMission(id, th);
          }}
        />
      )}
    </>
  );
};

export default MissionSubmitRegularSection;
