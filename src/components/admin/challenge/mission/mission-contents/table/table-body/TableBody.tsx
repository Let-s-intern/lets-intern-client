import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableBodyBox from '../../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../../utils/axios';

const TableBody = () => {
  const [contentsList, setContentsList] = useState<any>();

  const getContentsList = useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      const res = await axios.get('/contents');
      const data = res.data;
      console.log(data);
      setContentsList(data.contentsList);
      return data;
    },
  });

  const isLoading = getContentsList.isLoading || !contentsList;

  if (isLoading) {
    return <></>;
  }

  return (
    <TableBodyBox>
      {contentsList.map((contents: any) => (
        <TableBodyRow key={contents.id} contents={contents} />
      ))}
    </TableBodyBox>
  );
};

export default TableBody;
