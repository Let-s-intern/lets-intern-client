import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CiTrash } from 'react-icons/ci';

import axios from '../../../../../../utils/axios';
import AlertModal from '../../../../../ui/alert/AlertModal';

interface Props {
  contents: any;
}

const DeleteButton = ({ contents }: Props) => {
  const queryClient = useQueryClient();

  const [isAlertShown, setIsAlertShown] = useState(false);

  const deleteMission = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/contents/${contents.id}`);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contents'] });
      setIsAlertShown(false);
    },
  });

  const handleContentsDelete = () => {
    deleteMission.mutate();
  };

  const handleAlertClose = (e: any) => {
    e.stopPropagation();
    setIsAlertShown(false);
  };

  return (
    <>
      <i
        className="text-[1.75rem]"
        onClick={(e) => {
          e.stopPropagation();
          setIsAlertShown(true);
        }}
      >
        <CiTrash />
      </i>
      {isAlertShown && (
        <AlertModal
          onConfirm={handleContentsDelete}
          title="콘텐츠 삭제"
          onCancel={handleAlertClose}
        >
          정말로 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default DeleteButton;
