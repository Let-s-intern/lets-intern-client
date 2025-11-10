import { useDeleteUserExperienceMutation } from '@/api/experience';
import BaseModal from '@components/ui/BaseModal';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteCell = ({ row }: { row: any }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteUserExperience } = useDeleteUserExperienceMutation();

  const handleDelete = (row: any) => {
    deleteUserExperience(row.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Trash2
        size={20}
        className="cursor-pointer p-0.5 text-neutral-30"
        onClick={() => setIsDeleteModalOpen(true)}
      />

      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="h-fit w-[18.75rem]"
      >
        <div className="mx-6 my-5 text-sm text-neutral-20">
          입력한 내용이 모두 삭제됩니다. 정말 삭제하시겠어요?
        </div>

        <div className="flex h-[3.375rem] w-full divide-x divide-neutral-80 border-t border-neutral-80">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 text-sm font-medium text-neutral-35"
          >
            취소
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="flex-1 text-sm font-semibold text-primary"
          >
            삭제하기
          </button>
        </div>
      </BaseModal>
    </div>
  );
};

export default DeleteCell;
