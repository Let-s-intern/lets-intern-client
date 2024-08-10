import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import AboutTitleDark from '../ui/AboutTitleDark';

const title = {
  subTitle: '원하는 신입 · 인턴십 합격',
  mainTitle: '렛츠커리어와 함께한 사람들의 이야기',
};

const reviewList = [
  {
    img: '/images/home/review_naver_webtoon.png',
    url: 'https://blog.naver.com/letsintern/223342477519',
  },
  {
    img: '/images/home/review_hybe.png',
    url: 'https://blog.naver.com/letsintern/223402704433',
  },
  {
    img: '/images/home/review_samsung.png',
    url: 'https://blog.naver.com/letsintern/223415067865',
  },
  {
    img: '/images/home/review_cj.png',
    url: 'https://blog.naver.com/letsintern/223407562305',
  },
];

const throttle = (callback: () => void, delay: number) => {
  let timeId: NodeJS.Timeout | null;

  return () => {
    if (timeId) return;
    timeId = setTimeout(() => {
      callback();
      timeId = null;
    }, delay);
  };
};

const ReviewSection = () => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(true);

  useEffect(() => {
    const onResize = () => {
      setHasScroll(
        slideRef.current?.scrollWidth === slideRef.current?.offsetWidth
          ? false
          : true,
      );
    };
    onResize(); // 최초 실행
    window.addEventListener('resize', throttle(onResize, 100));

    return () => {
      window.removeEventListener('resize', throttle(onResize, 100));
    };
  }, []);

  return (
    <section className="bg-[#101348] px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] xl:py-[8.75rem]">
      <AboutTitleDark {...title} />
      <div
        ref={slideRef}
        className={twMerge(
          'custom-scrollbar mt-10 flex w-auto flex-nowrap gap-4 overflow-x-auto xl:pl-16',
          !hasScroll && 'justify-center',
        )}
      >
        {reviewList.map((review) => (
          <Link
            to={review.url}
            key={review.url}
            className="w-72 flex-shrink-0 overflow-hidden rounded-md lg:w-96 lg:min-w-96"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              className="h-auto w-full"
              src={review.img}
              alt="참여 후기 썸네일"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
