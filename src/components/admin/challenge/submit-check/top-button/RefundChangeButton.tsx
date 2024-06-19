import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';

interface Props {
  isCheckedList: any;
  setIsCheckedList: (isCheckedList: any) => void;
}

const RefundChangeButton = ({ isCheckedList, setIsCheckedList }: Props) => {
  const queryClient = useQueryClient();

  const editIsRefunded = useMutation({
    mutationFn: async (attendanceId: number) => {
      const res = await axios.patch(`/attendance/${attendanceId}`, {
        isRefunded: true,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attendance'],
      });
    },
  });

  const handleRefundChange = () => {
    isCheckedList.forEach((applicationId: number) => {
      editIsRefunded.mutate(applicationId);
    });
  };

  return (
    <button
      className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
      onClick={handleRefundChange}
    >
      환급 완료로 변경
    </button>
  );
};

export default RefundChangeButton;
