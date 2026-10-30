import { getImageProps } from 'next/image';
import Link from 'next/link';

const ALT =
  "서류 탈락, 이유를 모르겠다면? 대기업 현직자에게 '탈락한 서류' 점검 받아보세요! 직무별 현직자 1:1 분석으로 다음 지원 전 개선 포인트 확인하기";

const BannerSection = () => {
  // 화면 폭에 맞는 이미지 하나만 받도록 <picture> 로 분기한다
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    src: '/images/mentors-list-banner.webp',
    alt: ALT,
    width: 4480,
    height: 720,
    sizes: '(max-width: 1160px) 100vw, 1120px',
    priority: true,
  });
  const { props: mobileProps } = getImageProps({
    src: '/images/mentors-list-banner-mobile.webp',
    alt: ALT,
    width: 640,
    height: 200,
    sizes: '100vw',
    priority: true,
  });

  // 배경은 이미지 가장자리 색이다. 좌우를 채워 화면 폭 전체 띠처럼 보이게 한다
  return (
    <section className="w-full bg-[#205FFF]">
      <h1 className="sr-only">렛츠커리어 멘토</h1>
      <Link href="/bigfirm" className="mx-auto block max-w-[1120px]">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
          <img
            {...mobileProps}
            alt={ALT}
            className="aspect-[16/5] h-auto w-full md:aspect-[56/9]"
          />
        </picture>
      </Link>
    </section>
  );
};

export default BannerSection;
