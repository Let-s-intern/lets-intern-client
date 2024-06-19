import { Link } from 'react-router-dom';
import Heading from '../ui/Heading';

const ReviewSection = () => {
  const reviewList = [
    '/images/home/review_naver.png',
    '/images/home/review_hybe.png',
    '/images/home/review_samsung.png',
    '/images/home/review_sparta.png',
  ];

  return (
    <section>
      <Heading>생생한 참여 후기</Heading>
      <div className="scrollbar-hide mt-6 flex w-full flex-col flex-nowrap gap-4 overflow-x-auto md:w-auto md:flex-row">
        {reviewList.map((review, index) => (
          <Link
            to="#"
            key={index}
            className="lg:min-w-96 w-full flex-shrink-0 md:w-80 lg:w-96"
          >
            <img
              className="h-auto w-full"
              src={review}
              alt="참여 후기 썸네일"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
