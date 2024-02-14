import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CiTrash } from 'react-icons/ci';

import axios from '../../../../../../utils/axios';
import AlertModal from '../../../../../ui/alert/AlertModal';

interface Props {
  mission: any;
}

const DeleteButton = ({ mission }: Props) => {
  const queryClient = useQueryClient();

  const [isAlertShown, setIsAlertShown] = useState(false);

  const deleteMission = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/mission/${mission.id}`);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mission'] });
      setIsAlertShown(false);
    },
  });

  const handleMissionDelete = () => {
    deleteMission.mutate();
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
          onConfirm={handleMissionDelete}
          title="미션 삭제"
          onCancel={(e: any) => {
            e.stopPropagation();
            setIsAlertShown(false);
          }}
        >
          정말로 삭제하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default DeleteButton;
