import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import Image from 'next/image';
import { LibraryDetailInfo } from '../data/mockLibraryData';

interface Props {
  libraryInfo: LibraryDetailInfo;
}

export default function LibraryArticle({ libraryInfo }: Props) {
  return (
    <article>
      {/* 썸네일 */}
      <div className="relative mb-8 h-[16rem] overflow-hidden rounded-md bg-neutral-95 md:h-[25.5rem]">
        {libraryInfo.thumbnail && (
          <Image
            className="object-contain"
            priority
            unoptimized
            fill
            src={libraryInfo.thumbnail}
            alt="자료집 썸네일"
            sizes="(max-width: 768px) 100vw, 26rem"
          />
        )}
      </div>

      {/* 헤더 */}
      <div className="mb-7 flex flex-col gap-y-4">
        <div>
          <h2 className="mb-1.5 text-small20 font-semibold text-primary">
            {libraryInfo.category}
          </h2>
          <h1 className="line-clamp-3 text-xlarge28 font-bold text-neutral-0 md:line-clamp-2">
            {libraryInfo.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 justify-center overflow-hidden rounded-full">
              <img
                className="h-5 w-5"
                src="/logo/logo-gradient.svg"
                alt="렛츠커리어 프로필 사진"
              />
            </div>
            <span className="text-xsmall14 font-semibold text-neutral-0">
              렛츠커리어
            </span>
          </div>
          <p className="text-xsmall14 text-neutral-35 md:text-xsmall16">
            {dayjs(libraryInfo.displayDate).format(YYYY_MM_DD)} 작성
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div
        className="w-full break-all text-xsmall16"
        dangerouslySetInnerHTML={{ __html: libraryInfo.content }}
      />
    </article>
  );
}
