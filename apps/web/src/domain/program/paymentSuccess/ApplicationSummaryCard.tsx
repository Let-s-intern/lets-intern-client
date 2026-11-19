import OrderChallengeThumbnail from '../OrderChallengeThumbnail';

interface Props {
  thumbnail: string;
  title: string;
  rows: { label: string; value: string }[];
  amountLabel: string;
  amount: string;
  /** 챌린지면 등록 썸네일 대신 유형별 기본 썸네일을 쓴다 */
  isChallenge?: boolean;
  challengeType?: string | null;
}

/** 결제 결과 화면의 신청 내역 카드. 썸네일·제목, 신청 정보 행, 금액을 그린다 */
const ApplicationSummaryCard = ({
  thumbnail,
  title,
  rows,
  amountLabel,
  amount,
  isChallenge = false,
  challengeType,
}: Props) => {
  return (
    <div className="flex w-full flex-col rounded-[16px] border border-neutral-90 bg-white px-5 py-6 md:px-7">
      <div className="flex items-center gap-4 border-b border-neutral-90 pb-5">
        {isChallenge ? (
          <div className="h-[76px] w-[108px] shrink-0 overflow-hidden rounded-[8px] bg-neutral-90 md:h-[97px] md:w-[137px]">
            <OrderChallengeThumbnail
              title={title}
              challengeType={challengeType}
              fallbackSrc={thumbnail}
            />
          </div>
        ) : thumbnail ? (
          <img
            className="h-[76px] w-[108px] shrink-0 rounded-[8px] object-cover md:h-[97px] md:w-[137px]"
            src={thumbnail}
            alt=""
          />
        ) : (
          <div
            className="h-[76px] w-[108px] shrink-0 rounded-[8px] bg-neutral-90 md:h-[97px] md:w-[137px]"
            aria-hidden
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xxsmall12 text-neutral-40 md:text-xsmall14">
            신청한 프로그램
          </span>
          <p className="break-keep text-xsmall16 font-bold text-neutral-0 md:text-small18">
            {title}
          </p>
        </div>
      </div>
      {rows.length > 0 && (
        <dl className="flex flex-col gap-4 border-b border-neutral-90 py-5">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 text-xsmall14 md:text-xsmall16"
            >
              <dt className="shrink-0 text-neutral-40">{label}</dt>
              <dd className="text-right font-medium text-neutral-0">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="flex items-center justify-between gap-4 pt-5">
        <span className="text-xsmall16 font-bold text-neutral-0">
          {amountLabel}
        </span>
        <span className="text-small20 font-bold text-neutral-0 md:text-medium24">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default ApplicationSummaryCard;
