import { Fragment } from 'react';

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
      <div className="bottom-content">
        <div className="review-group">
          <div className="row">
            {reviews.slice(0, 10).map((review) => (
              <article key={review.id} className="review">
                <p>
                  {review.content.split('\n').map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </p>
                <figure>
                  {review.program}, {review.user}
                </figure>
              </article>
            ))}
          </div>
          <div className="row">
            {reviews.slice(10).map((review) => (
              <article key={review.id} className="review">
                <p>
                  {review.content.split('\n').map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </p>
                <figure>
                  {review.program}, {review.user}
                </figure>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
