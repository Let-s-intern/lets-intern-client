import { Checkbox } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { memo, useState } from 'react';

import AdminReviewHeader from './AdminReviewHeader';

export default function AdminBlogReviewListPage() {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'createdDate', headerName: '추가일자', width: 120 },
    {
      field: 'programType',
      headerName: '프로그램 구분',
      width: 110,
      editable: true,
      sortable: false,
    },
    {
      field: 'programTitle',
      headerName: '프로그램 명',
      width: 200,
      editable: true,
      sortable: false,
    },
    {
      field: 'username',
      headerName: '이름',
      width: 110,
      editable: true,
      sortable: false,
    },
    {
      field: 'title',
      headerName: '제목',
      sortable: false,
      width: 200,
    },
    {
      field: 'url',
      headerName: 'URL',
      sortable: false,
      width: 160,
      editable: true,
    },
    {
      field: 'isVisible',
      headerName: '노출여부',
      sortable: false,
      width: 80,
      renderCell: (params: GridRenderCellParams<any, boolean>) => {
        return <CellCheckbox defaultValue={params.value ?? true} />;
      },
    },
  ];

  // dummy data
  const rows = [
    {
      id: 123,
      createdDate: '2025-01-20',
      programType: '챌린지',
      programTitle: '챌린지 커리어 시작 99기',
      username: '김렛츠',
      title: '블로그 제목입니다',
      url: 'https://www.naver.com/',
      isVisible: true,
    },
    {
      id: 78,
      createdDate: '2025-01-20',
      programType: '챌린지',
      programTitle: '챌린지 커리어 시작 99기',
      username: '김렛츠',
      title: '블로그 제목입니다',
      url: 'https://www.naver.com/',
      isVisible: true,
    },
    {
      id: 34,
      createdDate: '2025-01-20',
      programType: '챌린지',
      programTitle: '챌린지 커리어 시작 99기',
      username: '김렛츠',
      title: '블로그 제목입니다',
      url: 'https://www.naver.com/',
      isVisible: true,
    },
    {
      id: 567,
      createdDate: '2025-01-20',
      programType: '챌린지',
      programTitle: '챌린지 커리어 시작 99기',
      username: '김렛츠',
      title: '블로그 제목입니다',
      url: 'https://www.naver.com/',
      isVisible: true,
    },
    {
      id: 234,
      createdDate: '2025-01-20',
      programType: '챌린지',
      programTitle: '챌린지 커리어 시작 99기',
      username: '김렛츠',
      title: '블로그 제목입니다',
      url: 'https://www.naver.com/',
      isVisible: false,
    },
  ];

  return (
    <div className="p-5">
      <AdminReviewHeader />

      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
      />
    </div>
  );
}

const CellCheckbox = memo(function CellCheckbox({
  defaultValue,
}: {
  defaultValue: boolean;
}) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <Checkbox checked={checked} onChange={() => setChecked((prev) => !prev)} />
  );
});
