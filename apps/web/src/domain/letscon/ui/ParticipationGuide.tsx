import { ShieldCheck } from 'lucide-react';
import { LETSCON_GUIDE_ROWS } from '../data/guide';
import { LETSCON_MAP_URL } from '../data/links';

export function ParticipationGuide() {
  return (
    <section className="break-keep bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[880px] px-5">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#1c1e2b] md:text-4xl">
          참가 안내
        </h2>

        <dl className="mt-5 border-t-2 border-[#11142b] md:mt-6">
          {LETSCON_GUIDE_ROWS.map(
            ({ label, mobileLabel, lines, hasMapLink }) => (
              <div
                key={label}
                className="flex gap-3 border-b border-[#d9d9de] py-[15px] text-sm leading-[1.2] md:gap-0 md:py-[18px] md:text-[15px] md:leading-[1.45]"
              >
                <dt className="w-[78px] shrink-0 text-[#1c1e2b] md:w-[150px]">
                  <span className={mobileLabel ? 'hidden md:inline' : ''}>
                    {label}
                  </span>
                  {mobileLabel ? (
                    <span className="md:hidden">{mobileLabel}</span>
                  ) : null}
                </dt>
                <dd className="flex min-w-0 flex-col gap-1.5 text-[#5b5e6d]">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {hasMapLink && LETSCON_MAP_URL ? (
                    <a
                      href={LETSCON_MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary w-fit md:underline md:underline-offset-4"
                    >
                      지도 보기
                    </a>
                  ) : null}
                </dd>
              </div>
            ),
          )}
        </dl>

        <div className="bg-primary-10 mt-4 flex items-center gap-3 rounded-[16px] p-4 md:mt-8 md:gap-4 md:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white md:h-12 md:w-12 md:rounded-[12px]">
            <ShieldCheck
              aria-hidden
              className="text-primary h-6 w-6"
              strokeWidth={2}
            />
          </span>
          <div>
            <p className="text-base font-bold text-[#11142b]">
              보증금은 참가비가 아닙니다.
            </p>
            <p className="mt-1 text-[13px] leading-[1.45] tracking-[-0.01em] text-[#5b5e6d] md:text-sm">
              현장 좌석이 60석으로 한정되어 있어, 신청 후 꼭 참석하실 수 있도록
              보증금(15,000원)을 받고 있어요. 참석하시면 전액 돌려드려요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
