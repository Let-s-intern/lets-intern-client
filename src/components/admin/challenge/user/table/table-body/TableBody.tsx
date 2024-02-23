import { useState } from 'react';
import TableBodyRow from './TableBodyRow';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import axios from '../../../../../../utils/axios';
import Pagination from '../../../../../ui/pagination/Pagination';

const TableBody = () => {
  const params = useParams();

  const [applicationList, setApplicationList] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<any>();

  const getApplicationList = useQuery({
    queryKey: [
      'application',
      'admin',
      'challenge',
      params.programId,
      { page: currentPage, size: 10 },
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/application/admin/challenge/${params.programId}`,
        { params: { page: currentPage, size: 10 } },
      );
      const data = res.data;
      setApplicationList(data.applicationList);
      setPageInfo(data.pageInfo);
      return data;
    },
  });

  const isLoading =
    getApplicationList.isLoading || applicationList === undefined;

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="mb-12 flex flex-col">
      {applicationList.map((application: any) => (
        <TableBodyRow
          key={application.applicationId}
          application={application}
        />
      ))}
      <Pagination
        className="mt-4"
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPage={pageInfo.totalPages}
      />
    </div>
  );
};

export default TableBody;
