import Image from 'next/image';

const BannerSection = () => {
  return (
    <section className="w-full px-5 pt-6 md:pt-10 xl:px-0">
      <h1 className="sr-only">렛츠커리어 멘토</h1>
      <Image
        src="/images/mentors-list-banner.webp"
        alt="서류 탈락, 도대체 원인이 무엇인지 모르겠다면? 대기업 현직자에게 '탈락한 서류' 점검 받아보세요! 직무별 현직자 1:1 분석으로 다음 지원 전 개선 포인트 확인하기"
        width={4480}
        height={720}
        className="mx-auto h-auto w-full max-w-[1120px]"
        sizes="(max-width: 1160px) 100vw, 1120px"
        priority
      />
    </section>
  );
};

export default BannerSection;
