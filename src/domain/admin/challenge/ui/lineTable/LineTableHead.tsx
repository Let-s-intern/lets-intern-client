import clsx from 'clsx';
import TableHeadCell from '../table/table-head/TableHeadCell';

interface LineTableHeadProps {
  colNames: string[];
  cellWidthList: string[];
  editable?: boolean;
}

/**
 * 테이블 헤더 컴포넌트
 * @param colNames - 테이블 헤더에 표시할 컬럼 이름 (배열 순서대로 컬럼에 표시)
 * @param cellWidthList - 테이블 헤더 셀의 너비 리스트 (column과 순서 일치해야 함)
 * @param editable - 수정/삭제가 가능한지 여부 (우측 버튼이 보이고 안보임) @deafult true
 */
const LineTableHead = ({
  colNames,
  cellWidthList,
  editable = true,
}: LineTableHeadProps) => {
  return (
    <div className={clsx('flex w-full rounded-sm bg-neutral-200')}>
      {colNames.map((name, i) => (
        <TableHeadCell key={name} className={cellWidthList[i]}>
          {name}
        </TableHeadCell>
      ))}
      {editable ? (
        <TableHeadCell className="min-w-[100px] flex-1">관리</TableHeadCell>
      ) : null}
    </div>
  );
};

export default LineTableHead;
