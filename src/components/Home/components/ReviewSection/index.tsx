import Review from './components/Review';
import reviews from '../../../../data/home-reviews.json';

import styles from './styles.module.scss';

const ReviewSection = () => {
  return (
    <section className="review-section overflow-hidden bg-[#232233] p-6">
      <h2 className="mx-auto max-w-5xl text-[1.75rem] font-semibold text-white">
        참여자 후기로
        <br />
        증명합니다.
      </h2>
      <div className="bottom-content review-container mt-6">
        <div className="review-group flex flex-col gap-4">
          <div className={styles.row}>
            <div className={styles.item}>
              {reviews.slice(0, 9).map((review, index) => (
                <Review review={review} key={index} />
              ))}
            </div>
            <div className={styles.item}>
              {reviews.slice(0, 9).map((review, index) => (
                <Review review={review} key={index} />
              ))}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.item}>
              {reviews.slice(9).map((review, index) => (
                <Review review={review} key={index} />
              ))}
            </div>
            <div className={styles.item}>
              {reviews.slice(9).map((review, index) => (
                <Review review={review} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
