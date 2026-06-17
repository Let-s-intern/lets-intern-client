import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import axios from '../../../../../utils/axios';
import ReviewItem from '../../review/ReviewItem';

export interface ReviewType {
  title: string;
  name: string;
  content: string;
  score: number;
  createdDate: string;
}

interface ReviewTabContentProps {
  programId: number;
  programType: string;
}

const ReviewTabContent = ({
  programId,
  programType,
}: ReviewTabContentProps) => {
  const [reviewList, setReviewList] = useState<ReviewType[]>([]);

  useQuery({
    queryKey: [programType, programId, 'reviews'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/reviews`, {
        params: {
          page: 1,
          size: 100000,
        },
      });
      setReviewList(res.data.data.reviewList);
      return res.data;
    },
  });

  return (
    <div className="py-2">
      <ul className="flex flex-col gap-2">
        {reviewList.map((review) => (
          <ReviewItem key={review.createdDate} review={review} />
        ))}
      </ul>
    </div>
  );
};

export default ReviewTabContent;
