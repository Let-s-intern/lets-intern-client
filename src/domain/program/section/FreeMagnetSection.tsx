'use client';

import { useGetUserMagnetListQuery } from '@/api/magnet/magnet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FreeMagnetSection = () => {
  const router = useRouter();
  const { data, isLoading } = useGetUserMagnetListQuery({
    typeList: ['FREE_TEMPLATE'],
    pageable: { page: 1, size: 4 },
  });

  if (isLoading || !data || data.magnetList.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-5 rounded-lg border border-[#9499F9] bg-primary-5 p-5 pb-4 md:px-8 md:pb-5 md:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xsmall16 font-semibold md:text-small20">
          취준 꿀팁이 담긴 무료 자료집
        </h2>
        <Link
          href="/library"
          className="pb-3 pl-3 text-xxsmall12 text-neutral-45 md:text-xsmall16"
        >
          자료집 더보기
        </Link>
      </div>
      <div className="custom-scrollbar w-full overflow-x-auto">
        <div className="flex w-fit gap-5 pb-1">
          {data.magnetList.map((magnet) => (
            <div
              key={magnet.magnetId}
              className="flex w-full min-w-[130px] cursor-pointer flex-col overflow-hidden md:min-w-[200px]"
              onClick={() => router.push(`/library/${magnet.magnetId}`)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-white">
                <img
                  className="h-full w-full object-cover"
                  src={magnet.desktopThumbnail || undefined}
                  alt={magnet.title}
                />
                <span className="absolute left-2 top-2 rounded-xxs bg-neutral-10 px-1.5 py-[5px] text-xxsmall10 text-static-100 md:text-xxsmall12">
                  무료
                </span>
              </div>
              <div className="pt-3">
                <p className="line-clamp-2 text-xsmall16 font-semibold">
                  {magnet.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeMagnetSection;
