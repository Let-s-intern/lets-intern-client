import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import TableBodyBox from '../../../components/admin/challenge/ui/table/table-body/TableBodyBox';
import TableBodyRow from '../../../components/admin/challenge/mission/mission/table/table-body/TableBodyRow';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import TableHead from '../../../components/admin/challenge/mission/mission/table/table-head/TableHead';

const ChallengeMission = () => {
  return (
    <>
      <Heading>미션</Heading>
      <Table>
        <TableHead />
        <TableBodyBox>
          {Array.from({ length: 6 }, (_, index) => index + 1).map((th) => (
            <TableBodyRow
              key={th}
              th={th}
              name={`${th}일차. 미션이름`}
              releaseDate="2024.01.26"
              dueDate="2024.01.27 8:00"
              isRefunded={true}
              connectedContents="경험정리"
              submitCount={93}
              totalCount={100}
              isVisible={false}
            />
          ))}
        </TableBodyBox>
      </Table>
    </>
  );
};

export default ChallengeMission;
