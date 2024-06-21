import { useQuery } from '@tanstack/react-query';

import { useEffect, useMemo, useState } from 'react';
import DoneSection from '../../../components/common/mypage/review/section/DoneSection';
import WaitingSection from '../../../components/common/mypage/review/section/WaitingSection';
import { ApplicationType } from './Application';
import axios from '../../../utils/axios';

const Review = () => {
  // const [waitingApplicationList, setWaitingApplicationList] = useState<
  //   ApplicationType[]
  // >([]);
  // const [doneApplicationList, setDoneApplicationList] = useState<
  //   ApplicationType[]
  // >([]);

  const { data } = useQuery({
    queryKey: ['user', 'applications'],
    queryFn: async () => {
      const res = await axios.get('/user/applications');
      // const tempApplicationList = res.data.data.applicationList;
      // console.log(tempApplicationList);
      // setWaitingApplicationList(
      //   tempApplicationList.filter(
      //     (application: ApplicationType) =>
      //       application.status !== 'WAITING' && application.reviewId === null,
      //   ),
      // );
      // setDoneApplicationList(
      //   tempApplicationList.filter(
      //     (application: ApplicationType) =>
      //       application.status !== 'WAITING' && application.reviewId !== null,
      //   ),
      // );
      return res.data;
    },
  });

  const doneList = useMemo(() => {
    return (
      data?.data?.applicationList?.filter(
        (application: ApplicationType) =>
          application.status !== 'WAITING' && application.reviewId !== null,
      ) || []
    );
  }, [data?.data?.applicationList]);

  const waitingList = useMemo(() => {
    return (
      data?.data?.applicationList?.filter(
        (application: ApplicationType) =>
          application.status !== 'WAITING' && application.reviewId === null,
      ) || []
    );
  }, [data?.data?.applicationList]);

  return (
    <main className="flex w-full flex-col gap-16 pb-20">
      <WaitingSection applicationList={waitingList} />
      <DoneSection applicationList={doneList} />
    </main>
  );
};

export default Review;
