'use client';

import {
  useApplicationVersionQuery,
  usePatchApplicationVersionMutation,
} from '@/api/application';
import AlertModal from '@/common/alert/AlertModal';
import BaseModal from '@/common/modal/BaseModal';
import dayjs from '@/lib/dayjs';
import { ApiError } from '@letscareer/api';
import { AxiosError } from 'axios';
import { useState } from 'react';

const FALLBACK_ERROR_MESSAGE =
  '버전을 변경하지 못했어요. 잠시 후 다시 시도해 주세요.';

/**
 * axios 인터셉터가 응답 에러를 ApiError 로 감싸 던진다. 네트워크 실패는 감싸지 않은
 * AxiosError 로 오므로 둘 다 본다. payment-input 페이지와 같은 방식이다.
 */
const getServerMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.serverMessage;
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message;
  }
  return undefined;
};

interface VersionChangeModalProps {
  applicationId: string;
  onClose: () => void;
}

/**
 * 대시보드에서 여는 버전 변경 모달.
 *
 * 마이페이지 신청 카드에도 같은 모양의 모달이 따로 있다. 도메인 사이에 UI 를 공유하지
 * 않으므로 한쪽을 고치면 다른 쪽도 함께 본다 (설계안 D6).
 */
const VersionChangeModal = ({
  applicationId,
  onClose,
}: VersionChangeModalProps) => {
  const { data: version, isLoading } =
    useApplicationVersionQuery(applicationId);
  const patchVersion = usePatchApplicationVersionMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const currentId = version?.currentVersion?.challengeVersionId ?? null;
  // 고르기 전에는 현재 버전이 선택돼 있다
  const selectedVersionId = selectedId ?? currentId;
  const canSubmit =
    selectedVersionId !== null &&
    selectedVersionId !== currentId &&
    !patchVersion.isPending;

  const deadlineText = version?.deadline
    ? dayjs(version.deadline).format('M월 D일 HH:mm')
    : null;

  const selectedTitle = version?.versionList.find(
    ({ challengeVersionId }) => challengeVersionId === selectedVersionId,
  )?.title;

  const handleSubmit = () => {
    setIsConfirmOpen(false);
    if (!canSubmit || selectedVersionId === null) return;

    setErrorMessage(null);
    patchVersion.mutate(
      { applicationId, challengeVersionId: selectedVersionId },
      {
        onSuccess: onClose,
        onError: (error) =>
          setErrorMessage(getServerMessage(error) ?? FALLBACK_ERROR_MESSAGE),
      },
    );
  };

  return (
    <>
      <BaseModal
        isOpen
        onClose={onClose}
        isLoading={isLoading}
        className="mx-4 max-w-[480px]"
      >
        <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-neutral-0 text-small18 font-semibold">
              버전 변경
            </h2>
            <p className="text-xsmall14 text-neutral-30">
              {deadlineText
                ? `버전은 한 번만 바꿀 수 있어요. ${deadlineText}까지 변경할 수 있어요.`
                : '버전은 한 번만 바꿀 수 있어요.'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {version?.versionList.map(({ challengeVersionId, title }) => {
              const isSelected = challengeVersionId === selectedVersionId;
              return (
                <label
                  key={challengeVersionId}
                  className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 ${
                    isSelected
                      ? 'border-primary bg-primary-5'
                      : 'border-neutral-85'
                  }`}
                >
                  <input
                    type="radio"
                    name="challengeVersion"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => setSelectedId(challengeVersionId)}
                  />
                  <span className="text-xsmall16 font-semibold">{title}</span>
                  {challengeVersionId === currentId && (
                    <span className="rounded-xxs text-xxsmall12 bg-primary-10 text-primary px-2 py-1">
                      현재
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {errorMessage && (
            <p className="text-xsmall14 text-system-error">{errorMessage}</p>
          )}
        </div>

        <div className="border-neutral-85 flex gap-3 border-t px-5 py-4">
          <button
            type="button"
            className="border-neutral-80 rounded-xs flex-1 border py-3 font-medium text-neutral-50"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-xs bg-primary disabled:bg-neutral-85 flex-1 py-3 font-medium text-white disabled:cursor-not-allowed disabled:text-neutral-50"
            disabled={!canSubmit}
            onClick={() => setIsConfirmOpen(true)}
          >
            변경하기
          </button>
        </div>
      </BaseModal>
      {/* 한 번만 바꿀 수 있어 되돌릴 수 없다는 것을 요청 전에 한 번 더 알린다 */}
      {isConfirmOpen && (
        <AlertModal
          className="m-5 md:m-0"
          title="버전을 변경할까요?"
          confirmText="변경"
          cancelText="취소"
          onConfirm={handleSubmit}
          onCancel={() => setIsConfirmOpen(false)}
        >
          <p className="text-xsmall14 text-neutral-20 whitespace-pre-line text-center">
            {`버전은 한 번만 바꿀 수 있어요.\n${selectedTitle ?? '선택한'} 버전으로 변경하면 다시 변경하기 어려워요.`}
          </p>
        </AlertModal>
      )}
    </>
  );
};

export default VersionChangeModal;
