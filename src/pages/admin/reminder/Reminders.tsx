import { useState } from 'react';

import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';
import TableCell from '../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../components/admin/ui/table/new/TableRow';
import TableManageContent from '../../../components/admin/ui/table/new/TableManageContent';
import ActionButton from '../../../components/admin/ui/button/ActionButton';

type MainBannersTableKey = 'type' | 'management';

const Reminders = () => {
  const [reminderTypeList] = useState<
    {
      slug: string;
      type: string;
    }[]
  >([
    {
      slug: 'challenge',
      type: '챌린지',
    },
    {
      slug: 'bootcamp',
      type: '부트캠프',
    },
    {
      slug: 'lets-chat',
      type: '렛츠챗 세션',
    },
  ]);

  const columnMetaData: TableTemplateProps<MainBannersTableKey>['columnMetaData'] =
    {
      type: {
        headLabel: '구분',
        cellWidth: 'w-8/12',
      },
      management: {
        headLabel: '관리',
        cellWidth: 'w-4/12',
      },
    };

  return (
    <TableTemplate<MainBannersTableKey>
      title="알림 신청"
      columnMetaData={columnMetaData}
      minWidth="20rem"
    >
      {reminderTypeList.map((reminderType) => (
        <TableRow key={reminderType.slug} minWidth="20rem">
          <TableCell cellWidth={columnMetaData.type.cellWidth}>
            {reminderType.type}
          </TableCell>
          <TableCell cellWidth={columnMetaData.management.cellWidth}>
            <TableManageContent>
              <ActionButton to={`/admin/reminders/${reminderType.slug}`}>
                상세
              </ActionButton>
            </TableManageContent>
          </TableCell>
        </TableRow>
      ))}
    </TableTemplate>
  );
};

export default Reminders;
