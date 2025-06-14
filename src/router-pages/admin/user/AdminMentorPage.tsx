/** 멘토 관리 페이지 */

'use client';

import {
  usePatchUserAdminMutation,
  useUserAdminQuery,
  UseUserAdminQueryKey,
} from '@/api/user';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import Heading from '@components/admin/ui/heading/Heading';
import { Checkbox } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';

interface Row {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  isMentor: boolean;
}

const useMentorColumns = () => {
  const client = useQueryClient();
  const patchUser = usePatchUserAdminMutation();
  const { snackbar } = useAdminSnackbar();

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
      renderCell: (params: GridRenderCellParams<Row, boolean>) => {
        const handleChange = async (
          _: React.ChangeEvent<HTMLInputElement>,
          checked: boolean,
        ) => {
          await patchUser.mutateAsync({ id: params.row.id, isMentor: checked });
          client.invalidateQueries({
            queryKey: [UseUserAdminQueryKey],
          });
          snackbar('멘토 설정이 완료되었습니다');
        };
        return (
          <Checkbox checked={params.value ?? false} onChange={handleChange} />
        );
      },
    },
  ];

  return columns;
};

const useMentorRows = () => {
  const pageable = { page: 1, size: 10000 };
  const { data } = useUserAdminQuery({ pageable });
  const rows = data?.userAdminList.map(({ userInfo }) => ({
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    phoneNum: userInfo.phoneNum,
    isMentor: userInfo.isMentor ?? false,
  }));
  return rows;
};

export default function AdminMentorPage() {
  const columns = useMentorColumns();
  const rows = useMentorRows();

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
        pageSizeOptions={[10]}
      />
    </section>
  );
}
