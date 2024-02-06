import TableBodyBox from '../../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';

const TableBody = () => {
  return (
    <TableBodyBox>
      {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
        <TableBodyRow
          key={th}
          isRequired={true}
          name="경험정리 콘텐츠"
          releaseDate="2024.01.26"
          mission="1일차, 2일차"
          isVisible={true}
        />
      ))}
    </TableBodyBox>
  );
};

export default TableBody;
