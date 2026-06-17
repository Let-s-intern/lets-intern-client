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
    field,
    position,
    department,
  },
  handleEdit,
}: CareerCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const mutation = useDeleteUserCareerMutation();

  const handleDelete = () => {
    mutation.mutate(id!);
  };

  return (
    <div className="rounded-xs border-neutral-80 flex w-full flex-col gap-1 border p-4">
      <div className="flex items-center justify-between">
        <span className="text-neutral-0 text-sm">{job}</span>

        <div className="text-neutral-35 hidden items-center gap-2 text-sm md:flex">
          <span className="cursor-pointer px-2" onClick={() => handleEdit(id!)}>
            수정
          </span>
          <span className="bg-neutral-70 h-3 w-[1px]" />
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

      <div className="text-neutral-0 flex flex-wrap items-center gap-2 text-sm">
        <span>
          {employmentType === '기타(직접입력)'
            ? employmentTypeOther
            : employmentType}
        </span>
        <span className="text-neutral-40">
          {startDate} - {endDate || '재직중'}
        </span>
      </div>

      {(field || position || department) && (
        <div className="text-neutral-35 mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
          {field && <span>업무분야: {field}</span>}
          {position && <span>직책: {position}</span>}
          {department && <span>부서: {department}</span>}
        </div>
      )}

      <div className="text-neutral-35 mt-2.5 flex items-center gap-2 text-sm md:hidden">
        <span className="cursor-pointer px-2" onClick={() => handleEdit(id!)}>
          수정
        </span>
        <span className="bg-neutral-70 h-3 w-[1px]" />
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
      <div className="text-neutral-20 mx-6 my-5 text-sm">
        입력한 내용이 모두 삭제됩니다. 정말 삭제하시겠어요?
      </div>

      <div className="divide-neutral-80 border-neutral-80 flex h-[3.375rem] w-full divide-x border-t">
        <button
          onClick={closeModal}
          className="text-neutral-35 flex-1 text-sm font-medium"
        >
          취소
        </button>
        <button
          onClick={onDelete}
          className="text-primary flex-1 text-sm font-semibold"
        >
          삭제하기
        </button>
      </div>
    </BaseModal>
  );
};
