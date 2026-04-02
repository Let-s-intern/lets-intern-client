'use client';

import {
  useGetLaunchAlertQuery,
  usePostMagnetApplicationMutation,
} from '@/api/magnet/magnet';
import { usePatchUser, useUserQuery } from '@/api/user/user';
import BaseModal from '@/common/modal/BaseModal';
import { useEffect, useState } from 'react';

interface NotiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  programTypeList?: string[];
  challengeTypeList?: string[];
}

const NotiModal = ({
  isOpen,
  onClose,
  onSuccess,
  programTypeList,
  challengeTypeList,
}: NotiModalProps) => {
  const { data: user } = useUserQuery({ enabled: isOpen });

  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setContactEmail(user.contactEmail ?? user.email ?? '');
    }
  }, [user, isOpen]);

  const { data: launchAlert, isError: isQueryError } = useGetLaunchAlertQuery({
    programTypeList,
    challengeTypeList,
    enabled: isOpen,
  });

  const { mutate: applyLaunchAlert, isPending } =
    usePostMagnetApplicationMutation();

  const { mutate: patchUser } = usePatchUser();

  const isAlreadyApplied = launchAlert?.appliedLaunchAlert ?? false;
  const isDisabled = isAlreadyApplied || isPending || isQueryError;

  const handleSubmit = () => {
    if (!launchAlert?.magnetId || isDisabled) return;

    const hasEmailChanged =
      contactEmail !== (user?.contactEmail ?? user?.email ?? '');

    if (hasEmailChanged) {
      patchUser({ contactEmail });
    }

    applyLaunchAlert(
      {
        magnetId: launchAlert.magnetId,
        body: { magnetAnswerList: [] },
      },
      {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="mx-5 max-w-[350px]">
      <div className="flex flex-col gap-5 p-5">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-small18 font-semibold">다음 기수 알림 신청</h2>
            <p className="text-xsmall14 text-neutral-35">
              다음 기수 오픈 시 아래 정보로 안내드릴게요.
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-40">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 회원 정보 */}
        <div className="flex flex-col rounded-sm bg-primary-5 p-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xsmall14 text-neutral-35">이름</span>
              <span className="text-xsmall16 font-normal">
                {user?.name ?? '-'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xsmall14 text-neutral-35">연락처</span>
              <span className="text-xsmall16 font-normal">
                {user?.phoneNum ?? '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xsmall14 text-neutral-35">이메일</span>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            disabled={isAlreadyApplied}
            className={`rounded-xxs border border-neutral-80 px-3 py-[9px] text-xsmall16 outline-none ${
              isAlreadyApplied
                ? 'cursor-not-allowed bg-neutral-90 text-neutral-40'
                : 'focus:border-primary'
            }`}
          />
        </div>

        {/* 안내 문구 */}
        <p className="text-xxsmall12 text-neutral-40">
          *출시 알림 신청 시 마케팅 정보 수신에 동의한 것으로 간주됩니다.
        </p>

        {/* 신청 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full rounded-xs py-3 text-xsmall16 ${
            isAlreadyApplied
              ? 'cursor-not-allowed bg-neutral-80 text-neutral-40'
              : 'bg-primary text-white'
          }`}
        >
          {isAlreadyApplied ? '이미 신청 완료' : '알림 신청하기'}
        </button>
      </div>
    </BaseModal>
  );
};

export default NotiModal;
