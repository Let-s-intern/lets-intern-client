import { PaymentDetailType } from '@/api/payment/paymentSchema';
import dayjs from '@/lib/dayjs';

const convertDateFormat = (dateString: string) => {
  return dayjs(dateString).format('YYYY.MM.DD');
};

/** 1대1 멘토링의 예약 구간 표기 (예: `2026.09.13 (일) 10:00 ~ 11:00`). */
const formatReservationDateTime = (
  startDate?: string | null,
  endDate?: string | null,
) => {
  if (!startDate || !endDate) return '-';
  return `${dayjs(startDate).format('YYYY.MM.DD (dd)')} ${dayjs(startDate).format('HH:mm')} ~ ${dayjs(endDate).format('HH:mm')}`;
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
  mentoringPlan,
  vodPassRows,
}: {
  thumbnail?: ProgramInfo['thumbnail'];
  title?: ProgramInfo['title'];
  startDate?: ProgramInfo['startDate'];
  endDate?: ProgramInfo['endDate'];
  progressType?: ProgramInfo['progressType'];
  programType?: ProgramInfo['programType'] | string | null;
  accessMethod?: string | null;
  /** 1대1 라이브 멘토링의 구매 플랜 표기(예: `60분`). 다른 상품에는 없다. */
  mentoringPlan?: string | null;
  /**
   * VOD 이용권의 상태·기간 표기. 기간과 진행 방식 대신 그린다.
   * 이용권 조회가 실패했으면 비어 있고, 그 경우 제목만 보인다.
   */
  vodPassRows?: { label: string; value: string }[];
}) => {
  const isGuidebook = programType?.toString().toLowerCase() === 'guidebook';
  const isVod = programType?.toString().toLowerCase() === 'vod';
  /*
    1대1 라이브 멘토링은 기간이 아니라 **예약 일시**다. 시작·종료가 같은 날 30분·60분
    구간이라 "진행 일정 2026.09.13 - 2026.09.13" 으로 그리면 아무것도 알려주지 못한다.
  */
  const isLiveMentoring =
    programType?.toString().toLowerCase() === 'live_mentoring';
  // 이용권은 기간·진행 방식이 아니라 이용권 상태를 그린다. 이미지도 없다.
  const isVodPass = programType?.toString().toLowerCase() === 'vod_pass';

  return (
    <div className="flex w-full flex-col items-start justify-center gap-y-6">
      <div className="text-neutral-0 font-semibold">프로그램 정보</div>
      <div className="flex w-full items-start justify-center gap-x-4">
        {thumbnail ? (
          <img
            className="h-[97px] w-[137px] rounded-sm object-cover"
            src={thumbnail}
            alt="thumbnail"
          />
        ) : (
          !isVodPass && (
            <div
              className="bg-neutral-90 h-[97px] w-[137px] shrink-0 rounded-sm"
              aria-hidden
            />
          )
        )}
        <div className="flex grow flex-col items-start justify-center gap-y-3">
          <div className="font-semibold">{title}</div>
          <div className="flex w-full flex-col gap-y-1">
            {isLiveMentoring ? (
              <>
                <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                  <div className="text-neutral-30 shrink-0">예약 일시</div>
                  <div className="text-primary-dark">
                    {formatReservationDateTime(startDate, endDate)}
                  </div>
                </div>
                {mentoringPlan && (
                  <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                    <div className="text-neutral-30 shrink-0">구매 플랜</div>
                    <div className="text-primary-dark">{mentoringPlan}</div>
                  </div>
                )}
              </>
            ) : isVodPass ? (
              (vodPassRows ?? []).map(({ label, value }) => (
                <div
                  key={label}
                  className="flex w-full items-start justify-start gap-x-4 text-xs font-medium"
                >
                  <div className="text-neutral-30 shrink-0">{label}</div>
                  <div className="text-primary-dark">{value}</div>
                </div>
              ))
            ) : isGuidebook || isVod ? (
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
