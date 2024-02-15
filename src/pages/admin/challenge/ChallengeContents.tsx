import { useState } from 'react';

import TableBody from '../../../components/admin/challenge/mission/mission-contents/table/table-body/TableBody';
import TableHead from '../../../components/admin/challenge/mission/mission-contents/table/table-head/TableHead';
import Button from '../../../components/admin/challenge/ui/button/Button';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeContents = () => {
  const [addMenuShown, setAddMenuShown] = useState(false);

  return (
    <div className="px-12 pt-12">
      <div className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">학습 콘텐츠</h1>
        <Button onClick={() => setAddMenuShown(true)}>등록</Button>
      </div>
      <Table>
        <TableHead />
        <TableBody
          addMenuShown={addMenuShown}
          setAddMenuShown={setAddMenuShown}
        />
      </Table>
    </div>
  );
};

export default ChallengeContents;
