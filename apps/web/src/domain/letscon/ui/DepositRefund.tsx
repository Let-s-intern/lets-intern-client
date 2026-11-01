import { LETSCON_REFUND_STEPS } from '../data/guide';

export function DepositRefund() {
  return (
    <div className="mt-16 md:mt-12">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#1c1e2b] md:text-[28px]">
        보증금은 이렇게 돌려드려요.
      </h2>
      <p className="mt-2 text-xs text-[#7f8290] md:mt-3 md:text-sm">
        현장 참석이 확인되면 보증금 15,000원을 전액 돌려드립니다.
      </p>

      <div className="mt-5 rounded-[16px] border border-[#e8e9f3] bg-white p-5 md:mt-8 md:p-9">
        <ol className="flex flex-col gap-5 md:grid md:grid-cols-[1fr_1fr_0.92fr] md:gap-0">
          {LETSCON_REFUND_STEPS.map(({ when, title, body }, index) => {
            const isLast = index === LETSCON_REFUND_STEPS.length - 1;
            return (
              <li key={title}>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      isLast
                        ? 'bg-primary text-white'
                        : 'bg-primary-10 text-primary'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`bg-primary-10 h-px flex-1 md:mr-6 ${isLast ? 'md:hidden' : ''}`}
                  />
                </div>
                <p className="mt-2 text-xs text-[#7f8290] md:mt-6">{when}</p>
                <p
                  className={`mt-1.5 text-lg font-bold md:mt-2 ${
                    isLast ? 'text-primary' : 'text-[#1c1e2b]'
                  }`}
                >
                  {title}
                </p>
                <p className="mt-2 text-sm text-[#7f8290] md:mt-3">{body}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 border-t border-[#ededf3] pt-5 text-xs leading-[1.45] text-[#7f8290] md:mt-7 md:pt-6">
          현장 좌석은 선착순 60명으로, 노쇼 방지를 위해 보증금을 받습니다.{' '}
          <br className="hidden md:block" />
          미참석 시 보증금은 환급되지 않습니다.
        </p>
      </div>
    </div>
  );
}
