import TableBody from '../../../components/admin/challenge/mission/mission-contents/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/mission/mission-contents/table/table-head/TableHead';
import Button from '../../../components/admin/challenge/ui/button/Button';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeContents = () => {
  return (
    <div className="px-12 pt-12">
      <div className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">학습 콘텐츠</h1>
        <Button>등록</Button>
      </div>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </div>
  );
};

export default ChallengeContents;
