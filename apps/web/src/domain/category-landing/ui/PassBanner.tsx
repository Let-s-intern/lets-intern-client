import Link from 'next/link';

/** 랜딩 중간 올인원 패스 배너 */
const PassBanner = ({ href }: { href: string }) => (
  <Link
    href={href}
    className="category_landing_pass_banner flex flex-col gap-4 rounded-md bg-gradient-to-r from-[#4D6BFF] to-[#5B4DFF] px-6 py-7 text-white md:flex-row md:items-center md:justify-between md:px-10"
  >
    <div>
      <p className="text-xxsmall12 font-semibold opacity-90">ALL-IN-ONE PASS</p>
      <p className="mt-1 text-small20 font-bold md:text-medium24">
        서류 <span className="text-[#FFE066]">전부 막막</span>하다면,{' '}
        <span className="text-[#FFE066]">올인원 패스</span> 하나로 끝
      </p>
      <p className="mt-1 text-xsmall14 opacity-90">
        챌린지 · 가이드북 · VOD 클래스 · 1:1 LIVE 멘토링을 한 번에
      </p>
    </div>
    <span className="w-fit rounded-full bg-white px-5 py-2.5 text-xsmall14 font-semibold text-primary">
      패스 구성 보기 ↗
    </span>
  </Link>
);

export default PassBanner;
