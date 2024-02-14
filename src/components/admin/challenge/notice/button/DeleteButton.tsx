import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AlertModal from '../../../../ui/alert/AlertModal';
import axios from '../../../../../utils/axios';

interface Props {
  notice: any;
}

const DeleteButton = ({ notice }: Props) => {
  const queryClient = useQueryClient();

  const [isAlertShown, setIsAlertShown] = useState(false);

  const deleteNotice = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/notice/${notice.id}`);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notice'] });
      setIsAlertShown(false);
    },
  });

  const handleNoticeDelete = () => {
    deleteNotice.mutate();
  };

  return (
    <>
      <button className="font-medium" onClick={() => setIsAlertShown(true)}>
        삭제
      </button>
      {isAlertShown && (
        <AlertModal
          onConfirm={handleNoticeDelete}
          title="공지사항 삭제"
          onCancel={() => setIsAlertShown(false)}
        >
          정말로 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default DeleteButton;
