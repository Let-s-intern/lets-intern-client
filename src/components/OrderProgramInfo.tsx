import { PaymentDetailType } from '@/api/paymentSchema';
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
}: {
  thumbnail?: ProgramInfo['thumbnail'];
  title?: ProgramInfo['title'];
  startDate?: ProgramInfo['startDate'];
  endDate?: ProgramInfo['endDate'];
  progressType?: ProgramInfo['progressType'];
  programType?: ProgramInfo['programType'];
}) => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-y-6">
      <div className="font-semibold text-neutral-0">프로그램 정보</div>
      <div className="flex w-full items-start justify-center gap-x-4">
        <img
          className="h-[97px] w-[137px] rounded-sm object-cover"
          src={thumbnail || ''}
          alt="thumbnail"
        />
        <div className="flex grow flex-col items-start justify-center gap-y-3">
          <div className="font-semibold">{title}</div>
          <div className="flex w-full flex-col gap-y-1">
            <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
              <div className="shrink-0 text-neutral-30">진행 일정</div>
              <div className="text-primary-dark">{`${convertDateFormat(startDate || '')} - ${convertDateFormat(endDate || '')}`}</div>
            </div>
            {progressType !== 'none' && programType !== 'CHALLENGE' && (
              <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                <div className="shrink-0 text-neutral-30">진행 방식</div>
                <div className="text-primary-dark">{`${
                  progressType === 'ALL'
                    ? '온라인/오프라인'
                    : progressType === 'ONLINE'
                      ? '온라인'
                      : '오프라인'
                }`}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgramInfo;
