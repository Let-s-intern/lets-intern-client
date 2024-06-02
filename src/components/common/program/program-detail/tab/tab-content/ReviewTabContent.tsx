import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaStar } from 'react-icons/fa';

import axios from '../../../../../../utils/axios';

interface ReviewTabContentProps {
  programId: number;
  programType: string;
}

const ReviewTabContent = ({
  programId,
  programType,
}: ReviewTabContentProps) => {
  const [review, setReview] = useState<string>('');

  useQuery({
    queryKey: [programType, programId, 'reviews'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/reviews`);
      console.log(res.data);
      setReview(res.data.data.content.description);
      return res.data;
    },
  });

  return (
    <div className="py-2">
      <ul>
        <li className="flex flex-col gap-2 rounded-md bg-neutral-0 bg-opacity-5 px-8 py-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary">agelin4545@naver.com</span>
              <span className="text-neutral-45">2024년 05월 11일</span>
            </div>
            <p>
              어떤 프로세스로 자기소개서를 준비할 수 있는지 스트레스를 줄이는
              작은 단위로 작성 준비가 가능한 것이 매력적이었습니다. 오늘의
              미션을 따라가다보면 어느새 원리의 이해와 작성본이라는 산출물이
              있어 지원서를 작성하는데 큰 도움이 되었습니다. 좋은 프로그램 운영
              감사합니다!
            </p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 2 }, (_, index) => index + 1).map((th) => (
              <span className="text-primary">
                <FaStar />
              </span>
            ))}
            {Array.from({ length: 3 }, (_, index) => index + 1).map((th) => (
              <span className="text-neutral-70">
                <FaStar />
              </span>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ReviewTabContent;
