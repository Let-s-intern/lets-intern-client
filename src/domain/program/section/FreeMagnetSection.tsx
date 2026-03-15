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
    <section className="my-4 w-full rounded-lg bg-neutral-95 p-5 md:my-8 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-1.125-semibold md:text-1.25-semibold text-neutral-10">
          취준 꿀팁이 담긴 무료 자료집
        </h2>
        <Link
          href="/library"
          className="text-0.875-medium text-neutral-40 hover:text-neutral-20"
        >
          자료집 더보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.magnetList.map((magnet) => (
          <div
            key={magnet.magnetId}
            className="flex cursor-pointer flex-col overflow-hidden rounded-sm bg-static-100"
            onClick={() => router.push(`/library/${magnet.magnetId}`)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={magnet.desktopThumbnail || undefined}
                alt={magnet.title}
              />
              <span className="absolute left-2 top-2 rounded-xs bg-primary px-2 py-0.5 text-xxsmall10 font-semibold text-static-100 md:text-xxsmall12">
                무료
              </span>
            </div>
            <div className="p-3">
              <p className="text-0.875-medium line-clamp-2 text-neutral-20">
                {magnet.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreeMagnetSection;
