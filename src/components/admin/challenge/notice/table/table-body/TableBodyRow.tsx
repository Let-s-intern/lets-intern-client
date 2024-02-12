import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { challengeNoticeCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from './TableBodyCell';
import NoticeEditorModal from '../../../ui/modal/NoticeEditorModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../../utils/axios';

interface Props {
  notice: any;
  th: number;
}

const TableBodyRow = ({ notice, th }: Props) => {
  const queryClient = useQueryClient();

  const [isModalShown, setIsModalShown] = useState(false);
  const [values, setValues] = useState<any>({ ...notice });

  const editNotice = useMutation({
    mutationFn: async (values) => {
      const res = await axios.patch(`/notice/${notice.id}`, values);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notice'] });
      setIsModalShown(false);
    },
  });

  const cellWidthList = challengeNoticeCellWidthList;

  const handleNoticeEdit = (e: any) => {
    e.preventDefault();
    editNotice.mutate(values);
  };

  return (
    <>
      <div className="flex items-center py-2 font-pretendard">
        <TableBodyCell className={clsx(cellWidthList[0])}>{th}</TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[1])}>
          {notice.type === 'ESSENTIAL'
            ? '필수'
            : notice.type === 'ADDITIONAL' && '선택'}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[2])}>
          <Link to={notice.link} target="_blank" className="underline">
            {notice.title}
          </Link>
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[3])}>
          {notice.createdAt}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[4])}>
          <div className="flex items-center justify-center gap-4">
            <span
              className="cursor-pointer font-medium"
              onClick={() => setIsModalShown(true)}
            >
              수정
            </span>
            <span className="cursor-pointer font-medium">삭제</span>
          </div>
        </TableBodyCell>
      </div>
      {isModalShown && (
        <NoticeEditorModal
          setIsModalShown={setIsModalShown}
          onSubmit={handleNoticeEdit}
          values={values}
          setValues={setValues}
        />
      )}
    </>
  );
};

export default TableBodyRow;
