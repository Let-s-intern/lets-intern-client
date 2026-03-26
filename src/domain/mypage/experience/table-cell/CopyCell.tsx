import { UserExperienceType } from '@/api/experience/experienceSchema';
import BaseModal from '@/common/modal/BaseModal';
import { Copy } from 'lucide-react';
import { useState } from 'react';

const CopyCell = ({
  row,
  onCopy,
}: {
  row: any;
  onCopy: (copiedExperience: UserExperienceType) => void;
}) => {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  const handleCopy = () => {
    setIsCopyModalOpen(false);

    // 기본 정보만 복제
    const copiedExperience = {
      ...row,
      id: undefined,
      title: `${row.title}_복제`,
      // STAR 내용 제거
      situation: '',
      task: '',
      action: '',
      result: '',
      reflection: '',
      coreCompetency: '',
    };
    onCopy(copiedExperience);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex h-full w-full items-center justify-center"
    >
      <Copy
        size={20}
        className="cursor-pointer p-0.5 text-neutral-30"
        onClick={(e) => {
          e.stopPropagation();
          setIsCopyModalOpen(true);
        }}
      />
      <BaseModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        className="h-fit w-[312px]"
      >
        <div className="mx-6 my-5 text-neutral-20">
          <div className="mb-2 text-xsmall16 font-semibold">
            해당 경험을 복제하시겠어요?
          </div>
          <div className="text-xsmall14">
            기본 정보만 복제되며, 상세 내용은 포함되지 않습니다.
          </div>
        </div>

        <div className="flex h-[3.375rem] w-full divide-x divide-neutral-80 border-t border-neutral-80">
          <button
            onClick={() => setIsCopyModalOpen(false)}
            className="flex-1 text-sm font-medium text-neutral-35"
          >
            취소
          </button>
          <button
            onClick={() => handleCopy()}
            className="flex-1 text-sm font-semibold text-primary"
          >
            복제하기
          </button>
        </div>
      </BaseModal>
    </div>
  );
};

export default CopyCell;
