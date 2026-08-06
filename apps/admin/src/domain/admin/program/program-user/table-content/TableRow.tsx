import {
  ChallengeApplication,
  ChallengePricePlanEnum,
  GuidebookApplication,
  LiveApplication,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
  VodApplication,
} from '@/schema';
import { gradeToText } from '@/utils/convert';
import { useMemo } from 'react';
import TD from '../../../ui/table/regacy/TD';
import { RefundMode, RefundTarget } from '../ui/RefundModal';
import {
  resolveRefundableState,
  resolveRefundLabel,
} from '../utils/refundState';

const { CHALLENGE } = ProgramTypeEnum.enum;

const DownloadTDs = ({
  isDownloaded,
  downloadedAt,
}: Pick<
  GuidebookApplication | VodApplication,
  'isDownloaded' | 'downloadedAt'
>) => (
  <>
    <TD>
      {isDownloaded ? (
        <span className="font-bold">Y</span>
      ) : (
        <span className="text-gray-300">N</span>
      )}
    </TD>
    <TD>{downloadedAt ? downloadedAt.format('YYYY-MM-DD HH:mm') : '-'}</TD>
  </>
);

interface Props {
  applicationItem:
    | ChallengeApplication
    | LiveApplication
    | GuidebookApplication
    | VodApplication;
  programType: ProgramTypeUpperCase;
  programTitle: string;
  adminRefundedIds: Set<number>;
  onRefundClick: (target: RefundTarget, mode: RefundMode) => void;
}

const TableRow = ({
  applicationItem,
  programType,
  programTitle,
  adminRefundedIds,
  onRefundClick,
}: Props) => {
  const challengeApp = applicationItem as ChallengeApplication;
  const liveAppItem = applicationItem as LiveApplication;
  const guidebookAppItem = applicationItem as GuidebookApplication;
  const vodAppItem = applicationItem as VodApplication;
  const applicationInfo =
    programType === 'CHALLENGE' ? challengeApp.application : liveAppItem;

  const createDate = useMemo(() => {
    switch (programType) {
      case CHALLENGE:
        return challengeApp.application.createDate;
      case 'GUIDEBOOK':
        return guidebookAppItem.createDate;
      case 'VOD':
        return vodAppItem.createDate;
      default:
        return liveAppItem.created_date;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationItem, programType]);

  const originalPrice =
    (applicationInfo as { originalPrice?: number | null }).originalPrice ??
    null;

  /**
   * 결제금액.
   *
   * 취소 건도 실결제액을 보여준다. 예전에는 취소 행에서 "환불 차감 금액"(환불하지 않고 남긴 돈)을
   * 계산해 보여줬는데, 같은 `결제금액` 헤더 아래에서 정상 건과 다른 값을 뜻해 운영이 오해했다.
   * 어드민 환불로 취소 건이 늘어나므로 의미를 하나로 통일한다.
   *
   * 환불하면 payment.finalPrice 가 환불액으로 덮어써지고 원 결제액이 originalPrice 로 옮겨간다
   * (Payment.updateRefundPrice). 그래서 취소 건은 originalPrice 를 읽는다.
   */
  const amount = useMemo(() => {
    if (applicationInfo.isCanceled) {
      return originalPrice ?? applicationInfo.finalPrice ?? 0;
    }
    return applicationInfo.finalPrice ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationItem, programType]);

  const applicationId = applicationInfo.id;

  const refundLabel = resolveRefundLabel({
    isCanceled: applicationInfo.isCanceled ?? false,
    isAdminRefunded: adminRefundedIds.has(applicationId),
    finalPrice: applicationInfo.finalPrice ?? null,
    originalPrice,
  });

  const refundable = resolveRefundableState({
    isCanceled: applicationInfo.isCanceled ?? false,
    hasUser: !!applicationInfo.name,
    finalPrice: applicationInfo.finalPrice ?? null,
  });

  const handleRefundClick = (mode: RefundMode) => {
    onRefundClick(
      {
        applicationId,
        name: applicationInfo.name ?? '',
        email: applicationInfo.email ?? '',
        phoneNum: applicationInfo.phoneNum ?? '',
        programTitle,
        orderId: applicationInfo.orderId ?? '',
        pricePlanType:
          programType === CHALLENGE
            ? (challengeApp.application.challengePricePlanType ?? null)
            : null,
        couponName: applicationInfo.couponName ?? null,
        couponDiscount: applicationInfo.couponDiscount ?? null,
        finalPrice: applicationInfo.finalPrice ?? 0,
      },
      mode,
    );
  };

  return (
    /*
      이용 히스토리에서 `#application-{id}` 로 이 행을 지목해 들어온다(LC-3201).
      표시에는 영향이 없고 찾아갈 자리만 만든다.
    */
    <tr id={`application-${applicationId}`}>
      <TD>{applicationInfo.orderId}</TD>
      <TD>
        <span>{applicationInfo.name}</span>
      </TD>
      <TD>{applicationInfo.email}</TD>
      <TD>{applicationInfo.phoneNum}</TD>
      {programType === 'LIVE' && (
        <>
          <TD>{applicationInfo.university}</TD>
          <TD>
            {applicationInfo.grade ? gradeToText[applicationInfo.grade] : ''}
          </TD>
          <TD>{applicationInfo.major}</TD>
          <TD whiteSpace="wrap">{liveAppItem.motivate ?? ''}</TD>
          <TD whiteSpace="wrap">{liveAppItem.question ?? ''}</TD>
        </>
      )}
      {/* 결제 상품 */}
      <TD>{applicationInfo.couponName ?? '없음'}</TD>
      {programType === ProgramTypeEnum.enum.CHALLENGE && (
        <TD>
          {challengeApp.application.challengePricePlanType ??
            ChallengePricePlanEnum.enum.BASIC}
        </TD>
      )}
      {/* 결제금액 */}
      <TD>{amount.toLocaleString()}원</TD>
      <TD whiteSpace="wrap">
        {refundLabel.isAdmin ? (
          <span className="font-bold text-red-600">{refundLabel.text}</span>
        ) : refundLabel.isRefunded ? (
          <span className="font-medium">{refundLabel.text}</span>
        ) : (
          <span className="text-gray-300">{refundLabel.text}</span>
        )}
      </TD>
      {(programType === 'GUIDEBOOK' || programType === 'VOD') && (
        <DownloadTDs
          isDownloaded={guidebookAppItem.isDownloaded}
          downloadedAt={guidebookAppItem.downloadedAt}
        />
      )}
      <TD>{createDate.format('YYYY-MM-DD HH:mm')}</TD>
      <TD>
        {refundable.canRefund ? (
          <div className="flex gap-1">
            <button
              type="button"
              className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              onClick={() => handleRefundClick('full')}
            >
              환불
            </button>
            <button
              type="button"
              className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent"
              onClick={() => handleRefundClick('partial')}
              disabled={!refundable.canPartialRefund}
              title={
                refundable.canPartialRefund
                  ? undefined
                  : '실결제액이 0원이라 나눌 금액이 없습니다.'
              }
            >
              부분환불
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">{refundable.reason}</span>
        )}
      </TD>
    </tr>
  );
};

export default TableRow;
