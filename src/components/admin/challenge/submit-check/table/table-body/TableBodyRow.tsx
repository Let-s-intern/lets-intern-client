import { useState } from 'react';

import TableRowContent from './TableRowContent';
import ChallengeSubmitDetail from './ChallengeSubmitDetail';

interface Props {
  th: number;
  mission: any;
}

const TableBodyRow = ({ th, mission }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);

  return (
    <>
      <TableRowContent
        th={th}
        mission={mission}
        onClick={() => setIsDetailShown(!isDetailShown)}
      />
      {isDetailShown && <ChallengeSubmitDetail mission={mission} />}
    </>
  );
};

export default TableBodyRow;
