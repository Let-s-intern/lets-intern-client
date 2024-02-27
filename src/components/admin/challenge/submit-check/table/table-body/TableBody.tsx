import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import TableBodyBox from '../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../utils/axios';

const TableBody = () => {
  const params = useParams();

  const [missionList, setMissionList] = useState<any>();

  const getMissionList = useQuery({
    queryKey: ['mission', 'admin', params.programId],
    queryFn: async () => {
      const res = await axios.get(`/mission/admin/${params.programId}`);
      const data = res.data;
      console.log(data);
      setMissionList(data.missionList);
      return data;
    },
  });

  const isLoading = getMissionList.isLoading || !missionList;

  if (isLoading) {
    return <></>;
  }

  return (
    <TableBodyBox>
      {missionList.map((mission: any, index: number) => (
        <TableBodyRow key={mission.id} th={index + 1} mission={mission} />
      ))}
    </TableBodyBox>
  );
};

export default TableBody;
