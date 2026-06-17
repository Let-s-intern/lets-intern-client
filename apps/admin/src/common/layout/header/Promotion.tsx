import { Link } from 'react-router-dom';

function Promotion() {
  return (
    <Link
      to="/b2b"
      className="border-neutral-80 hidden h-[36px] cursor-pointer items-center justify-center gap-1 rounded-[2px] border px-2.5 py-2 transition-colors md:flex"
    >
      <span className="text-xsmall14 text-neutral-0 font-medium">
        기업 교육
      </span>
      {/* <div className="flex h-3 w-3 items-center justify-center rounded-full bg-system-error text-[8px] font-bold leading-none text-white">
        N
      </div> */}
    </Link>
  );
}

export default Promotion;
