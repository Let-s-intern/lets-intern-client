import { Button } from '@mui/material';
import { useState } from 'react';

import { useGetProgramAdminQuery } from '@/api/program';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ProgramTypeUpperCase } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import ProgramSelectModal from './ProgramSelectModal';

interface ProgramRecommendEditorProps {
  programRecommend: ProgramRecommend;
  setProgramRecommend: (value: ProgramRecommend) => void;
}

export default function ProgramRecommendEditor({
  programRecommend,
  setProgramRecommend,
}: ProgramRecommendEditorProps) {
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
}

import Input from '@/common/input/v1/Input';

interface ProgramRecommendItemProps {
  item: ProgramRecommend['list'][number];
  onChangeItem: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    programType: ProgramTypeUpperCase,
  ) => void;
}

function ProgramRecommendItem({
  item,
  onChangeItem,
}: ProgramRecommendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xs bg-neutral-60 h-32 w-40 flex-none border"
        style={{
          backgroundImage: `url(${item.programInfo.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-xxsmall12 flex h-full items-center justify-center bg-black bg-opacity-30 p-2">
          <span className="text-white">{item.programInfo.title}</span>
        </div>
      </div>
      <div className="flex w-full max-w-xl flex-col gap-2">
        <Input
          label="제목"
          type="text"
          name="recommendTitle"
          placeholder="프로그램 추천 제목을 입력해주세요"
          value={item.recommendTitle ?? ''}
          maxLength={18}
          size="small"
          onChange={(e) =>
            onChangeItem(e, item.programInfo.id, item.programInfo.programType)
          }
        />
        <Input
          label="CTA"
          type="text"
          name="recommendCTA"
          placeholder="프로그램 추천 CTA를 입력해주세요"
          value={item.recommendCTA ?? ''}
          maxLength={16}
          size="small"
          onChange={(e) =>
            onChangeItem(e, item.programInfo.id, item.programInfo.programType)
          }
        />
      </div>
    </div>
  );
}
