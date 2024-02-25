import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import TableBody from '../../../components/admin/challenge/user/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/user/table/table-head/TableHead';
import TopActionGroup from '../../../components/admin/challenge/user/table/top-action-group/TopActionGroup';
import axios from '../../../utils/axios';

const ChallengeUser = () => {
  const params = useParams();

  const [applicationList, setApplicationList] = useState<any>();

  const getApplicationList = useQuery({
    queryKey: ['application', 'admin', 'challenge', params.programId],
    queryFn: async () => {
      const res = await axios.get(
        `/application/admin/challenge/${params.programId}`,
      );
      const data = res.data;
      setApplicationList(data.applicationList);
      return data;
    },
  });

  const isLoading =
    getApplicationList.isLoading || applicationList === undefined;

  return (
    <div className="px-12">
      <div className="mt-6 px-3">
        <Heading>참여자</Heading>
      </div>
      <div className="pt-2">
        <TopActionGroup applicationList={applicationList} />
        <TableHead />
        {!isLoading && <TableBody applicationList={applicationList} />}
      </div>
    </div>
  );
};

export default ChallengeUser;
