'use client';

import {
  usePatchUserAdminMutation,
  useUserAdminQuery,
  UseUserAdminQueryKey,
} from '@/api/user/user';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button, Checkbox, Tab, Tabs, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

interface Row {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  isMentor: boolean;
}

const useMentorColumns = (): GridColDef<Row>[] => {
  const client = useQueryClient();
  const patchUser = usePatchUserAdminMutation({});
  const { snackbar } = useAdminSnackbar();

  return useMemo(
    (): GridColDef<Row>[] => [
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
          const handleToggleMentor = async (
            _: React.ChangeEvent<HTMLInputElement>,
            checked: boolean,
          ) => {
            try {
              await patchUser.mutateAsync({
                id: params.row.id,
                isMentor: checked,
              });
              client.invalidateQueries({
                queryKey: [UseUserAdminQueryKey],
              });
              client.invalidateQueries({
                queryKey: ['useAdminUserMentorListQuery'],
              });
              snackbar('멘토 설정이 완료되었습니다');
            } catch (err) {
              snackbar(`문제가 발생했습니다: ${err}`);
            }
          };
          return (
            <Checkbox
              checked={params.value ?? false}
              onChange={handleToggleMentor}
            />
          );
        },
      },
    ],
    [client, patchUser, snackbar],
  );
};

const useMentorRows = ({ page, size }: { page: number; size: number }) => {
  const searchParams = useSearchParams();
  const filters = {
    email: searchParams.get('email'),
    name: searchParams.get('name'),
    phoneNum: searchParams.get('phoneNum'),
  };

  const { data, isLoading } = useUserAdminQuery({
    pageable: { page: page + 1, size },
    ...filters,
  });

  const rows = useMemo(
    () =>
      data?.userAdminList.map(({ userInfo }) => ({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        phoneNum: userInfo.phoneNum,
        isMentor: userInfo.isMentor ?? false,
      })),
    [data],
  );

  return { rows, isLoading, pageInfo: data?.pageInfo };
};

const INITIAL_FILTER = {
  email: '',
  name: '',
  phoneNum: '',
};

const MentorFilter = () => {
  const [inputs, setInputs] = useState(INITIAL_FILTER);
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = Object.fromEntries(
      Object.entries(inputs).filter(([, value]) => value),
    );
    const params = new URLSearchParams(newSearchParams);
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilter = () => {
    setInputs(INITIAL_FILTER);
    router.replace(window.location.pathname);
  };

  return (
    <form
      className="mb-4 flex items-center justify-between bg-neutral-90 p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2">
        <TextField
          id="name"
          label="이름"
          variant="outlined"
          value={inputs.name}
          onChange={handleChange}
        />
        <TextField
          id="email"
          label="이메일"
          variant="outlined"
          value={inputs.email}
          onChange={handleChange}
        />
        <TextField
          id="phoneNum"
          label="휴대폰 번호"
          variant="outlined"
          value={inputs.phoneNum}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" variant="contained">
          검색
        </Button>
        <Button type="button" variant="outlined" onClick={resetFilter}>
          전체보기
        </Button>
      </div>
    </form>
  );
};

export default function AdminMentorRegisterPage() {
  const router = useRouter();

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: DEFAULT_PAGE_SIZE });

  const columns = useMentorColumns();
  const { rows, isLoading, pageInfo } = useMentorRows({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const rowCount = pageInfo?.totalElements;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.push('/admin/mentors');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

      <Tabs value={1} onChange={handleTabChange} className="mb-4">
        <Tab label="멘토 관리" />
        <Tab label="멘토 등록" />
      </Tabs>

      <MentorFilter />
      <span className="text-xsmall14 text-system-error">
        그리드에 내장된 필터, 정렬이 정상 동작하지 않습니다. 위의 검색 기능을
        사용하세요.
      </span>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        rowCount={rowCount}
        paginationMode="server"
        loading={isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[DEFAULT_PAGE_SIZE]}
      />
    </section>
  );
}
