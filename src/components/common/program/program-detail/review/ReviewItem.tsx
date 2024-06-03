import { FaStar } from 'react-icons/fa';
import { ReviewType } from '../tab/tab-content/ReviewTabContent';

interface ReviewItemProps {
  review: ReviewType;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <li className="flex flex-col gap-2 rounded-md bg-neutral-0 bg-opacity-5 px-8 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary">{review.name}</span>
          <span className="text-neutral-45">
            {formatDateString(review.createdDate)}
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

export default ReviewItem;
