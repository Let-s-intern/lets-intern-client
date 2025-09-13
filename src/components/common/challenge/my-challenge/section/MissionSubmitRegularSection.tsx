import { usePatchAttendance, useSubmitMission } from '@/api/attendance';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { AttendanceResult, AttendanceStatus } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BonusMissionModal from '../../BonusMissionModal';
import DashboardCreateReviewModal from '../../dashboard/modal/DashboardCreateReviewModal';
import LinkChangeConfirmationModal from '../../LinkChangeConfirmationModal';
import MissionSubmitButton from '../mission/MissionSubmitButton';
import MissionToast from '../mission/MissionToast';
import LinkInputSection from './LinkInputSection';

interface MissionSubmitRegularSectionProps {
  className?: string;
  selectedMissionTh: number;
  missionId?: number;
  attendanceInfo?: {
    link: string | null;
    status: AttendanceStatus | null;
    id: number | null;
    submitted: boolean | null;
    comments: string | null;
    result: AttendanceResult | null;
    review?: string | null;
  } | null;
  onRefreshMissionData?: () => void; // 미션 데이터 새로고침 callback
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
  const params = useParams();

  const { selectedMissionId, setSelectedMission } = useMissionStore();
  const { schedules, currentChallenge, refetchSchedules } =
    useCurrentChallenge();

  // 챌린지 종료 + 2일
  const isSubmitPeriodEnded =
    dayjs(currentChallenge?.endDate).add(2, 'day').isBefore(dayjs()) ?? true;

  // missionTh를 기준으로 마지막 정규 미션 찾기 (보너스 미션 제외)
  const regularMissions = schedules.filter(
    (schedule) => schedule.missionInfo.th !== BONUS_MISSION_TH,
  );
  const lastRegularMission = regularMissions[regularMissions.length - 1];
  const lastRegularMissionId = lastRegularMission?.missionInfo.id;
  const isLastRegularMissionSubmit = lastRegularMissionId === selectedMissionId;

  const [textareaValue, setTextareaValue] = useState(
    attendanceInfo?.review || '',
  );
  const [isSubmitted, setIsSubmitted] = useState(
    attendanceInfo?.submitted === true,
  );
  const [showToast, setShowToast] = useState(false);
  const [linkValue, setLinkValue] = useState(attendanceInfo?.link || '');
  const [isLinkVerified, setIsLinkVerified] = useState(!!attendanceInfo?.link);
  const [isEditing, setIsEditing] = useState(false);
  // 링크 변경 확인 모달 오픈 상태
  const [isLinkChangeModalOpen, setIsLinkChangeModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBonusMissionModalOpen, setIsBonusMissionModalOpen] = useState(false);

  const submitMission = useSubmitMission();
  const patchAttendance = usePatchAttendance();

  const bonusMission = schedules.find(
    (item) => item.missionInfo.th === BONUS_MISSION_TH,
  );

