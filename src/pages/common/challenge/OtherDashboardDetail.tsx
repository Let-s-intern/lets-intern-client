import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import OtherMissionItem from '../../../components/common/challenge/other-challenge/mission/OtherMissionItem';
import Introduction from '../../../components/common/challenge/other-challenge/introduction/Introduction';
import { wishJobToText } from '../../../utils/convert';
import WishJob from '../../../components/common/challenge/other-challenge/wish-job/WishJob';

const OtherDashboardDetail = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [dashboard, setDashboard] = useState<any>();
  const [wishJobList, setWishJobList] = useState<any>();

  const getAttendanceList = useQuery({
    queryKey: ['attendance', params.applicationId],
    queryFn: async () => {
      const res = await axios.get(`/attendance/${params.applicationId}`);
      const data = res.data;
      setDashboard(data);
      setWishJobList(data.wishJobList);
      console.log(data);
      return data;
    },
  });

  if (getAttendanceList.isLoading || !dashboard) {
    return <main />;
  }

  return (
    <main className="px-6">
      <header>
        <Link
          to="#"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          <i>
            <FaArrowLeft />
          </i>
          <span>이전으로</span>
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{dashboard.name}의 기록장</h1>
        <WishJob dashboard={dashboard} wishJobList={wishJobList} />
        <Introduction dashboard={dashboard} />
      </header>
      <div className="mt-6">
        <ul className="flex flex-col gap-4">
          {dashboard.attendanceList.map((mission: any) => (
            <OtherMissionItem key={mission.attendanceId} mission={mission} />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default OtherDashboardDetail;
