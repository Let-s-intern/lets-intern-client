import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import TableBody from '../../../components/admin/challenge/user/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/user/table/table-head/TableHead';
import TopActionGroup from '../../../components/admin/challenge/user/table/top-action-group/TopActionGroup';

const ChallengeUser = () => {
  return (
    <div className="px-12">
      <Heading>참여자</Heading>
      <div className="pt-4">
        <TopActionGroup />
        <TableHead />
        <TableBody />
      </div>
    </div>
  );
};

export default ChallengeUser;
