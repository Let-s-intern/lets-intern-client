'use client';

import { MypageApplication, patchApplicationDownload } from '@/api/application';
import { getGuidebook } from '@/api/program';
import AlertModal from '@/common/alert/AlertModal';
import HybridLink from '@/common/HybridLink';
import {
  MypageApplicationCardConfig,
  toMypageApplicationCardConfig,
} from '@/domain/mypage/application/utils/applicationCardConfig';
import { useDownloadAction } from '@/hooks/useDownloadAction';
import { twMerge } from '@/lib/twMerge';
import { useRouter } from 'next/navigation';
import ActionButton from '../button/ActionButton';

interface NewApplicationCardProps {
  application: MypageApplication;
}

const NewApplicationCard = ({ application }: NewApplicationCardProps) => {
  const config = toMypageApplicationCardConfig(application);
  return <MypageApplicationCard config={config} />;
};

export default NewApplicationCard;

interface MypageApplicationCardProps {
  config: MypageApplicationCardConfig;
}

const MypageApplicationCard = ({ config }: MypageApplicationCardProps) => {
  const router = useRouter();
  const { actionButton } = config;
  const showActionButton = !!actionButton;
  const hasConfirm = !!actionButton?.confirm;
  const isDownloadButton = actionButton?.isDownload === true;
  const detailHref = getDetailHref(config);

  const downloadAction = useDownloadAction({
    applicationId: config.id,
    type: 'GUIDEBOOK',
    executeDownload: () =>
      downloadGuidebookAndTrack(config.id, config.programId),
  });

  const handleActionClick = () => {
    if (!actionButton || actionButton.disabled) return;

    if (isDownloadButton) {
      downloadAction.handleClick();
      return;
    }

    if (actionButton.href) {
      router.push(actionButton.href);
      return;
    }

    actionButton.onClick?.();
  };

  return (
    <div className="flex flex-col justify-between gap-5 rounded-xs p-0 md:flex-row md:items-start md:justify-start md:gap-4 md:border md:border-neutral-85 md:p-4">
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-4">
        <CardThumbnail
          href={detailHref}
          thumbnail={config.thumbnail}
          title={config.title}
          isCompleted={config.isCompleted}
        />

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-wrap items-center gap-2">
              {config.statusLabel && (
                <span
                  className={twMerge(
                    'rounded-xxs px-2 py-0.5 text-xxsmall12 font-normal',
                    (() => {
                      if (config.statusLabel === '참여예정') {
                        return 'border border-neutral-80 text-primary';
                      }
                      if (config.statusLabel === '참여종료') {
                        return 'bg-neutral-95 text-neutral-40';
                      }
                      return 'bg-primary-10 text-primary';
                    })(),
                  )}
                >
                  {config.statusLabel}
                </span>
              )}

              {config.categoryLabel && (
                <span className="text-xxsmall12 font-normal text-neutral-40">
                  {config.categoryLabel}
                </span>
              )}

              {config.dateText && (
                <>
                  <div className="hidden h-4 w-px bg-neutral-80 md:block" />
                  <p className="hidden text-xxsmall12 font-normal text-neutral-40 md:line-clamp-1 md:inline">
                    {config.dateLabel} {config.dateText}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                <HybridLink
                  href={detailHref}
                  className="line-clamp-2 hover:underline"
                >
                  {config.title}
                </HybridLink>
              </h3>
              {config.description && (
                <p className="line-clamp-2 text-xsmall14 text-neutral-20">
                  {config.description}
                </p>
              )}
            </div>

            {config.dateText && (
              <p className="line-clamp-1 text-xxsmall12 font-normal text-neutral-40 md:hidden">
                {config.dateLabel} {config.dateText}
              </p>
            )}
          </div>

          {config.purchasePlanText && (
            <div className="mt-2 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
              <span className="flex flex-row gap-1 text-xxsmall12 text-neutral-0">
                구매플랜
                <p className="text-xxsmall12 text-primary-dark">
                  {config.purchasePlanText}
                </p>
              </span>
            </div>
          )}
        </div>
      </div>

      {showActionButton && actionButton && (
        <>
          <ActionButton
            label={actionButton.label}
            disabled={actionButton.disabled}
            onClick={handleActionClick}
            variant="desktop"
          />
          <ActionButton
            label={actionButton.label}
            disabled={actionButton.disabled}
            onClick={handleActionClick}
            variant="mobile"
          />
        </>
      )}

      {hasConfirm && downloadAction.showConfirm && actionButton && (
        <AlertModal
          title={actionButton.confirm?.title ?? '확인'}
          confirmText={actionButton.confirm?.confirmText ?? '확인'}
          cancelText={actionButton.confirm?.cancelText ?? '취소'}
          onConfirm={() => downloadAction.handleConfirm()}
          onCancel={downloadAction.handleCancel}
        >
          {actionButton.confirm?.description}
        </AlertModal>
      )}
    </div>
  );
};

interface CardThumbnailProps {
  href?: string;
  thumbnail: string;
  title: string;
  isCompleted: boolean;
}

const CardThumbnail = ({
  href = '#',
  thumbnail,
  title,
  isCompleted,
}: CardThumbnailProps) => (
  <HybridLink
    href={href}
    className="h-[180px] w-full shrink-0 md:h-[119px] md:w-[158px]"
  >
    {thumbnail ? (
      <div className="relative h-full w-full">
        <img
          src={thumbnail}
          alt={title || '프로그램 썸네일'}
          className="h-[180px] w-full rounded-xs object-cover md:h-[119px] md:w-[158px]"
        />
        {isCompleted && (
          <div className="absolute inset-0 rounded-xs bg-black/40" />
        )}
      </div>
    ) : (
      <div className="h-[180px] w-full rounded-xs bg-neutral-80 md:h-[119px] md:w-[158px]" />
    )}
  </HybridLink>
);

interface ErrorWithStatus {
  response?: {
    status?: number;
  };
}

const downloadGuidebookAndTrack = async (
  applicationId: number,
  guidebookId: number,
): Promise<void> => {
  const guidebook = await getGuidebook(guidebookId);
  const contentFileUrl = guidebook.contentFileUrl ?? undefined;
  const contentUrl = guidebook.contentUrl ?? undefined;

  const urlToOpen = contentFileUrl || contentUrl;
  if (!urlToOpen) {
    return;
  }

  window.open(urlToOpen, '_blank', 'noopener,noreferrer');

  try {
    await patchApplicationDownload({
      applicationId,
      type: 'GUIDEBOOK',
    });
  } catch (error: unknown) {
    const status = (error as ErrorWithStatus).response?.status;
    if (status === 409) {
      return;
    }
    alert(
      '가이드북 다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    );
  }
};

const getDetailHref = (config: MypageApplicationCardConfig): string => {
  const { programTypeKey, programId } = config;

  if (!programId) return '#';

  if (programTypeKey === 'CHALLENGE') {
    return `/program/challenge/${programId}`;
  }

  if (programTypeKey === 'LIVE') {
    return `/program/live/${programId}`;
  }

  if (programTypeKey === 'GUIDEBOOK') {
    return `/program/guidebook/${programId}`;
  }

  return '#';
};
