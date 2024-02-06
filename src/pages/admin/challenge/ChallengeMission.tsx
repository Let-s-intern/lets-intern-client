import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import TableHead from '../../../components/admin/challenge/mission/mission/table/table-head/TableHead';
import TableBody from '../../../components/admin/challenge/mission/mission/table/table-body/TableBody';

const ChallengeMission = () => {
  return (
    <>
      <Heading>미션</Heading>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </>
  );
};

export default ChallengeMission;
