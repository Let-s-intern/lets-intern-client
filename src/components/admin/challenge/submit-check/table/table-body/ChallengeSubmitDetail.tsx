import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import TableHead from '../../../submit-check-detail/table/table-head/TableHead';
import TableRow from '../../../submit-check-detail/table/table-body/TableRow';
import axios from '../../../../../../utils/axios';
import Button from '../../../ui/button/Button';
import AccountDownloadButton from '../../top-button/AccountDownloadButton';
import RefundChangeButton from '../../top-button/RefundChangeButton';

interface Props {
  mission: any;
  setIsDetailShown: (isDetailShown: boolean) => void;
}

const ChallengeSubmitDetail = ({ mission, setIsDetailShown }: Props) => {
  const [missionDetail, setMissionDetail] = useState();
  const [attendanceList, setAttendanceList] = useState<any>();
  const [isCheckedList, setIsCheckedList] = useState<any>([]);
  const [originalAttendanceList, setOriginalAttendanceList] = useState<any>();
  const [resultFilter, setResultFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      setOriginalAttendanceList(data.attendanceList);
      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!attendanceList) return;
    let filteredList = [...originalAttendanceList];
    if (resultFilter) {
      filteredList = filteredList.filter((attendance: any) => {
        return attendance.result === resultFilter;
      });
    }
    if (statusFilter) {
      filteredList = filteredList.filter((attendance: any) => {
        return attendance.status === statusFilter;
      });
    }
    setAttendanceList(filteredList);
    setIsCheckedList([]);
  }, [resultFilter, statusFilter]);

  const isLoading =
    getAttendanceList.isLoading ||
    getMission.isLoading ||
    !attendanceList ||
    !missionDetail;

  return (
    <>
      {!isLoading && (
        <div className="rounded">
          <div className="flex justify-between bg-[#F1F1F1] px-6 py-3">
            <RefundChangeButton
              isCheckedList={isCheckedList}
              setIsCheckedList={setIsCheckedList}
            />
            <AccountDownloadButton mission={mission} />
          </div>
          <div className="">
            <div className="flex flex-col bg-[#F7F7F7]">
              <TableHead
                attendanceList={attendanceList}
                isCheckedList={isCheckedList}
                setIsCheckedList={setIsCheckedList}
                resultFilter={resultFilter}
                setResultFilter={setResultFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              {attendanceList.map((attendance: any, index: number) => (
                <TableRow
                  key={attendance.id}
                  attendance={attendance}
                  missionDetail={missionDetail}
                  th={index + 1}
                  bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
                  isChecked={isCheckedList.includes(attendance.id)}
                  setIsCheckedList={setIsCheckedList}
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
