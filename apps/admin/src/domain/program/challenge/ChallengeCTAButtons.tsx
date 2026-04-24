import { useProgramApplicationQuery } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { ChallengeIdPrimitive } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotiToast from './NotiToast';
import {
  DesktopApplyCTA,
  MobileApplyCTA,
} from '@/common/button/ApplyCTA';
import NotiModal from '@/domain/program/program-detail/button/NotiModal';
import PricePlanBottomSheet from '../PricePlanBottomSheet';

const ChallengeCTAButtons = ({
  challenge,
  challengeId,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
}) => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
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

  /** 이미 신청했는지 체크하는 정보 */
  const isAlreadyApplied = application?.applied ?? false;

  const handleOpen = () => {
    if (!isLoggedIn) {
      // 현재 URL의 전체 경로와 쿼리 파라미터를 포함하여 로그인 후 리다이렉트 URL 생성
      // window.location.pathname을 사용해야 title이 포함된 전체 경로를 가져올 수 있음
      const currentPath = window.location.pathname;
      const currentSearch = searchParams.toString();
      const redirectUrl = currentSearch
        ? `${currentPath}?${currentSearch}`
        : currentPath;

      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);

      return;
    }

    if (!isOpen) {
      setIsOpen(true);
      return;
    }
  };

  return (
    <>
      {!isOpen && (
        <>
          <DesktopApplyCTA
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
      <NotiToast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      {/* 가격 플랜 선택 바텀 시트 */}
      <PricePlanBottomSheet
        isOpen={isOpen}
        challenge={challenge}
        challengeId={challengeId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ChallengeCTAButtons;
