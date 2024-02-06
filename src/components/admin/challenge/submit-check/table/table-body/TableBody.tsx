import TableBodyBox from '../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';

const TableBody = () => {
  return (
    <TableBodyBox>
      {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
        <TableBodyRow
          key={th}
          th="1일차"
          name="n일차. 미션이름"
          releaseDate="2024.01.26"
          dueDate="2024.01.27 8:00 "
          isRefunded={true}
          connectedContents="경험정리"
          submitCount={93}
          totalCount={100}
          checkStatus="DONE"
          refundStatus="DONE"
        />
      ))}
    </TableBodyBox>
  );
};

export default TableBody;
