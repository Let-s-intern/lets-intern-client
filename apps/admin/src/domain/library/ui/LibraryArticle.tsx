import { UserMagnetInfo } from '@/api/magnet/magnetSchema';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import BlogLinkShareBtn from '@/domain/blog/button/BlogLilnkShareBtn';
import dayjs from '@/lib/dayjs';
import { LockKeyhole } from 'lucide-react';
import Image from '@/common/ui/Image';
import LibraryMainContent from './LibraryMainContent';

const MAGNET_TYPE_LABEL: Record<string, string> = {
  MATERIAL: '직무 자료집',
  VOD: '무료 VOD',
  FREE_TEMPLATE: '무료 템플릿',
  LAUNCH_ALERT: '출시 알림',
  EVENT: '기타',
};

interface Props {
  magnetInfo: UserMagnetInfo;
}

const parseLexicalRoot = (json: string) => {
  try {
    return JSON.parse(json).root ?? null;
  } catch {
    return null;
  }
};

export default function LibraryArticle({ magnetInfo }: Props) {
  const previewRoot = magnetInfo.previewContents
    ? parseLexicalRoot(magnetInfo.previewContents)
    : null;

  const isUpcoming =
    !!magnetInfo.startDate && dayjs().isBefore(dayjs(magnetInfo.startDate));

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
        {isUpcoming && (
          <>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
            <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1.5">
              <LockKeyhole size={14} color="#4C4F56" />
              <span className="text-xsmall14 font-medium text-neutral-30">
                공개예정
              </span>
            </div>
          </>
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
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
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

      {/* 콘텐츠 (클라이언트에서 인증 후 조건부 렌더링) */}
      <LibraryMainContent
        magnetId={magnetInfo.magnetId}
        isUpcoming={isUpcoming}
        previewRoot={previewRoot}
      />
    </article>
  );
}
