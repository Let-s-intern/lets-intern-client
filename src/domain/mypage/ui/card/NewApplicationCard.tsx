import { MypageApplication, patchApplicationDownload } from '@/api/application';
import { getGuidebook } from '@/api/program';
import HybridLink from '@/common/HybridLink';
import { getReportThumbnail } from '@/domain/mypage/credit/CreditListItem';
import { twMerge } from '@/lib/twMerge';
import {
  challengePricePlanToText,
  newProgramTypeToText,
} from '@/utils/convert';
import ActionButton from '../button/ActionButton';

interface NewApplicationCardProps {
  application: MypageApplication;
}

const NewApplicationCard = ({ application }: NewApplicationCardProps) => {
  const {
    id,
    programStatusType,
    programType,
    programThumbnail,
    reportType,
    programTitle,
    programShortDesc,
    programStartDate,
    programEndDate,
    createDate,
    pricePlanType,
    programId,
  } = application;

  const statusLabel =
    programStatusType === 'PROCEEDING'
      ? '참여중'
      : programStatusType === 'PREV'
        ? '참여예정'
        : '참여완료';

  const isUpcoming = statusLabel === '참여예정';
  const isCompleted = statusLabel === '참여완료';

  const isChallenge = programType === 'CHALLENGE';
  const isLive = programType === 'LIVE';
  const isGuidebook = programType === 'GUIDEBOOK';

  const isDashboardEnabled =
    (isChallenge || isLive) && programStatusType === 'PROCEEDING';
  const programTypeKey = programType ?? '';

  const categoryLabel = programTypeKey
    ? newProgramTypeToText[programTypeKey] || programTypeKey
    : '';

  const isReport = programType === 'REPORT';
  const dateLabel = isReport ? '신청일자' : '진행기간';

  const dateText = isReport
    ? (createDate?.format('YY.MM.DD') ?? '')
    : programStartDate && programEndDate
      ? `${programStartDate.format('YY.MM.DD')} ~ ${programEndDate.format('YY.MM.DD')}`
      : '';

  const purchasePlanText =
    isChallenge && pricePlanType
      ? challengePricePlanToText[pricePlanType] || pricePlanType
      : undefined;

  const thumbnail =
    isReport && reportType
      ? getReportThumbnail(reportType)
      : (programThumbnail ?? '');

  const programLink = isReport
    ? '/report/management'
    : `/program/${programType?.toLowerCase()}/${programId}`;

  const actionLabel = isGuidebook
    ? 'PDF 다운로드'
    : isChallenge
      ? '대시보드 입장'
      : isLive
        ? '클래스 입장'
        : '';

  const showActionButton = isChallenge || isLive || isGuidebook;
  const isButtonDisabled = isGuidebook ? false : !isDashboardEnabled;

  const handleActionClick = async (): Promise<void> => {
    if (!programType || programId == null) {
      return;
    }

    if (isGuidebook) {
      if (id == null || programId == null) {
        return;
      }

      const applicationId: number = id;
      const guidebookId: number = programId;

      await downloadGuidebookAndTrack(applicationId, guidebookId);
      return;
    }

    if (isChallenge || isLive) {
      window.location.href = programLink;
    }
  };

  return (
    <div className="flex flex-col justify-between gap-5 rounded-xs p-0 md:flex-row md:items-start md:justify-start md:gap-4 md:border md:border-neutral-85 md:p-4">
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-4">
        <CardThumbnail
          programLink={programLink}
          thumbnail={thumbnail}
          title={programTitle ?? ''}
          isCompleted={isCompleted}
        />

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <CardMetaRow
              statusLabel={statusLabel}
              categoryLabel={categoryLabel}
              dateLabel={dateLabel}
              dateText={dateText}
              isUpcoming={isUpcoming}
            />

            <CardTitleSection
              programLink={programLink}
              title={programTitle ?? ''}
              shortDesc={programShortDesc ?? ''}
            />

            {dateText && (
              <p className="text-xxsmall12 font-normal text-neutral-40 md:hidden">
                {dateLabel} {dateText}
              </p>
            )}
          </div>

          {purchasePlanText && (
            <CardPurchasePlan purchasePlanText={purchasePlanText} />
          )}
        </div>
      </div>

      {showActionButton && actionLabel && (
        <>
          <ActionButton
            label={actionLabel}
            disabled={isButtonDisabled}
            onClick={handleActionClick}
            variant="desktop"
          />
          <ActionButton
            label={actionLabel}
            disabled={isButtonDisabled}
            onClick={handleActionClick}
            variant="mobile"
          />
        </>
      )}
    </div>
  );
};

interface CardThumbnailProps {
  programLink: string;
  thumbnail: string;
  title: string | null;
  isCompleted: boolean;
}

const CardThumbnail = ({
  programLink,
  thumbnail,
  title,
  isCompleted,
}: CardThumbnailProps) => (
  <HybridLink
    href={programLink}
    className="h-[180px] w-full shrink-0 md:h-[119px] md:w-[158px]"
  >
    {thumbnail ? (
      <div className="relative h-full w-full">
        <img
          src={thumbnail}
          alt={title ?? '프로그램 썸네일'}
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

interface CardMetaRowProps {
  statusLabel: string;
  categoryLabel: string;
  dateLabel: string;
  dateText: string;
  isUpcoming: boolean;
}

const CardMetaRow = ({
  statusLabel,
  categoryLabel,
  dateLabel,
  dateText,
  isUpcoming,
}: CardMetaRowProps) => (
  <div className="flex w-full flex-wrap items-center gap-2">
    {statusLabel && (
      <span
        className={twMerge(
          'rounded-xxs px-2 py-0.5 text-xxsmall12 font-normal',
          isUpcoming
            ? 'border border-neutral-80 text-primary'
            : 'bg-primary-10 text-primary',
        )}
      >
        {statusLabel}
      </span>
    )}

    {categoryLabel && (
      <span className="text-xxsmall12 font-normal text-neutral-40">
        {categoryLabel}
      </span>
    )}

    {dateText && (
      <>
        <div className="hidden h-4 w-px bg-neutral-80 md:block" />
        <span className="hidden text-xxsmall12 font-normal text-neutral-40 md:inline">
          {dateLabel} {dateText}
        </span>
      </>
    )}
  </div>
);

interface CardTitleSectionProps {
  programLink: string;
  title: string | null;
  shortDesc: string | null;
}

const CardTitleSection = ({
  programLink,
  title,
  shortDesc,
}: CardTitleSectionProps) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-xsmall16 font-semibold text-neutral-0">
      <HybridLink href={programLink} className="line-clamp-2 hover:underline">
        {title}
      </HybridLink>
    </h3>
    {shortDesc && (
      <p className="line-clamp-2 text-xsmall14 text-neutral-20">{shortDesc}</p>
    )}
  </div>
);

interface CardPurchasePlanProps {
  purchasePlanText: string;
}

const CardPurchasePlan = ({ purchasePlanText }: CardPurchasePlanProps) => (
  <div className="mt-2 flex flex-col gap-2 md:mt-0 md:flex-row md:items-center md:justify-between">
    <span className="flex flex-row gap-1 text-xxsmall12 text-neutral-0">
      구매플랜
      <p className="text-xxsmall12 text-primary">{purchasePlanText}</p>
    </span>
  </div>
);

export default NewApplicationCard;

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
