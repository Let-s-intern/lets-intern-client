import { ArrowUpRight } from 'lucide-react';
import { LETSCON_NEXT_STEPS } from '../data/guide';
import { LETSCON_ALL_IN_ONE_PASS_URL } from '../data/links';
import { LETSCON_SECTION_IDS } from '../data/sections';

const BUTTON =
  'flex h-12 items-center justify-center gap-1 rounded-[8px] px-5 text-[15px] font-bold md:h-14 md:text-sm';

export function NextStep() {
  return (
    <section className="bg-primary-10 break-keep py-16 md:py-[88px]">
      <div className="mx-auto max-w-[880px] px-5">
        <p className="text-primary text-[11px] font-semibold tracking-[0.2em] md:tracking-normal">
          AFTER LETSCON
        </p>
        <h2 className="mt-5 text-[25px] font-extrabold leading-[1.35] tracking-[-0.02em] text-[#1c1e2b] md:mt-4 md:text-4xl md:leading-[1.35]">
          방향을 찾았다면,
          <br />
          이제 나의 경험을 쌓을 차례.
        </h2>
        <p className="mt-5 text-sm leading-[1.55] text-[#5b5e6d] md:mt-4 md:text-base md:leading-[1.5]">
          렛츠콘에서 얻은 힌트를 일회성 다짐으로 끝내지 않도록.
          <br />
          11월 올인원 패스로 직무별 서류 준비와 실제 지원을 이어가세요.
        </p>

        <ul className="mt-6 grid gap-3 md:grid-cols-3 md:gap-[17px]">
          {LETSCON_NEXT_STEPS.map(({ tag, title, body }) => (
            <li
              key={tag}
              className="border-primary-15 rounded-[16px] border bg-white px-[17px] py-[22px] md:px-[21px] md:pb-5 md:pt-7"
            >
              <p className="text-primary text-[11px] font-semibold md:text-xs">
                {tag}
              </p>
              <h3 className="mt-1.5 text-base font-bold text-[#1c1e2b] md:mt-3 md:text-lg">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-[1.5] tracking-[-0.01em] text-[#6b6e7c] md:leading-[1.55]">
                {body}
              </p>
            </li>
          ))}
        </ul>

        <div className="border-primary-20 mt-5 flex flex-col gap-3 border-t pt-5 md:mt-8 md:flex-row md:items-center md:justify-between md:pt-6">
          <div>
            <p className="text-base font-bold text-[#1c1e2b]">
              11월 올인원 패스
            </p>
            <p className="mt-0.5 text-xs leading-[1.3] tracking-[-0.02em] text-[#5b5e6d]">
              렛츠콘 참여 신청과 별도로 구매하는 프로그램입니다. 세부
              구성·가격·모집 일정은 추후 안내됩니다.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 md:flex-row">
            <a
              href={`#${LETSCON_SECTION_IDS.apply}`}
              className={`${BUTTON} bg-[#ffe566] text-[#11142b]`}
            >
              먼저 렛츠콘 참여하기
              <ArrowUpRight aria-hidden className="h-4 w-4" strokeWidth={2.5} />
            </a>
            {LETSCON_ALL_IN_ONE_PASS_URL ? (
              <a
                href={LETSCON_ALL_IN_ONE_PASS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BUTTON} bg-primary text-white`}
              >
                올인원 패스 구매하기
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4"
                  strokeWidth={2.5}
                />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
