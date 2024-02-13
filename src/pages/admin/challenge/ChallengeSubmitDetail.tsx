import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import TableHead from '../../../components/admin/challenge/submit-check-detail/table/table-head/TableHead';
import TableRow from '../../../components/admin/challenge/submit-check-detail/table/table-body/TableRow';
import axios from '../../../utils/axios';
import TableBodyRow from '../../../components/admin/challenge/submit-check/table/table-body/TableBodyRow';

const ChallengeSubmitDetail = () => {
  const params = useParams();

  const [mission, setMission] = useState<any>();
  const [attendanceList, setAttendanceList] = useState<any>();

  const getMission = useQuery({
    queryKey: ['mission', 'detail', params.missionId],
    queryFn: async () => {
      const res = await axios.get(`/mission/detail/${params.missionId}`);
      const data = res.data;
      setMission(data);
      console.log(data);
      return data;
    },
  });

  const getAttendanceList = useQuery({
    queryKey: ['attendance', { missionId: params.missionId, size: 10 }],
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

  const isLoading =
    getAttendanceList.isLoading ||
    getMission.isLoading ||
    !attendanceList ||
    !mission;

  return (
    <div className="mt-3 rounded">
      {!isLoading && (
        <>
          <TableBodyRow th={1} mission={mission} />
          <div className="mb-24 mt-2 flex flex-col bg-[#F7F7F7]">
            <TableHead />
            {attendanceList.map((attendance: any, index: number) => (
              <TableRow
                key={attendance.id}
                attendance={attendance}
                th={index + 1}
                bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
              />
            ))}
            {Array.from(
              { length: 10 - attendanceList.length },
              (_, index) => index + 1,
            ).map((index) => (
              <TableRow
                key={index}
                bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeSubmitDetail;
