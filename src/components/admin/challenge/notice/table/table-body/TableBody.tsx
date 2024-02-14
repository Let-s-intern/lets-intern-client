import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../utils/axios';
import { useParams } from 'react-router-dom';

const TableBody = () => {
  const params = useParams();

  const [noticeList, setNoticeList] = useState<any>();

  const { isLoading } = useQuery({
    queryKey: ['notice', params.programId],
    queryFn: async () => {
      const res = await axios.get(`/notice/${params.programId}`);
      const data = res.data;
      console.log(data);
      setNoticeList(data.noticeList);
      return data;
    },
  });

  if (isLoading || !noticeList) {
    return <></>;
  }

  return (
    <div className="border-b border-b-zinc-200 py-1">
      {noticeList.map((notice: any, index: number) => (
        <TableBodyRow key={notice.id} th={index + 1} notice={notice} />
      ))}
    </div>
  );
};

export default TableBody;
