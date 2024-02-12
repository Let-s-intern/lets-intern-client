import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import TableHead from '../../../components/admin/challenge/submit-check-detail/table/table-head/TableHead';
import TableRow from '../../../components/admin/challenge/submit-check-detail/table/table-body/TableRow';
import axios from '../../../utils/axios';

const ChallengeSubmitDetail = () => {
  const params = useParams();

  const [attendanceList, setAttendanceList] = useState<any>();

  const getAttendanceList = useQuery({
    queryKey: ['attendance', { missionId: params.missionId }],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get('/attendance', {
        params: queryKey[1],
      });
      const data = res.data;
      setAttendanceList(data.attendanceList);
      console.log(data);
      return data;
    },
  });

  const isLoading = getAttendanceList.isLoading || !attendanceList;

  return (
    <div className="mt-3 rounded bg-[#F7F7F7]">
      <TableHead />
      {!isLoading && (
        <div>
          {attendanceList.map((attendance: any, index: number) => (
            <TableRow
              key={attendance.id}
              attendance={attendance}
              th={index + 1}
              bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeSubmitDetail;
