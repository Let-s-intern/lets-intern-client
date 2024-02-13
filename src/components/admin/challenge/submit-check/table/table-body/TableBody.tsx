import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableBodyBox from '../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../utils/axios';

const TableBody = () => {
  const [missionList, setMissionList] = useState<any>();

  const getMissionList = useQuery({
    queryKey: ['mission', 19],
    queryFn: async () => {
      const res = await axios.get('/mission/19');
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
