import Review from './Review';
import reviews from '../../../data/home-reviews.json';

import './ReviewSection.scss';

const ReviewSection = () => {
  return (
    <section className="review-section">
      <h2 className="section-title">
        참여자 후기로
        <br />
        증명합니다.
      </h2>
      <div className="bottom-content review-container">
        <div className="review-group">
          <div className="row">
            <div className="row-item">
              {reviews.slice(0, 9).map((review) => (
                <Review review={review} />
              ))}
            </div>
            <div className="row-item">
              {reviews.slice(0, 9).map((review) => (
                <Review review={review} />
              ))}
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              {reviews.slice(9).map((review) => (
                <Review review={review} />
              ))}
            </div>
            <div className="row-item">
              {reviews.slice(9).map((review) => (
                <Review review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
