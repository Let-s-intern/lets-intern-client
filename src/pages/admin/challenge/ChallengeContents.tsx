import TableBody from '../../../components/admin/challenge/mission/mission-contents/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/mission/mission-contents/table/table-head/TableHead';
import Button from '../../../components/admin/challenge/ui/button/Button';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeContents = () => {
  return (
    <>
      <div className="mt-6 flex items-center justify-between px-3">
        <Heading>학습 콘텐츠</Heading>
        <Button>등록</Button>
      </div>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </>
  );
};

export default ChallengeContents;
