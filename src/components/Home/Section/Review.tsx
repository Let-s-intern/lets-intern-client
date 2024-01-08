import { Fragment } from 'react';

interface ReviewProps {
  review: any;
}

const Review = ({ review }: ReviewProps) => {
  return (
    <article key={review.id} className="review">
      <p>
        {review.content.split('\n').map((line: string, index: number) => (
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
  );
};

export default Review;
