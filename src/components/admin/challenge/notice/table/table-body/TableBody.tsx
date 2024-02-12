import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableBodyRow from './TableBodyRow';
import axios from '../../../../../../utils/axios';

const TableBody = () => {
  const [noticeList, setNoticeList] = useState<any>();

  const { isLoading } = useQuery({
    queryKey: ['notice', 19],
    queryFn: async () => {
      const res = await axios.get(`/notice/19`);
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
