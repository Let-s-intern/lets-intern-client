import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableBodyBox from '../../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../../utils/axios';
import NewTableRowEditor from './NewTableRowEditor';
import { useParams } from 'react-router-dom';

interface Props {
  isModeAdd: boolean;
  setIsModeAdd: (isModeAdd: boolean) => void;
}

const TableBody = ({ isModeAdd, setIsModeAdd }: Props) => {
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

  if (getMissionList.isLoading || !missionList) {
    return <></>;
  }

  return (
    <>
      {isModeAdd && <NewTableRowEditor setIsModeAdd={setIsModeAdd} />}
      <TableBodyBox>
        {missionList.map((mission: any, index: number) => (
          <TableBodyRow key={mission.id} th={index + 1} mission={mission} />
        ))}
      </TableBodyBox>
    </>
  );
};

export default TableBody;
