import { useState } from 'react';

import TableRowContent from './TableRowContent';
import TableRowDetailModal from './TableRowDetailModal';

interface Props {
  application: any;
}

const TableBodyRow = ({ application }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <div className="relative">
      <TableRowContent
        application={application}
        onClick={() => setIsMenuShown(!isMenuShown)}
      />
      {isMenuShown && (
        <TableRowDetailModal
          application={application}
          setIsMenuShown={setIsMenuShown}
        />
      )}
    </div>
  );
};

export default TableBodyRow;
