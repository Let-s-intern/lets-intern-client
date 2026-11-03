import Link from 'next/link';

/** 행사가 끝나면(11/15) 카드를 내린다 */
const LETSCON_CARD_END = new Date('2026-11-16T00:00:00+09:00');

export const isLetsconCardVisible = () =>
  Date.now() < LETSCON_CARD_END.getTime();

/**
 * 모집 중 세미나 목록 맨 앞에 붙는 렛츠콘 카드. 렛츠콘은 프로그램이 아니라 별도 랜딩이라
 * ProgramCard 대신 같은 3행(썸네일·제목·정보) 구조를 직접 그린다.
 */
const LetsconCard = () => (
  <Link
    href="/letscon?utm_source=letscareer&utm_medium=seminar_list&utm_campaign=letscon"
    className="row-span-3 grid w-full grid-rows-subgrid gap-3 overflow-hidden"
  >
    <img
      className="bg-neutral-80 md:rounded-xs aspect-[540/421] h-auto w-full rounded-sm object-cover"
      src="/letscon/letscon-thumbnail.webp"
      alt="렛츠콘 11.14(토)~15(일) 이틀 모두 무료 참여"
    />
    <h2 className="text-1-semibold text-xsmall14 md:text-xsmall16">
      [무료] 렛츠콘 - 공채는 끝나도, 취준은 끝나지 않으니까
    </h2>
    <div className="flex flex-col gap-4">
      {/* 모집기간은 운영 온라인 신청 마그넷(59)의 시작·마감일 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
          <span className="text-xxsmall12 text-neutral-0 font-normal">
            모집기간
          </span>
          <span className="text-0.75-medium text-primary-dark">
            26.11.02 ~ 26.11.15
          </span>
        </div>
        <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
          <span className="text-xxsmall12 text-neutral-0 font-normal">
            진행기간
          </span>
          <span className="text-0.75-medium text-primary-dark">
            26.11.14 ~ 26.11.15
          </span>
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <span className="text-xxsmall12 border-primary-10 bg-primary-10 text-primary rounded-[3px] border px-2 py-1 font-normal">
          모집 중
        </span>
      </div>
    </div>
  </Link>
);

export default LetsconCard;
