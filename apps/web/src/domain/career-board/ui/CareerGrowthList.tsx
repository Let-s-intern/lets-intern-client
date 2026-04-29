'use client';

import AlertModal from '@/common/alert/AlertModal';
import { downloadContentAndTrack } from '@/domain/career-board/utils/contentDownload';
import { useDownloadAction } from '@/hooks/useDownloadAction';
import { twMerge } from '@/lib/twMerge';
import { useRouter } from 'next/navigation';
import type { CareerGrowthCardConfig } from '../utils/careerGrowthCard';

interface CareerGrowthListProps {
  items: CareerGrowthCardConfig[];
}

const CareerGrowthList = ({ items }: CareerGrowthListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((config) => (
        <CareerGrowthItemCard key={config.id} config={config} />
      ))}
    </div>
  );
};

export default CareerGrowthList;

interface CareerGrowthItemCardProps {
  config: CareerGrowthCardConfig;
}

const CareerGrowthItemCard = ({ config }: CareerGrowthItemCardProps) => {
  const router = useRouter();
  const { actionButton } = config;
  const showActionButton = !!actionButton;
  const hasConfirm = !!actionButton?.confirm;
  const isDownloadButton = actionButton?.isDownload === true;

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

  const isUpcoming = config.statusLabel === '참여예정';

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-4">
      <div className="flex w-full gap-3 md:flex-row md:gap-4">
        {config.thumbnail ? (
          <img
            src={config.thumbnail}
            alt={config.title}
            className="rounded-xs h-[85px] w-[113px] shrink-0 object-cover md:h-[119px] md:w-[158px]"
          />
        ) : (
          <div className="rounded-xs bg-neutral-80 h-[85px] w-[113px] shrink-0 md:h-[119px] md:w-[158px]" />
        )}
        <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-start md:gap-12">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex w-full flex-wrap items-center gap-2">
              <span
                className={twMerge(
                  'rounded-xxs text-xxsmall12 px-2 py-1 font-normal',
                  isUpcoming
                    ? 'border-neutral-80 text-primary border'
                    : 'bg-primary-10 text-primary',
                )}
              >
                {config.statusLabel}
              </span>
              <span className="text-xxsmall12 text-neutral-40 font-normal">
                {config.categoryLabel}
              </span>
              <div className="bg-neutral-80 hidden h-4 w-px md:block" />
              <span className="text-xxsmall12 text-neutral-40 font-normal">
                {config.dateLabel} {config.dateText}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-xsmall16 text-neutral-0 font-semibold">
                {config.title}
              </h3>
              {config.isHtmlDescription ? (
                <div
                  className="text-xsmall14 text-neutral-20 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: config.description }}
                />
              ) : (
                <p className="text-xsmall14 text-neutral-20 md:line-clamp-2">
                  {config.description}
                </p>
              )}
            </div>
            {config.purchasePlanText && (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="text-xxsmall12 text-neutral-0 flex flex-row gap-1">
                  구매플랜
                  <p className="text-xxsmall12 text-primary">
                    {config.purchasePlanText}
                  </p>
                </span>
              </div>
            )}
          </div>
          {showActionButton && (
            <ActionButton
              label={actionButton.label}
              disabled={actionButton.disabled}
              onClick={handleActionClick}
              variant="desktop"
            />
          )}
        </div>
      </div>
      {showActionButton && (
        <ActionButton
          label={actionButton.label}
          disabled={actionButton.disabled}
          onClick={handleActionClick}
          variant="mobile"
        />
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

interface ActionButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  variant: 'mobile' | 'desktop';
}

const ActionButton = ({
  label,
  disabled = false,
  onClick,
  variant,
}: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={twMerge(
      'rounded-xxs text-xsmall14 border px-3 py-1.5 font-normal transition-colors',
      disabled
        ? 'border-neutral-60 bg-neutral-90 text-neutral-40 cursor-not-allowed'
        : 'border-primary text-primary hover:bg-primary/5',
      variant === 'mobile' ? 'w-full md:hidden' : 'hidden shrink-0 md:block',
    )}
  >
    {label}
  </button>
);
