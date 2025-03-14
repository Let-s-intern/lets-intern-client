'use client'; // 클라이언트 timezone을 사용하기 위함

import { BlogDetailInfo } from '@/api/blogSchema';
import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { blogCategory } from '@/utils/convert';
import getDominantColor from '@/utils/dominantColor';
import Image from 'next/image';
import { useEffect } from 'react';
import Heading2 from './BlogHeading2';
import BlogLinkShareBtn from './BlogLilnkShareBtn';
import LexicalContent from './LexicalContent';

interface Props {
  blogInfo: BlogDetailInfo;
  lexical?: string | null;
}

export default function BlogArticle({ blogInfo, lexical }: Props) {
  // 공개 예정 여부
  const willBePublished = dayjs(blogInfo.displayDate).isAfter(dayjs());

  useEffect(() => {
    const img = document.getElementById('blogThumbnail');

    if (img && blogInfo.thumbnail) {
      const [r, g, b] = getDominantColor(img as HTMLImageElement);
      const isDefault = r === 249 && g === 249 && b === 248;
      const thumbnailDiv = document.getElementById('thumbnailDiv');
      thumbnailDiv!.style.backgroundColor = `rgb(${r} ${g} ${b} / ${isDefault ? 100 : 10}%)`;
    }
  }, [blogInfo.thumbnail]);

  return (
    <article>
      {/* 썸네일 */}
      <div
        id="thumbnailDiv"
        className="relative mb-8 h-[16rem] overflow-hidden rounded-md bg-neutral-95 md:h-[25.5rem]"
      >
        <Image
          id="blogThumbnail"
          className="object-contain"
          crossOrigin="use-credentials"
          priority
          unoptimized
          fill
          src={blogInfo.thumbnail ?? ''}
          alt="블로그 썸네일"
          sizes="(max-width: 768px) 100vw, 26rem"
        />
      </div>

      {/* 블로그 헤더 */}
      <div className="mb-7 flex flex-col gap-y-4">
        {/* 제목 */}
        <div>
          {blogInfo.category && (
            <Heading2 className="mb-1.5 text-primary" id="blog-category">
              {blogCategory[blogInfo.category]}
            </Heading2>
          )}
          <h1 className="line-clamp-3 text-xlarge28 font-bold text-neutral-0 md:line-clamp-2">
            {blogInfo.title}{' '}
            {!blogInfo.isDisplayed && (
              <span className="text-xsmall14 text-system-error">(비공개)</span>
            )}
          </h1>
        </div>

        <div className="flex items-center justify-between">
          {/* 게시 일자 */}
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
            {blogInfo.displayDate && (
              <p className="text-xsmall14 text-neutral-35 md:text-xsmall16">
                {dayjs(blogInfo.displayDate).format(YYYY_MM_DD)}{' '}
                {willBePublished ? '공개 예정' : '작성'}
              </p>
            )}
          </div>
          {/* 공유 버튼 */}
          <BlogLinkShareBtn />
        </div>
      </div>

      {/* 블로그 본문 */}
      {willBePublished ? (
        <p className="py-16 text-center">아직 공개되지 않은 블로그입니다 🫥</p>
      ) : (
        lexical && (
          <div className="w-full break-all text-xsmall16">
            <LexicalContent node={JSON.parse(lexical as string).root} />
          </div>
        )
      )}
    </article>
  );
}
