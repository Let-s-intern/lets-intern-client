import { useQuery } from '@tanstack/react-query';

import { useMemo } from 'react';
import DoneSection from '../../../components/common/mypage/review/section/DoneSection';
import WaitingSection from '../../../components/common/mypage/review/section/WaitingSection';
import axios from '../../../utils/axios';
import { ApplicationType } from './Application';

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
