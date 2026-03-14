'use client';

import AlertModal from '@/common/alert/AlertModal';
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
  const isDownloadButton = actionButton?.label === 'PDF 다운로드' && hasConfirm;

  const downloadAction = useDownloadAction({
    applicationId: config.id,
    type: 'GUIDEBOOK',
    executeDownload: async () => {
      await actionButton?.onClick?.();
    },
    enabled: isDownloadButton,
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
            className="h-[85px] w-[113px] shrink-0 rounded-xs object-cover md:h-[119px] md:w-[158px]"
          />
        ) : (
          <div className="h-[85px] w-[113px] shrink-0 rounded-xs bg-neutral-80 md:h-[119px] md:w-[158px]" />
        )}

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex w-full flex-wrap items-center gap-2">
            <span
              className={twMerge(
                'rounded-xxs px-2 py-0.5 text-xxsmall12 font-normal',
                isUpcoming
                  ? 'border border-neutral-80 text-primary'
                  : 'bg-primary-10 text-primary',
              )}
            >
              {config.statusLabel}
            </span>
            <span className="text-xxsmall12 font-normal text-neutral-40">
              {config.categoryLabel}
            </span>
            <div className="hidden h-4 w-px bg-neutral-80 md:block" />
            <span className="text-xxsmall12 font-normal text-neutral-40">
              {config.dateLabel} {config.dateText}
            </span>
          </div>

          <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-12">
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                {config.title}
              </h3>
              <p className="text-xsmall14 text-neutral-20 md:line-clamp-2">
                {config.description}
              </p>
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

          {config.purchasePlanText && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span className="flex flex-row gap-1 text-xxsmall12 text-neutral-0">
                구매플랜
                <p className="text-xxsmall12 text-primary">
                  {config.purchasePlanText}
                </p>
              </span>
            </div>
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
      'rounded-xxs border px-3 py-1.5 text-xsmall14 font-normal transition-colors',
      disabled
        ? 'cursor-not-allowed border-neutral-60 bg-neutral-90 text-neutral-40'
        : 'border-primary text-primary hover:bg-primary/5',
      variant === 'mobile' ? 'w-full md:hidden' : 'hidden shrink-0 md:block',
    )}
  >
    {label}
  </button>
);
