'use client';

import {
  AdminReportListItem,
  convertReportTypeToDisplayName,
  useGetReportsForAdmin,
} from '@/api/report';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type Row = AdminReportListItem & { id: number };

function createColumns({
  handleEdit,
  moveApplicationPage,
}: {
  handleEdit: (id: number) => void;
  moveApplicationPage: (reportId: number) => void;
}): GridColDef<Row>[] {
  return [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'createDateTime',
      headerName: '개설일시',
      width: 180,
      valueFormatter: (_, row) =>
        row.createDateTime?.format('YYYY.MM.DD(ddd) HH:mm') ?? '',
    },
    {
      field: 'reportType',
      headerName: '구분',
      width: 90,
      valueFormatter: (_, row) =>
        row.reportType ? convertReportTypeToDisplayName(row.reportType) : '-',
    },

    {
      field: '신청인원',
      headerName: '신청인원',
      renderHeader() {
        return (
          <div className="flex flex-col items-center justify-center">
            <p className="m-0">신청인원</p>
            <p className="m-0 text-xs text-gray-500">
              서류진단/1:1 온라인 상담
            </p>
          </div>
        );
      },
      headerAlign: 'center',
      width: 120,

      valueGetter: (_, row) =>
        `${row.applicationCount}/${row.feedbackApplicationCount}`,
      renderCell: (params) => (
        <span className="font-mono text-xs">{params.value}</span>
      ),
      align: 'center',
    },
    { field: 'title', headerName: '제목', width: 200 },
    {
      field: 'visibleDate',
      headerName: '노출일시',
      width: 180,
      valueFormatter: (_, row) =>
        row.visibleDate?.format('YYYY.MM.DD(ddd) HH:mm') ?? '비공개',
    },
    {
      field: 'isVisible',
      headerName: '노출 여부',
      width: 100,
      valueFormatter: (_, row) => (row.isVisible ? '노출' : '비노출'),
    },
    {
      field: 'actions',
      headerName: '액션',
      width: 250,
      renderCell: (params) => (
        <div className="inline-flex items-center gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => {
              moveApplicationPage(params.row.id);
            }}
          >
            참여자 목록
          </Button>
        </div>
      ),
    },
  ];
}

function Toolbar() {
  return (
    <div>
      <GridToolbarContainer>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">-</div>
          <div className="flex items-center gap-2">
            <Link href="/admin/report/create">
              <Button variant="contained" color="primary">
                등록
              </Button>
            </Link>
          </div>
        </div>
      </GridToolbarContainer>
    </div>
  );
}

const AdminReportListPage = () => {
  const { data: reportsData } = useGetReportsForAdmin({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSnackbar(message);
      // Remove message from URL by navigating to the same path without the message param
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('message');
      const newUrl =
        window.location.pathname +
        (newSearchParams.toString() ? '?' + newSearchParams.toString() : '');
      router.replace(newUrl);
    }
  }, [searchParams, router, setSnackbar]);

  const columns = useMemo(() => {
    return createColumns({
      handleEdit(id) {
        router.push(`/admin/report/edit/${id}`);
      },
      moveApplicationPage(reportId) {
        router.push(`/admin/report/applications?reportId=${reportId}`);
      },
    });
  }, [router]);

  const rows = useMemo(() => {
    return (
      reportsData?.reportForAdminInfos?.map(
        (report): Row => ({
          id: report.reportId ?? -1,
          ...report,
        }),
      ) ?? []
    );
  }, [reportsData?.reportForAdminInfos]);

  return (
    <main className="pt-3">
      <p className="mb-2">서류 진단 프로그램 관리</p>

      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: Toolbar }}
        disableRowSelectionOnClick
        autoHeight
        hideFooter
      />
    </main>
  );
};

export default AdminReportListPage;
