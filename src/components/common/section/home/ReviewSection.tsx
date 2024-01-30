import ReviewBox from '../../box/ReviewBox';
import reviews from '../../../../data/home-reviews.json';

import classes from './ReviewSection.module.scss';

const ReviewSection = () => {
  return (
    <section className="overflow-hidden bg-[#232233] p-6">
      <h2 className="mx-auto max-w-5xl text-[1.75rem] font-semibold text-white">
        참여자 후기로
        <br />
        증명합니다.
      </h2>
      <div className="mt-6">
        <div className="flex flex-col gap-4">
          <div className={classes.row}>
            <div className={classes.item}>
              {reviews.slice(0, 9).map((review, index) => (
                <ReviewBox review={review} key={index} />
              ))}
            </div>
            <div className={classes.item}>
              {reviews.slice(0, 9).map((review, index) => (
                <ReviewBox review={review} key={index} />
              ))}
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.item}>
              {reviews.slice(9).map((review, index) => (
                <ReviewBox review={review} key={index} />
              ))}
            </div>
            <div className={classes.item}>
              {reviews.slice(9).map((review, index) => (
                <ReviewBox review={review} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
