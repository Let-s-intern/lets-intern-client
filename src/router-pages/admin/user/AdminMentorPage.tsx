/** 멘토 관리 페이지 */

import { useUserAdminQuery } from '@/api/user';
import Heading from '@components/admin/ui/heading/Heading';
import { Checkbox } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useRef } from 'react';

interface Row {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  isMentor: boolean;
}

const columns: GridColDef<Row>[] = [
  {
    field: 'name',
    headerName: '이름',
    width: 100,
  },
  {
    field: 'email',
    headerName: '이메일',
    width: 200,
  },
  {
    field: 'phoneNum',
    headerName: '전화번호',
    width: 160,
  },
  {
    field: 'isMentor',
    headerName: '멘토 여부',
    width: 100,
    renderCell: (params: GridRenderCellParams<Row, boolean>) => (
      <Checkbox
        checked={params.value ?? false}
        onChange={() => console.log('멘토 설정')}
      />
    ),
  },
];

export default function AdminMentorPage() {
  const pageRef = useRef({ page: 1, size: 10000 });

  const { data } = useUserAdminQuery({ pageable: pageRef.current });
  const rows = data?.userAdminList.map(({ userInfo }) => ({
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    phoneNum: userInfo.phoneNum,
    isMentor: userInfo.isMentor ?? false,
  }));

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </section>
  );
}
