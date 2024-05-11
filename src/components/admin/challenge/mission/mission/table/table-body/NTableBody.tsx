import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import TableBodyBox from '../../../../ui/table/table-body/TableBodyBox';
import { IMissionTemplate } from '../../../../../../../interfaces/interface';
import NTableBodyRow from './NTableBodyRow';
import NewTableBodyRow from './NewTableBodyRow';

interface NTableBodyProps {
  isModeAdd: boolean;
  list: IMissionTemplate[];
  setList: React.Dispatch<React.SetStateAction<IMissionTemplate[]>>;
  setIsModeAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

const NTableBody = ({
  list,
  setList,
  isModeAdd,
  setIsModeAdd,
}: NTableBodyProps) => {
  return (
    <TableBodyBox>
      {isModeAdd && (
        <NewTableBodyRow setList={setList} setIsModeAdd={setIsModeAdd} />
      )}
      {list.map((item) => (
        <NTableBodyRow key={item.id} item={item} setList={setList} />
      ))}
    </TableBodyBox>
  );
};

export default NTableBody;
