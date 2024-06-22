import { useState } from 'react';
import { Attendance, Mission } from '../../../../../../schema';
import TableRow from '../../../submit-check-detail/table/table-body/TableRow';
import TableHead from '../../../submit-check-detail/table/table-head/TableHead';
import Button from '../../../ui/button/Button';
import {
  missionStatusToText,
  newMissionStatusToText,
} from '../../../../../../utils/convert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../../utils/axios';

interface Props {
  mission: Mission;
  setIsDetailShown: (isDetailShown: boolean) => void;
  attendances: Attendance[];
  refetch: () => void;
}

const ChallengeSubmitDetail = ({
  mission,
  setIsDetailShown,
  attendances,
  refetch,
}: Props) => {
  const queryClient = useQueryClient();

  const [isCheckedList, setIsCheckedList] = useState<Array<number>>([]);
  const [resultFilter, setResultFilter] = useState<Attendance['result'] | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<Attendance['status'] | null>(
    null,
  );

  const editMissionStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await axios.patch(`/mission/${mission.id}`, {
        status,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mission'],
      });
    },
  });

  const handleChangeMissionStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    editMissionStatus.mutate(e.target.value);
  };

  return (
    <div className="rounded">
      <div className="flex justify-end bg-[#F1F1F1] px-6 py-3">
        {/* <RefundChangeButton
          isCheckedList={isCheckedList}
          setIsCheckedList={setIsCheckedList}
        /> */}
        {/* <AccountDownloadButton mission={mission} /> */}
        <select
          name="missionStatusType"
          id="missionStatusType"
          className="rounded-sm border border-gray-400 bg-transparent px-2 py-1 text-sm"
          onChange={handleChangeMissionStatus}
        >
          {Object.keys(newMissionStatusToText).map((key) => (
            <option key={key} value={key}>
              {newMissionStatusToText[key]}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <div className="flex flex-col bg-[#F7F7F7]">
          <TableHead
            attendances={attendances ?? []}
            isCheckedList={isCheckedList}
            setIsCheckedList={setIsCheckedList}
            resultFilter={resultFilter}
            setResultFilter={setResultFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          {attendances?.map((attendance, index) => (
            <TableRow
              key={attendance.id}
              attendance={attendance}
              missionDetail={mission}
              th={index + 1}
              bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
              isChecked={isCheckedList.includes(attendance.id)}
              setIsCheckedList={setIsCheckedList}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
      <div className="mb-2 mt-4 flex justify-center">
        <Button onClick={() => setIsDetailShown(false)}>닫기</Button>
      </div>
    </div>
  );
};

export default ChallengeSubmitDetail;
