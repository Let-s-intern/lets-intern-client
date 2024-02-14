import { Outlet, useLocation } from 'react-router-dom';

import TableBody from '../../../components/admin/challenge/submit-check/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/submit-check/table/table-head/TableHead';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeSubmitCheck = () => {
  const location = useLocation();

  return (
    <div className="px-12">
      <div className="mt-6 px-3">
        <Heading>미션 제출</Heading>
      </div>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </div>
  );
};

export default ChallengeSubmitCheck;
