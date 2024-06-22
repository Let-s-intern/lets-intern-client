import Heading from '../ui/Heading';

const images = [
  // 'cj-fresh.png',
  'lg.avif',
  'YBM.png',
  'naver-webtoon.png',
  'naver-cloud.png',
  'nuvilab.png',
  'samsung-bio.png',
  'pwc.png',
  'under-dogs.png',
  'wadiz.png',
  'catch-table.png',
  'sparta.png',
  'hive.svg',
  'hyundai.svg',
  'humax.svg',
];

const PassReviewSection = () => {
  return (
    <section className=' px-5 '>
      <Heading>렛츠커리어인들은 어디서 커리어를 시작했을까요?</Heading>
      <div className="mt-6 flex flex-nowrap gap-x-1.5 overflow-visible overflow-x-auto md:gap-4 lg:gap-6">
        {images.map((image) => (
          <div
            key={image}
            className="h-12 shrink-0 px-[24px] py-[14px] md:h-16 lg:h-24"
          >
            <img
              className="lg:max-h-[80px] lg:max-w-[160px] h-full w-full object-contain"
              src={`/images/home/company/${image}`}
              alt={image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PassReviewSection;
