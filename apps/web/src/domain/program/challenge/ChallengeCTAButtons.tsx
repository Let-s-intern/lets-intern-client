'use client';

import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import NotiToast from './NotiToast';
import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '../../../common/button/ApplyCTA';
import NotiModal from '@/domain/program/program-detail/button/NotiModal';
import PricePlanBottomSheet from '../PricePlanBottomSheet';
import { useOpenChallengeApply } from './hooks/useOpenChallengeApply';
import GuidebookCTAButtons from '../guidebook/ui/GuidebookCTAButtons';
import { useTemplateGuidebook } from './template-guidebook/useTemplateGuidebook';
import { useChallengeApplySheetStore } from './store/useChallengeApplySheetStore';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
  challengeVersionId,
  hasFollowPanel = false,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  challengeVersionId: number | null;
  /** 오른쪽 따라오는 신청 패널이 있는 상세. 1025px 이상에서는 하단 플로팅을 숨긴다 */
  hasFollowPanel?: boolean;
}) => {
  const { isLoggedIn } = useAuthStore();
  const { isOpen, plan, close, isTemplateMode } = useChallengeApplySheetStore();
  const { guidebook } = useTemplateGuidebook(challenge.challengeType);
  const openApply = useOpenChallengeApply();

  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { data: application, refetch } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  // 로그인 상태 변경 시 application 데이터 refetch
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  // 다른 챌린지로 이동하면 시트 상태를 비운다
  useEffect(
    () => () =>
      useChallengeApplySheetStore.setState({
        isOpen: false,
        plan: null,
        isTemplateMode: false,
      }),
    [],
  );

  // 하단 바에는 시작일만 보인다. 결제 금액은 오른쪽 신청 영역에 있다
  const desktopTitle = [
    challenge.title,
    challenge.startDate
      ? `${dayjs(challenge.startDate).format('M/D')} 시작`
      : null,
    plan === 'LIGHT' ? '템플릿' : '챌린지',
  ]
    .filter(Boolean)
    .join(' · ');

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const handleOpen = () => openApply();

  // 템플릿으로 혼자: 하단 바도 가이드북 제목·금액·결제로 바꾼다 (LC-3631)
  if (isTemplateMode && guidebook) {
    return (
      <GuidebookCTAButtons
        guidebookId={String(guidebook.id)}
        title={guidebook.title}
        price={guidebook.price - guidebook.discount}
      />
    );
  }

  return (
    <>
      {!isOpen && (
        <>
          <div className={hasFollowPanel ? 'min-[1025px]:hidden' : undefined}>
            <DesktopApplyCTA
              program={{
                ...challenge,
                title: desktopTitle,
                beginning: challenge.beginning
                  ? dayjs(challenge.beginning)
                  : null,
                deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
              }}
              onApplyClick={handleOpen}
              onNotiClick={() => setIsNotiOpen(true)}
              isAlreadyApplied={isAlreadyApplied}
            />
          </div>
          <MobileApplyCTA
            program={{
              ...challenge,
              beginning: challenge.beginning
                ? dayjs(challenge.beginning)
                : null,
              deadline: challenge.deadline ? dayjs(challenge.deadline) : null,
            }}
            onApplyClick={handleOpen}
            onNotiClick={() => setIsNotiOpen(true)}
            isAlreadyApplied={isAlreadyApplied}
          />
        </>
      )}
      {/* 출시 알림 신청 모달 */}
      <NotiModal
        isOpen={isNotiOpen}
        onClose={() => setIsNotiOpen(false)}
        onSuccess={() => setShowToast(true)}
        programTypeList={['CHALLENGE']}
        challengeTypeList={
          challenge.challengeType ? [challenge.challengeType] : undefined
        }
      />
      <NotiToast isVisible={showToast} onClose={() => setShowToast(false)} />
      {/* 가격 플랜 선택 바텀 시트 */}
      <PricePlanBottomSheet
        // 상단에서 고른 플랜으로 시트를 다시 초기화한다
        key={plan ?? 'default'}
        initialPlan={plan}
        isOpen={isOpen}
        challenge={challenge}
        challengeId={challengeId}
        challengeVersionId={challengeVersionId}
        onClose={close}
        showMembershipBenefit
      />
    </>
  );
};

export default ChallengeCTAButtons;
