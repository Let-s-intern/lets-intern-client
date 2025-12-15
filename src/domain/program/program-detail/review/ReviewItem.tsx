import { FaStar } from 'react-icons/fa';

import { ReviewType } from '../tab/tab-content/ReviewTabContent';

interface ReviewItemProps {
  review: ReviewType;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <li className="flex flex-col gap-2 rounded-md bg-neutral-0 bg-opacity-5 px-8 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-0.875-medium">{review.title}</span>
          <span className="text-0.75 text-primary">
            {makeMaskingName(review.name)}
          </span>
        </div>
        <p>{review.content}</p>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: review.score }, (_, index) => index + 1).map(
          (th) => (
            <span key={th} className="text-primary">
              <FaStar />
            </span>
          ),
        )}
        {Array.from({ length: 5 - review.score }, (_, index) => index + 1).map(
          (th) => (
            <span key={th} className="text-neutral-70">
              <FaStar />
            </span>
          ),
        )}
      </div>
    </li>
  );
};

const makeMaskingName = (name: string) => {
  if (name === '익명') return name;
  if (name.length === 2) return name[0] + '*';
  if (name.length >= 3) {
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }
};

export default ReviewItem;
