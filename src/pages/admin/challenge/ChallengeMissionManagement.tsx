import { useState } from 'react';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import NTableHead from '../../../components/admin/challenge/mission/mission/table/table-head/NTableHead';
import NTableBody from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBody';

const ChallengeMissionManagement = () => {
  const [isModeAdd, setIsModeAdd] = useState(false);

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>미션 관리</Heading>
        <Button onClick={() => console.log('clicked')}>등록</Button>
      </div>
      <Table>
        <NTableHead />
        <NTableBody isModeAdd={isModeAdd} setIsModeAdd={setIsModeAdd} />
      </Table>
    </div>
  );
};

export default ChallengeMissionManagement;
