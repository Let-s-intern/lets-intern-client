import { useBulkPatchAdminAttendance } from '@/api/attendance/attendance';
import AlertModal from '@/common/alert/AlertModal';
import { AttendanceItem, Mission } from '@/schema';
import { attendanceResultToText } from '@/utils/convert';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import TableRow from '../../../submit-check-detail/table/table-body/TableRow';
import TableHead from '../../../submit-check-detail/table/table-head/TableHead';
import Button from '../../../ui/button/Button';

type BulkResult = 'PASS' | 'WRONG' | 'FINAL_WRONG';

const BULK_RESULT_OPTIONS: BulkResult[] = ['PASS', 'WRONG', 'FINAL_WRONG'];

interface Props {
  mission: Mission;
  setIsDetailShown: (isDetailShown: boolean) => void;
  attendances: AttendanceItem[];
  refetch: () => void;
}

const ChallengeSubmitDetail = ({
  mission,
  setIsDetailShown,
  attendances,
  refetch,
}: Props) => {
  const queryClient = useQueryClient();

  const [isCheckedList, setIsCheckedList] = useState<number[]>([]);
  const [resultFilter, setResultFilter] = useState<
    AttendanceItem['attendance']['result'] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<
    AttendanceItem['attendance']['status'] | null
  >(null);
  const [pendingResult, setPendingResult] = useState<BulkResult | null>(null);
  const [dropdownValue, setDropdownValue] = useState('');

  const bulkPatch = useBulkPatchAdminAttendance();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as BulkResult;
    if (!value) return;
    setPendingResult(value);
    setDropdownValue('');
  };

  const handleConfirm = async () => {
    if (!pendingResult || isCheckedList.length === 0) return;
    try {
      await bulkPatch.mutateAsync({
        attendanceIdList: isCheckedList,
        result: pendingResult,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin'] }),
        queryClient.invalidateQueries({ queryKey: ['challenge'] }),
      ]);
      setIsCheckedList([]);
      refetch();
    } catch (error) {
      console.error('일괄 변경 실패:', error);
    } finally {
      setPendingResult(null);
    }
  };

  return (
    <div className="w-full rounded">
      <div className="flex justify-end bg-[#F1F1F1] px-6 py-3">
        <select
          value={dropdownValue}
          className="rounded-sm border border-gray-400 bg-transparent px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onChange={handleSelectChange}
          disabled={isCheckedList.length === 0}
        >
          <option value="">확인여부 일괄변경</option>
          {BULK_RESULT_OPTIONS.map((result) => (
            <option key={result} value={result}>
              {attendanceResultToText[result]}
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
          {attendances?.map((item, index) => (
            <TableRow
              key={item.attendance.id}
              attendanceItem={item}
              missionDetail={mission}
              th={index + 1}
              bgColor={(index + 1) % 2 === 1 ? 'DARK' : 'LIGHT'}
              isChecked={isCheckedList.includes(item.attendance.id)}
              setIsCheckedList={setIsCheckedList}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
      <div className="mb-2 mt-4 flex justify-center">
        <Button onClick={() => setIsDetailShown(false)}>닫기</Button>
      </div>
      {pendingResult && (
        <AlertModal
          title="확인여부 일괄변경"
          onConfirm={handleConfirm}
          onCancel={() => setPendingResult(null)}
          disabled={bulkPatch.isPending}
        >
          선택한 {isCheckedList.length}명의 확인 여부를 &apos;
          {attendanceResultToText[pendingResult]}&apos;로 변경하시겠습니까?
        </AlertModal>
      )}
    </div>
  );
};

export default ChallengeSubmitDetail;
