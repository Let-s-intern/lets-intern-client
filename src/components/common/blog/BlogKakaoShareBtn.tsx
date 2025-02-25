'use client';

import KakaoIcon from '@/assets/icons/kakao_path.svg';
import { twMerge } from 'tailwind-merge';

interface Props {
  title: string;
  description: string;
  thumbnail: string;
  pathname: string;
  className?: string;
  iconClassName?: string;
  fill?: string;
}

function BlogKakaoShareBtn({
  title,
  description,
  thumbnail,
  pathname,
  className,
  iconClassName,
  fill,
}: Props) {
  const handleShareKakaoClick = () => {
    if (!window.Kakao) return;

    const kakao = window.Kakao;
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: thumbnail,
        link: {
          mobileWebUrl: `${window.location.origin}${pathname}`,
          webUrl: `${window.location.origin}${pathname}`,
        },
      },
      buttons: [
        {
          title: '글 확인하기',
          link: {
            mobileWebUrl: `${window.location.origin}${pathname}`,
            webUrl: `${window.location.origin}${pathname}`,
          },
        },
      ],
    });
  };

  return (
    <button type="button" className={className} onClick={handleShareKakaoClick}>
      <KakaoIcon
        className={twMerge('h-5 w-5', iconClassName)}
        fill={fill ?? '#5C5F66'}
      />
    </button>
  );
}

export default BlogKakaoShareBtn;
