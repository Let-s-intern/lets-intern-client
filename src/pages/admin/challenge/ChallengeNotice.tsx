import TableBody from '../../../components/admin/challenge/notice/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/notice/table/table-head/TableHead';
import Button from '../../../components/admin/challenge/ui/button/Button';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';

const ChallengeNotice = () => {
  return (
    <div className="px-12">
      <div className="mt-6 flex items-center justify-between px-3">
        <Heading>공지사항</Heading>
        <Button>새 공지 등록</Button>
      </div>
      <div className="mt-4">
        <TableHead />
        <TableBody />
      </div>
    </div>
  );
};

export default ChallengeNotice;
