import {
  useDeleteUserExperienceMutation,
  UserExperienceFiltersQueryKey,
} from '@/api/experience/experience';
import BaseModal from '@/common/modal/BaseModal';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteCell = ({
  row,
  onFilterReset,
}: {
  row: any;
  onFilterReset?: () => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteUserExperience } = useDeleteUserExperienceMutation();

  const handleDelete = (row: any) => {
    deleteUserExperience(row.id, {
      onSuccess: () => {
        // 필터 초기화
        onFilterReset?.();
        // 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: [UserExperienceFiltersQueryKey],
        });
      },
    });
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Trash2
        size={20}
        className="text-neutral-30 cursor-pointer p-0.5"
        onClick={() => setIsDeleteModalOpen(true)}
      />

      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="h-fit w-[18.75rem]"
      >
        <div className="text-neutral-20 mx-6 my-5 text-sm">
          입력한 내용이 모두 삭제됩니다. 정말 삭제하시겠어요?
        </div>

        <div className="divide-neutral-80 border-neutral-80 flex h-[3.375rem] w-full divide-x border-t">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="text-neutral-35 flex-1 text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-primary flex-1 text-sm font-semibold"
          >
            삭제하기
          </button>
        </div>
      </BaseModal>
    </div>
  );
};

export default DeleteCell;
