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
        className="text-neutral-30 cursor-pointer p-0.5"
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
        <div className="text-neutral-20 mx-6 my-5">
          <div className="text-xsmall16 mb-2 font-semibold">
            해당 경험을 복제하시겠어요?
          </div>
          <div className="text-xsmall14">
            기본 정보만 복제되며, 상세 내용은 포함되지 않습니다.
          </div>
        </div>

        <div className="divide-neutral-80 border-neutral-80 flex h-[3.375rem] w-full divide-x border-t">
          <button
            onClick={() => setIsCopyModalOpen(false)}
            className="text-neutral-35 flex-1 text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={() => handleCopy()}
            className="text-primary flex-1 text-sm font-semibold"
          >
            복제하기
          </button>
        </div>
      </BaseModal>
    </div>
  );
};

export default CopyCell;
