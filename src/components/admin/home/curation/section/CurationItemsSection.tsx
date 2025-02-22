import { CurationItemType } from '@/api/curation';
import Heading2 from '@components/admin/ui/heading/Heading2';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import { Button } from '@mui/material';
import React from 'react';
import CurationItem from '../CurationItem';

interface CurationItemsSectionProps {
  curationItems: CurationItemType[];
  setCurationItems: React.Dispatch<React.SetStateAction<CurationItemType[]>>;
}

const CurationItemsSection = ({
  curationItems,
  setCurationItems,
}: CurationItemsSectionProps) => {
  const onClickAdd = () => {
    setCurationItems((prev) => [
      ...prev,
      {
        curationType: 'CHALLENGE',
        typeId: undefined,
      },
    ]);
  };

  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="flex w-full items-center justify-between">
        <Heading2>큐레이션 리스트</Heading2>
        <Button variant="contained" color="primary" onClick={onClickAdd}>
          추가
        </Button>
      </div>
      <div className="flex w-full flex-col gap-y-2.5">
        {curationItems.length === 0 ? (
          <EmptyContainer
            text="등록된 큐레이션 아이템이 없습니다."
            className="bg-neutral-95"
          />
        ) : (
          curationItems.map((item, index) => (
            <CurationItem
              key={index}
              item={item}
              onChangeItem={(item) => {
                setCurationItems((prev) => {
                  const newItems = [...prev];
                  newItems[index] = item;
                  return newItems;
                });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CurationItemsSection;
