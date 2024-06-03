import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
import DoneSection from '../../../components/common/mypage/review/section/DoneSection';
import WaitingSection from '../../../components/common/mypage/review/section/WaitingSection';
import { ApplicationType } from './Application';
import axios from '../../../utils/axios';

const Review = () => {
  const [waitingApplicationList, setWaitingApplicationList] = useState<
    ApplicationType[]
  >([]);
  const [doneApplicationList, setDoneApplicationList] = useState<
    ApplicationType[]
  >([]);

  useQuery({
    queryKey: ['application'],
    queryFn: async () => {
      const res = await axios.get('/application');
      const tempApplicationList = res.data.data.applicationList;
      console.log(tempApplicationList);
      setWaitingApplicationList(
        tempApplicationList.filter(
          (application: ApplicationType) =>
            application.status !== 'WAITING' && application.reviewId === null,
        ),
      );
      setDoneApplicationList(
        tempApplicationList.filter(
          (application: ApplicationType) =>
            application.status !== 'WAITING' && application.reviewId !== null,
        ),
      );
      return res.data;
    },
  });

  return (
    <main className="flex flex-col gap-16 pb-20">
      <WaitingSection applicationList={waitingApplicationList} />
      <DoneSection applicationList={doneApplicationList} />
    </main>
  );
};

export default Review;
