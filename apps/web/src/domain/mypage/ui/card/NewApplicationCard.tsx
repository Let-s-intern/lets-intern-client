'use client';

import { MypageApplication } from '@/api/application';
import AlertModal from '@/common/alert/AlertModal';
import HybridLink from '@/common/HybridLink';
import { downloadContentAndTrack } from '@/domain/career-board/utils/contentDownload';
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

export const MypageApplicationCard = ({
  config,
}: MypageApplicationCardProps) => {
  const router = useRouter();
  const { actionButton } = config;
  const showActionButton = !!actionButton;
  const hasConfirm = !!actionButton?.confirm;
  const isDownloadButton = actionButton?.isDownload === true;
  const detailHref = getDetailHref(config);

  const downloadAction = useDownloadAction({
    isDownloaded: config.isDownloaded ?? false,
    executeDownload: () =>
      downloadContentAndTrack({
        applicationId: config.id,
        contentFileUrl: config.contentFileUrl,
        contentUrl: config.contentUrl,
        type: config.downloadType,
      }),
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
    <div className="rounded-xs md:border-neutral-85 flex flex-col justify-between gap-5 p-0 md:flex-row md:items-start md:justify-start md:gap-4 md:border md:p-4">
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
                    'rounded-xxs text-xxsmall12 px-2 py-1 font-normal',
                    (() => {
                      if (config.statusLabel === '참여예정') {
                        return 'border-neutral-80 text-primary border';
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
                <span className="text-xxsmall12 text-neutral-40 font-normal">
                  {config.categoryLabel}
                </span>
              )}

              {config.dateText && (
                <>
                  <div className="bg-neutral-80 hidden h-4 w-px md:block" />
                  <p className="text-xxsmall12 text-neutral-40 hidden font-normal md:line-clamp-1 md:inline">
                    {config.dateLabel} {config.dateText}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xsmall16 text-neutral-0 font-semibold">
                <HybridLink
                  href={detailHref}
                  className="line-clamp-2 hover:underline"
                >
                  {config.title}
                </HybridLink>
              </h3>
              {config.description &&
                (config.isHtmlDescription ? (
                  <div
                    className="text-xsmall14 text-neutral-20 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: config.description }}
                  />
                ) : (
                  <p className="text-xsmall14 text-neutral-20 line-clamp-2">
                    {config.description}
                  </p>
                ))}
            </div>

            {config.dateText && (
              <p className="text-xxsmall12 text-neutral-40 line-clamp-1 font-normal md:hidden">
                {config.dateLabel} {config.dateText}
              </p>
            )}
          </div>

          {config.purchasePlanText && (
            <div className="mt-2 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
              <span className="text-xxsmall12 text-neutral-0 flex flex-row gap-1">
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
          className="rounded-xs h-[180px] w-full object-cover md:h-[119px] md:w-[158px]"
        />
        {isCompleted && (
          <div className="rounded-xs absolute inset-0 bg-black/40" />
        )}
      </div>
    ) : (
      <div className="rounded-xs bg-neutral-80 h-[180px] w-full md:h-[119px] md:w-[158px]" />
    )}
  </HybridLink>
);

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

  if (programTypeKey === 'VOD') {
    return `/program/vod/${programId}`;
  }

  return '#';
};
