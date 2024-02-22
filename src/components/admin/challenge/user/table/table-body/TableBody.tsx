import { useState } from 'react';
import TableBodyRow from './TableBodyRow';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import axios from '../../../../../../utils/axios';

const TableBody = () => {
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

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      {applicationList.map((application: any) => (
        <TableBodyRow
          key={application.applicationId}
          application={application}
        />
      ))}
    </div>
  );
};

export default TableBody;
