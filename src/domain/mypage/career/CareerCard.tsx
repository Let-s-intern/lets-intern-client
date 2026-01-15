import { useDeleteUserCareerMutation } from '@/api/career/career';
import { CareerFormType } from '@/api/career/careerSchema';
import BaseModal from '@/common/modal/BaseModal';
import { useState } from 'react';

interface CareerCardProps {
  career: CareerFormType;
  handleEdit: (id: number) => void;
}

/**
 * 커리어 조회용 UI
 */
const CareerCard = ({
  career: {
    id,
    job,
    company,
    employmentType,
    employmentTypeOther,
    startDate,
    endDate,
  },
  handleEdit,
}: CareerCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const mutation = useDeleteUserCareerMutation();

  const handleDelete = () => {
    mutation.mutate(id!);
  };

  return (
    <div className="flex w-full flex-col gap-1 rounded-xs border border-neutral-80 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-0">{job}</span>

        <div className="hidden items-center gap-2 text-sm text-neutral-35 md:flex">
          <span className="cursor-pointer px-2" onClick={() => handleEdit(id!)}>
            수정
          </span>
          <span className="h-3 w-[1px] bg-neutral-70" />
          <span
            className="cursor-pointer px-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            삭제
          </span>
          <UserCareerDeleteModal
            isModalOpen={isDeleteModalOpen}
            closeModal={() => setIsDeleteModalOpen(false)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <div className="text-neutral-0">{company}</div>

      <div className="flex items-center gap-2 text-sm text-neutral-0">
        <span>
          {employmentType === '기타(직접입력)'
            ? employmentTypeOther
            : employmentType}
        </span>
        <span className="text-neutral-40">
          {startDate} - {endDate}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-sm text-neutral-35 md:hidden">
        <span className="cursor-pointer px-2" onClick={() => handleEdit(id!)}>
          수정
        </span>
        <span className="h-3 w-[1px] bg-neutral-70" />
        <span
          className="cursor-pointer px-2"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          삭제
        </span>
        <UserCareerDeleteModal
          isModalOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CareerCard;

const UserCareerDeleteModal = ({
  isModalOpen,
  closeModal,
  onDelete,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  onDelete: () => void;
}) => {
  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      className="h-fit w-[18.75rem]"
    >
      <div className="mx-6 my-5 text-sm text-neutral-20">
        입력한 내용이 모두 삭제됩니다. 정말 삭제하시겠어요?
      </div>

      <div className="flex h-[3.375rem] w-full divide-x divide-neutral-80 border-t border-neutral-80">
        <button
          onClick={closeModal}
          className="flex-1 text-sm font-medium text-neutral-35"
        >
          취소
        </button>
        <button
          onClick={onDelete}
          className="flex-1 text-sm font-semibold text-primary"
        >
          삭제하기
        </button>
      </div>
    </BaseModal>
  );
};
