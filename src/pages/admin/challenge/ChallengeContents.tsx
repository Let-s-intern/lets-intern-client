import TableBody from '../../../components/admin/challenge/mission/mission-contents/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/mission/mission-contents/table/table-head/TableHead';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeContents = () => {
  return (
    <>
      <Heading>학습 콘텐츠</Heading>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </>
  );
};

export default ChallengeContents;