  // attendanceInfo가 변경될 때마다 상태 업데이트 (다른 미션인 경우에만)
  useEffect(() => {
    const reviewValue = attendanceInfo?.review || '';
    const linkValue = attendanceInfo?.link || '';

    setTextareaValue(reviewValue);
    setIsSubmitted(attendanceInfo?.submitted === true);
    setLinkValue(linkValue);
    setIsLinkVerified(!!linkValue);
    setIsEditing(false); // 새 미션 선택 시 수정 모드 해제
  }, [attendanceInfo]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleLinkChange = (link: string) => {
    setLinkValue(link);
  };

  const handleLinkVerified = (isVerified: boolean) => {
    setIsLinkVerified(isVerified);
  };

  const isResubmitBlocked =
    attendanceInfo?.result === 'PASS' ||
    attendanceInfo?.result === 'FINAL_WRONG' ||
    (attendanceInfo?.result === 'WAITING' &&
      (attendanceInfo?.status === 'LATE' ||
        attendanceInfo?.status === 'UPDATED'));

  const handleSubmit = async () => {
    if (isResubmitBlocked) return;

    if (isSubmitted) {
      // 이미 제출된 미션 → 수정 모드로 전환
      setIsEditing(true);
      return;
    }

    if (!missionId || missionId === 0) return;

    // 새 미션 제출
    try {
      await submitMission.mutateAsync({
        missionId,
        link: linkValue,
        review: textareaValue,
      });
      await refetchSchedules?.();
      setIsSubmitted(true);
      setShowToast(true);
      // 미션 데이터 새로고침
      onRefreshMissionData?.();
      onSubmitLastMission?.();
      handleOpenBonusMissionModalAtSubmission(selectedMissionTh);
      if (isLastRegularMissionSubmit && !attendanceInfo?.submitted) {
        setModalOpen(true);
      }
    } catch {
      // 에러 처리 로직 추가 가능
    }
  };

  const handleCancelEdit = () => {
    const isChanged =
      attendanceInfo?.link !== linkValue ||
      attendanceInfo.review !== textareaValue;
    // 입력값이 이전 링크와 다르면 모달 띄우기
    if (isChanged) {
      setIsLinkChangeModalOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!attendanceInfo?.id) {
      return;
    }

    try {
      await patchAttendance.mutateAsync({
        attendanceId: attendanceInfo.id,
        link: linkValue,
        review: textareaValue,
      });
      await refetchSchedules?.();
      setIsEditing(false);
      setShowToast(true);
      // 미션 데이터 새로고침
      onRefreshMissionData?.();
    } catch {
      // 에러 처리 로직 추가 가능
    }
  };

  // 제출 버튼 활성화 조건: 링크 확인 완료 + 미션 소감 입력
  const canSubmit = isLinkVerified && textareaValue.trim().length > 0;

  const handleOpenBonusMissionModalAtSubmission = (
    currentSubmissionMissionTh: number,
  ) => {
    if (!bonusMission) return;
    // th는 0부터 시작
    const totalMissionCount = schedules.length;
    const isFirstThirdMission =
      Math.floor(totalMissionCount * (1 / 3)) === currentSubmissionMissionTh; // 전체 미션 중 1/3회차
    const isSecondThirdMission =
      Math.floor(totalMissionCount * (2 / 3)) === currentSubmissionMissionTh; // 전체 미션 중 2/3회차

    if (isFirstThirdMission || isSecondThirdMission) {
      setIsBonusMissionModalOpen(true);
    }
  };

  return (
    <>
      <section className={className}>
        <h2 className="mb-6 text-small18 font-bold text-neutral-0">
          미션 제출하기
        </h2>

        {/* 링크 섹션 */}
        <LinkInputSection
          disabled={(isSubmitted && !isEditing) || isResubmitBlocked}
          onLinkChange={handleLinkChange}
          onLinkVerified={handleLinkVerified}
          todayTh={selectedMissionTh}
          initialLink={linkValue}
          text={`미션 링크는 .notion.site 형식의 퍼블릭 링크만 입력 가능합니다.
          제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.`}
        />

        {/* 미션 소감 */}
        <section>
          <div className="mb-1.5 mt-7">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-xsmall16 font-semibold text-neutral-0">
                미션 소감
              </span>
            </div>
          </div>
          <textarea
            className={clsx(
              'w-full resize-none rounded-xxs border border-neutral-80 bg-white',
              'px-3 py-2 text-xsmall14 text-neutral-0 placeholder:text-neutral-50 md:text-xsmall16',
              'min-h-[144px] outline-none focus:border-primary',
              'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
            )}
            placeholder={`오늘의 미션은 어떠셨나요?
새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
            value={textareaValue}
            onChange={handleTextareaChange}
            disabled={(isSubmitted && !isEditing) || isResubmitBlocked} // 재제출 차단 조건 추가
          />
        </section>

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
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </section>

      <LinkChangeConfirmationModal
        isOpen={isLinkChangeModalOpen}
        onClose={() => setIsLinkChangeModalOpen(false)}
        onClickCancel={() => setIsLinkChangeModalOpen(false)}
        onClickConfirm={() => {
          setLinkValue(attendanceInfo?.link ?? '');
          setTextareaValue(attendanceInfo?.review || '');
          setIsEditing(false);
          setIsLinkVerified(false);
          setIsLinkChangeModalOpen(false);
        }}
      />

      {modalOpen && (
        <DashboardCreateReviewModal
          programId={params.programId ?? ''}
          applicationId={params.applicationId ?? ''}
          onClose={() => setModalOpen(false)}
        />
      )}
      {/* 보너스 미션 모달 */}
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
