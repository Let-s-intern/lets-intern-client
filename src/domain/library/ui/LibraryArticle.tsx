import { UserMagnetInfo } from '@/api/magnet/magnetSchema';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import BlogLinkShareBtn from '@/domain/blog/button/BlogLilnkShareBtn';
import LexicalContent from '@/domain/blog/ui/LexicalContent';
import dayjs from '@/lib/dayjs';
import Image from 'next/image';
import Link from 'next/link';

const MAGNET_TYPE_LABEL: Record<string, string> = {
  MATERIAL: '자료집',
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '이벤트',
};

interface Props {
  magnetInfo: UserMagnetInfo;
}

export default function LibraryArticle({ magnetInfo }: Props) {
  const hasApplied = magnetInfo.mainContents !== null;

  return (
    <article>
      {/* 썸네일 */}
      <div className="relative mb-8 h-[16rem] overflow-hidden rounded-md bg-neutral-95 md:h-[25.5rem]">
        {magnetInfo.desktopThumbnail && (
          <Image
            className="object-contain"
            priority
            unoptimized
            fill
            src={magnetInfo.desktopThumbnail}
            alt="자료집 썸네일"
            sizes="(max-width: 768px) 100vw, 26rem"
          />
        )}
      </div>

      {/* 헤더 */}
      <div className="mb-7 flex flex-col gap-y-4">
        <div>
          <h2 className="mb-1.5 text-small20 font-semibold text-primary">
            {MAGNET_TYPE_LABEL[magnetInfo.type] ?? magnetInfo.type}
          </h2>
          <h1 className="line-clamp-3 text-xlarge28 font-bold text-neutral-0 md:line-clamp-2">
            {magnetInfo.title}
          </h1>
        </div>

        <div className="flex items-center justify-between">
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
            {magnetInfo.startDate && (
              <p className="text-xsmall14 text-neutral-35 md:text-xsmall16">
                {dayjs(magnetInfo.startDate).format(YYYY_MM_DD)} 작성
              </p>
            )}
          </div>
          <BlogLinkShareBtn />
        </div>
      </div>

      {/* 콘텐츠 편집 1 (신청 전 공개) */}
      {magnetInfo.previewContents && (
        <div className="w-full break-all text-xsmall16">
          <LexicalContent node={JSON.parse(magnetInfo.previewContents).root} />
        </div>
      )}

      {/* 콘텐츠 편집 2 (신청 후 공개) */}
      {hasApplied ? (
        <div className="mt-8 w-full break-all text-xsmall16">
          <LexicalContent node={JSON.parse(magnetInfo.mainContents!).root} />
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-md bg-primary-10 px-5 py-10">
          <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xs border border-primary-15 bg-white">
            <img
              src="/icons/magnet-folder.svg"
              className="size-5"
              alt="folder"
            />
          </div>
          <div className="mb-6 text-center text-small18 font-light text-neutral-20">
            렛츠커리어만의 <span className="text-primary">취준 꿀팁</span>이
            <br className="block md:hidden" />
            담긴 콘텐츠,
            <br />
            다음 내용이 궁금하다면?
          </div>
          <Link
            href={`/library/${magnetInfo.magnetId}/${encodeURIComponent(magnetInfo.title.replace(/\s+/g, '-'))}/apply`}
            className="w-full max-w-lg rounded-xs bg-primary px-6 py-4 text-center text-xsmall16 text-white"
          >
            자료집 신청하기
          </Link>
        </div>
      )}
    </article>
  );
}
