import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';
import {
  getPassRecruitmentStatus,
  passRecruitmentStatusToText,
} from '@/domain/all-in-one-pass/util/passStatus';
import dayjs from '@/lib/dayjs';
import { GridColDef } from '@mui/x-data-grid';
import RowActions from './RowActions';
import VisibilityToggle from './VisibilityToggle';

// 유저 랜딩(비구매자용)으로 이동하는 외부 링크 호스트.
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '/';

/** A-1 개설 목록 컬럼. 노출여부 단일 노출 판정을 위해 전체 목록을 받는다. */
export const getListColumns = (
  passes: AllInOnePassListItem[],
): GridColDef<AllInOnePassListItem>[] => [
  {
    field: 'createdAt',
    headerName: '개설일자',
    type: 'dateTime',
    width: 180,
    valueGetter: (_, row) => dayjs(row.createdAt).toDate(),
    valueFormatter: (value) => dayjs(value).format('YYYY/MM/DD(dd) HH:mm'),
  },
  {
    field: 'title',
    headerName: '올인원패스 제목',
    width: 200,
    valueGetter: (_, row) => row.title || '-',
  },
  {
    field: 'userPage',
    headerName: '페이지 이동',
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => (
      <a
        className="text-blue-500 underline transition hover:text-blue-300"
        href={`${WEB_URL}/all-in-one-pass/${row.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        보기
      </a>
    ),
  },
  {
    field: 'recruitmentStatus',
    headerName: '모집상태',
    width: 110,
    valueGetter: (_, row) => getPassRecruitmentStatus(row),
    valueFormatter: (value) =>
      passRecruitmentStatusToText[
        value as keyof typeof passRecruitmentStatusToText
      ],
  },
  {
    field: 'applicant',
    headerName: '신청인원',
    width: 100,
    sortable: false,
    valueGetter: (_, row) =>
      `${row.currentApplicantCount} / ${row.maxApplicantCount ?? '∞'}`,
  },
  {
    field: 'deadline',
    headerName: '모집기간',
    type: 'dateTime',
    width: 170,
    valueGetter: (_, row) =>
      row.purchaseEndDate ? dayjs(row.purchaseEndDate).toDate() : null,
    valueFormatter: (value) =>
      value ? dayjs(value).format('M/D(dd) HH:mm까지') : '-',
  },
  {
    field: 'passMonths',
    headerName: '패스 기간',
    width: 100,
    valueGetter: (_, row) => row.passMonths,
    valueFormatter: (value) => `${value}개월`,
  },
  {
    field: 'management',
    headerName: '프로그램 관리',
    width: 400,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => <RowActions pass={row} />,
  },
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 100,
    sortable: false,
    renderCell: ({ row }) => (
      <VisibilityToggle
        pass={row}
        hasOtherVisible={passes.some((p) => p.id !== row.id && p.isVisible)}
      />
    ),
  },
];
