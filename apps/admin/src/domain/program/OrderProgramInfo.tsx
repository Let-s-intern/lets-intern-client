import { PaymentDetailType } from '@/api/payment/paymentSchema';
import dayjs from '@/lib/dayjs';

const convertDateFormat = (dateString: string) => {
  return dayjs(dateString).format('YYYY.MM.DD');
};

type ProgramInfo = PaymentDetailType['programInfo'];

const OrderProgramInfo = ({
  endDate,
  progressType,
  startDate,
  thumbnail,
  title,
  programType,
  accessMethod,
}: {
  thumbnail?: ProgramInfo['thumbnail'];
  title?: ProgramInfo['title'];
  startDate?: ProgramInfo['startDate'];
  endDate?: ProgramInfo['endDate'];
  progressType?: ProgramInfo['progressType'];
  programType?: ProgramInfo['programType'] | string | null;
  accessMethod?: string | null;
}) => {
  const isGuidebook = programType?.toString().toLowerCase() === 'guidebook';
  const isVod = programType?.toString().toLowerCase() === 'vod';

  return (
    <div className="flex w-full flex-col items-start justify-center gap-y-6">
      <div className="text-neutral-0 font-semibold">프로그램 정보</div>
      <div className="flex w-full items-start justify-center gap-x-4">
        <img
          className="h-[97px] w-[137px] rounded-sm object-cover"
          src={thumbnail || ''}
          alt="thumbnail"
        />
        <div className="flex grow flex-col items-start justify-center gap-y-3">
          <div className="font-semibold">{title}</div>
          <div className="flex w-full flex-col gap-y-1">
            {isGuidebook || isVod ? (
              <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                <div className="text-neutral-30 shrink-0">열람 방식</div>
                <div className="text-primary-dark">{accessMethod || '-'}</div>
              </div>
            ) : (
              <>
                <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                  <div className="text-neutral-30 shrink-0">진행 일정</div>
                  <div className="text-primary-dark">{`${convertDateFormat(startDate || '')} - ${convertDateFormat(endDate || '')}`}</div>
                </div>
                {progressType !== 'none' && programType !== 'CHALLENGE' && (
                  <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                    <div className="text-neutral-30 shrink-0">진행 방식</div>
                    <div className="text-primary-dark">{`${
                      progressType === 'ALL'
                        ? '온라인/오프라인'
                        : progressType === 'ONLINE'
                          ? '온라인'
                          : '오프라인'
                    }`}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgramInfo;
