import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import TableHead from '../../../components/admin/challenge/mission/mission/table/table-head/TableHead';
import TableBody from '../../../components/admin/challenge/mission/mission/table/table-body/TableBody';
import Button from '../../../components/admin/challenge/ui/button/Button';

const ChallengeMission = () => {
  return (
    <>
      <div className="mt-6 flex items-center justify-between px-3">
        <Heading>미션</Heading>
        <Button>등록</Button>
      </div>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </>
  );
};

export default ChallengeMission;
