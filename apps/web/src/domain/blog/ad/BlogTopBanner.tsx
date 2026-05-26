import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { blogTopBannerData } from './data/topBanner.data';

/**
 * 블로그 글 상세 상단 배너 (블로그 전체 글 공통 노출).
 *
 * 디자이너가 문구/디자인을 baked-in 한 베이스 이미지를 PC/모바일 두 장으로 반응형 노출하고,
 * 배너 전체를 뉴스레터 구독 링크로 감싼다. 접근성 텍스트는 데이터의 `alt`(= 화면 문구)를 사용.
 *
 * 구독 링크(`NEWSLETTER_SUBSCRIBE_URL`)가 비어 있는 동안에는 클릭 링크 없이 이미지만 노출한다.
 */
export default function BlogTopBanner() {
  const { pcImage, mobileImage, alt, link } = blogTopBannerData;

  const banner = (
    <>
      {/* PC */}
      <Image
        src={pcImage}
        alt={alt}
        width={1100}
        height={160}
        sizes="(max-width: 768px) 0px, 1100px"
        className="hidden h-auto w-full md:block"
      />
      {/* 모바일 */}
      <Image
        src={mobileImage}
        alt={alt}
        width={640}
        height={320}
        sizes="(max-width: 768px) 100vw, 0px"
        className="block h-auto w-full md:hidden"
      />
    </>
  );

  return (
    <div className="mb-6 w-full md:mb-10">
      <BannerLink link={link} ariaLabel={alt}>
        {banner}
      </BannerLink>
    </div>
  );
}

/**
 * 배너 전체 클릭 링크. 링크가 비어 있으면 링크 없이 자식만 렌더한다.
 * 외부 링크(`http`)는 새 탭으로, 내부 경로는 `next/link`로 이동.
 */
function BannerLink({
  link,
  ariaLabel,
  children,
}: {
  link: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  if (!link) return <>{children}</>;

  const isExternal = link.startsWith('http');
  const className = twMerge('block w-full');

  if (isExternal) {
    return (
      <a
        href={link}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={link} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
}
