import { LeadManagementUser } from '@/api/leadManagement';
import TableCell from '@/domain/admin/ui/table/new/TableCell';
import TableRow from '@/domain/admin/ui/table/new/TableRow';
import { TableTemplateProps } from '@/domain/admin/ui/table/new/TableTemplate';
import Link from 'next/link';

// --- Table Column Key ---

type TableColumnKey =
  | 'name'
  | 'phoneNum'
  | 'grade'
  | 'wishJobGroup'
  | 'wishJob'
  | 'wishIndustry'
  | 'wishCompany'
  | 'programHistory'
  | 'magnetHistory'
  | 'marketingAgree';

export const tableColumnMetaData: TableTemplateProps<TableColumnKey>['columnMetaData'] =
  {
    name: { headLabel: '이름', cellWidth: 'w-[7%]' },
    phoneNum: { headLabel: '전화번호', cellWidth: 'w-[10%]' },
    grade: { headLabel: '학년', cellWidth: 'w-[5%]' },
    wishJobGroup: { headLabel: '희망 직군', cellWidth: 'w-[8%]' },
    wishJob: { headLabel: '희망 직무', cellWidth: 'w-[8%]' },
    wishIndustry: { headLabel: '희망 산업', cellWidth: 'w-[8%]' },
    wishCompany: { headLabel: '희망 기업', cellWidth: 'w-[8%]' },
    programHistory: { headLabel: '프로그램 참여 이력', cellWidth: 'w-[16%]' },
    magnetHistory: { headLabel: '마그넷 신청 이력', cellWidth: 'w-[16%]' },
    marketingAgree: { headLabel: '마케팅 동의 여부', cellWidth: 'w-[10%]' },
  };

export const TABLE_MIN_WIDTH = '80rem';

const LeadUserRow = ({ user }: { user: LeadManagementUser }) => (
  <TableRow minWidth={TABLE_MIN_WIDTH}>
    <TableCell cellWidth={tableColumnMetaData.name.cellWidth}>
      <Link
        href={`/admin/leads/managements/${user.id}`}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {user.name}
      </Link>
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.phoneNum.cellWidth}>
      {user.phoneNum || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.grade.cellWidth}>
      {user.grade || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishJobGroup.cellWidth}>
      {user.wishJobGroup || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishJob.cellWidth}>
      {user.wishJob || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishIndustry.cellWidth}>
      {user.wishIndustry || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishCompany.cellWidth}>
      {user.wishCompany || '-'}
    </TableCell>
    <TableCell
      cellWidth={tableColumnMetaData.programHistory.cellWidth}
      textEllipsis
    >
      {user.programHistory.length
        ? user.programHistory.map((p) => `${p.title}(${p.id})`).join(' · ')
        : '-'}
    </TableCell>
    <TableCell
      cellWidth={tableColumnMetaData.magnetHistory.cellWidth}
      textEllipsis
    >
      {user.magnetHistory.length
        ? user.magnetHistory.map((m) => `${m.title}(${m.id})`).join(' · ')
        : '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.marketingAgree.cellWidth}>
      {user.marketingAgree ? '동의' : '미동의'}
    </TableCell>
  </TableRow>
);

export default LeadUserRow;
