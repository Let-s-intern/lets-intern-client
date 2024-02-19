import clsx from 'clsx';

import TableBodyCell from '../../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../../ui/table/table-body/TableBodyRowBox';
import { missionContentsCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import { contentsTypeToText } from '../../../../../../../utils/convert';
import DeleteButton from '../../button/DeleteButton';

interface Props {
  contents: any;
  menuShown: 'DETAIL' | 'EDIT' | 'NONE';
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowContent = ({ contents, menuShown, setMenuShown }: Props) => {
  const cellWidthList = missionContentsCellWidthList;

  const copyContentsLink = () => {
    const url = contents.link;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('복사에 실패했습니다:', err);
      });
  };

  return (
    <TableBodyRowBox
      onClick={() => setMenuShown(menuShown !== 'DETAIL' ? 'DETAIL' : 'NONE')}
    >
      <TableBodyCell className={clsx(cellWidthList[0])}>
        {contentsTypeToText[contents.type]}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[1])} bold>
        <span className="ml-16 flex-1 text-left">{contents.title}</span>
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>
        <div
          className="flex items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="cursor-pointer" onClick={() => copyContentsLink()}>
            <img src="/icons/share-icon.svg" alt="share-icon" />
          </i>
          <i className="cursor-pointer" onClick={() => setMenuShown('EDIT')}>
            <img src="/icons/edit-icon.svg" alt="edit-icon" />
          </i>
          <DeleteButton contents={contents} />
        </div>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableRowContent;
