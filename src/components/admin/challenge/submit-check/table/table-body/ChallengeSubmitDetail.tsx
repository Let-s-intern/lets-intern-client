import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableHead from '../../../submit-check-detail/table/table-head/TableHead';
import TableRow from '../../../submit-check-detail/table/table-body/TableRow';
import axios from '../../../../../../utils/axios';
import Button from '../../../ui/button/Button';
import AccountDownloadButton from '../../account-download/AccountDownloadButton';

interface Props {
  mission: any;
  setIsDetailShown: (isDetailShown: boolean) => void;
}

const ChallengeSubmitDetail = ({ mission, setIsDetailShown }: Props) => {
  const [missionDetail, setMissionDetail] = useState();
  const [attendanceList, setAttendanceList] = useState<any>();

  const getMission = useQuery({
    queryKey: ['mission', 'detail', mission.id],
    queryFn: async () => {
      const res = await axios.get(`/mission/detail/${mission.id}`);
      const data = res.data;
      setMissionDetail(data);
      console.log(data);
      return data;
    },
  });

  const getAttendanceList = useQuery({
    queryKey: ['attendance', { missionId: mission.id }],
    queryFn: async () => {
      const res = await axios.get(`/attendance`, {
        params: { missionId: mission.id },
      });
      const data = res.data;
      setAttendanceList(data.attendanceList);
      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const isLoading =
    getAttendanceList.isLoading ||
    getMission.isLoading ||
    !attendanceList ||
    !missionDetail;

  return (
    <>
      {!isLoading && (
        <div className="rounded">
          <div className="flex justify-end bg-[#F1F1F1] px-6 py-3">
            <AccountDownloadButton mission={mission} />
          </div>
          <div className="">
            <div className="flex flex-col bg-[#F7F7F7]">
              <TableHead />
              {attendanceList.map((attendance: any, index: number) => (
                <TableRow
                  key={attendance.id}
                  attendance={attendance}
                  missionDetail={missionDetail}
                  th={index + 1}
                  bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
                />
              ))}
            </div>
          </div>
          <div className="mb-2 mt-4 flex justify-center">
            <Button onClick={() => setIsDetailShown(false)}>닫기</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeSubmitDetail;
