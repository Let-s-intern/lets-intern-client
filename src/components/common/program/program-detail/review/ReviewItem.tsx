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

  const makeMaskingName = () => {
    if (review.name === '익명') return review.name;
    if (review.name.length === 2) return review.name[0] + '*';
    if (review.name.length >= 3) {
      return (
        review.name[0] +
        '*'.repeat(review.name.length - 2) +
        review.name[review.name.length - 1]
      );
    }
  };

  return (
    <li className="flex flex-col gap-2 rounded-md bg-neutral-0 bg-opacity-5 px-8 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary">{makeMaskingName()}</span>
          <span className="text-neutral-45">
            {formatDateString(review.createdDate)}
          </span>
        </div>
        <p>{review.content}</p>
      </div>
    </li>
  );
};

export default ReviewItem;
