import Link from 'next/link';

function SuperInternPromotion() {
  return (
    <Link
      href="/b2b-introduce"
      className="hidden h-[36px] cursor-pointer items-center justify-center gap-1 rounded-[2px] border border-neutral-80 px-2.5 py-2 transition-colors md:flex"
    >
      <span className="text-xsmall14 font-medium text-neutral-0">
        기업 교육
      </span>
      {/* <div className="flex h-3 w-3 items-center justify-center rounded-full bg-system-error text-[8px] font-bold leading-none text-white">
        N
      </div> */}
    </Link>
  );
}

export default SuperInternPromotion;
