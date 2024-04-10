import { Fragment } from 'react';

interface ReviewProps {
  review: any;
}

const ReviewBox = ({ review }: ReviewProps) => {
  return (
    <article className="flex h-48 w-full min-w-[12rem] flex-col justify-between rounded-sm bg-white p-6">
      <p className="text-sm font-medium leading-[1.8]">
        {review.content.split('\n').map((line: string, index: number) => (
          <Fragment key={index}>
            {line}
            <br />
          </Fragment>
        ))}
      </p>
      <figure className="text-neutral-400">
        {review.program}, {review.user}
      </figure>
    </article>
  );
};

export default ReviewBox;
