import Image from 'next/image';
import Link from 'next/link';

interface HeroCopy {
  eyebrow: string;
  title: string;
  body: string;
  homeCta?: string;
}

interface CurationHeroProps {
  copy: HeroCopy;
}

const CurationHero = ({ copy }: CurationHeroProps) => {
  return (
    <section className="w-full bg-primary-5">
      <div className="relative flex h-[22rem] w-full flex-row items-center justify-between overflow-hidden px-[120px]">
        {/* 좌측: 텍스트 영역 */}
        <div className="flex flex-col items-start justify-center gap-6 self-stretch">
          {/* 뱃지 */}
          <div className="inline-flex items-center justify-center gap-2 rounded-[2.5rem] bg-[#DBDDFD] px-3 py-1.5">
            <Image
              src="/images/curation/quration_search.svg"
              alt=""
              width={12}
              height={12}
            />
            <span className="text-xs font-bold leading-4 text-indigo-500">
              {copy.eyebrow}
            </span>
          </div>

          {/* 타이틀 + 서브텍스트 */}
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-9 text-zinc-800">
              {copy.title}
            </h1>
            <p className="whitespace-pre-line text-sm font-normal leading-5 text-zinc-500">
              {copy.body}
            </p>
          </div>

          {/* 홈 바로가기 버튼 */}
          {copy.homeCta && (
            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white/70 px-3 py-0.5 outline outline-1 -outline-offset-1 outline-indigo-200 transition-colors hover:bg-white"
            >
              <Image
                src="/logo/logo-gradient.svg"
                alt="렛츠커리어 로고"
                width={16}
                height={16}
              />
              <span className="text-sm font-semibold leading-5 text-indigo-500">
                {copy.homeCta}
              </span>
            </Link>
          )}
        </div>

        {/* 우측: 일러스트 */}
        <div className="hidden shrink-0 md:block">
          <Image
            src="/images/curation/hero-illustration.png"
            alt="큐레이션 히어로 일러스트"
            width={280}
            height={280}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default CurationHero;
