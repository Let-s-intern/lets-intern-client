import { Button } from '@mui/material';
import { useState } from 'react';

import { useGetProgramAdminQuery } from '@/api/program';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ProgramTypeUpperCase } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import ProgramSelectModal from './modal/ProgramSelectModal';
import ProgramRecommendItem from './ui/ProgramRecommendItem';

interface ProgramRecommendEditorProps {
  programRecommend: ProgramRecommend;
  setProgramRecommend: (value: ProgramRecommend) => void;
}

const ProgramRecommendEditor = ({
  programRecommend,
  setProgramRecommend,
}: ProgramRecommendEditorProps) => {
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const programAdminRes = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
  });

  const onChangeItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    programType: ProgramTypeUpperCase,
  ) => {
    const index = programRecommend.list.findIndex(
      (ele) =>
        ele.programInfo.id === id &&
        ele.programInfo.programType === programType,
    );

    if (index === -1) return;

    const item = {
      ...programRecommend.list[index],
      programInfo: {
        ...programRecommend.list[index].programInfo,
      },
      classificationList: [...programRecommend.list[index].classificationList],
      [e.target.name]: e.target.value,
    };

    setProgramRecommend({
      list: [
        ...programRecommend.list.slice(0, index),
        item,
        ...programRecommend.list.slice(index + 1),
      ],
    });
  };

  return (
    <>
      <Heading2 className="mb-2">프로그램 추천</Heading2>
      <div className="mb-4">
        <Button variant="outlined" onClick={() => setSelectModalOpen(true)}>
          프로그램 선택
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-full flex-col gap-2">
          {programRecommend.list.map((item) => (
            <ProgramRecommendItem
              key={item.programInfo.id}
              item={item}
              onChangeItem={onChangeItem}
            />
          ))}
        </div>
      </div>

      <ProgramSelectModal
        open={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        programRecommend={programRecommend}
        setProgramRecommend={setProgramRecommend}
        programList={programAdminRes.data?.programList}
      />
    </>
  );
};

export default ProgramRecommendEditor;
