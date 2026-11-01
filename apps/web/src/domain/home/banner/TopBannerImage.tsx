import { twMerge } from '@/lib/twMerge';
import { ILineBanner } from '@/types/Banner.interface';
import Image from 'next/image';

interface TopBannerImageProps {
  banner: ILineBanner;
}

/**
 * 상단 띠 배너 아래에 붙는 이미지. 이미지와 이동 링크는 어드민 > 상단 띠 배너에서 설정한다.
 *
 * - PC 3840x960(4:1): 표시 최대폭 1920px 의 2배
 * - 모바일 1536x768(2:1): 표시 최대폭 768px 의 2배
 *
 * 와이드 이미지를 모바일로 줄이면 글자가 뭉개져서 공용으로 쓰지 않고 따로 받는다.
 * 한쪽만 올리면 그 화면에서만 보인다.
 *
 * 이동 링크(imageLink)에 UTM 을 붙이면 유입 추적에 좋다.
 * 예: /letscon?utm_source=letscareer&utm_medium=home_banner&utm_campaign=letscon
 *
 * 음수 마진은 고정된 띠와 스페이서의 높이 차이로 생기는 흰 틈을 없앤다.
 */
const TopBannerImage = ({ banner }: TopBannerImageProps) => {
  const { imgUrl, mobileImgUrl, title } = banner;

  if (!imgUrl && !mobileImgUrl) return null;

  const href = banner.imageLink || banner.link;
  const isInternal =
    href.startsWith('/') || href.startsWith(window.location.origin);

  return (
    <a
      href={href}
      target={isInternal ? '_self' : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      aria-label={title}
      className={twMerge(
        'relative block w-full overflow-hidden',
        '-mt-4 md:-mt-2',
        !mobileImgUrl && 'hidden md:block',
        !imgUrl && 'md:hidden',
      )}
    >
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={title}
          width={3840}
          height={960}
          sizes="100vw"
          className="hidden h-auto w-full md:block"
        />
      )}
      {mobileImgUrl && (
        <Image
          src={mobileImgUrl}
          alt={title}
          width={1536}
          height={768}
          sizes="100vw"
          className="h-auto w-full md:hidden"
        />
      )}
    </a>
  );
};

export default TopBannerImage;
