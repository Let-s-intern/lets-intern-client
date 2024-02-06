import TableBody from '../../../components/admin/challenge/submit-check/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/submit-check/table/table-head/TableHead';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeSubmitCheck = () => {
  return (
    <div className="px-12">
      <Heading>미션 제출</Heading>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </div>
  );
};

export default ChallengeSubmitCheck;
