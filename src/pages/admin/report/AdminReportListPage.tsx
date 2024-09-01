import { Button, Snackbar } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdminReportListItem,
  convertReportTypeToDisplayName,
  useGetReportsForAdmin,
} from '../../../api/report';

type Row = AdminReportListItem & { id: number };

function createColumns({
  handleEdit,
}: {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
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
            <p className="m-0 text-xs text-gray-500">서류진단/1:1첨삭</p>
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
            onClick={() => handleEdit(params.row.id)}
          >
            서류 진단
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            1:1첨삭
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
            <Button
              component={Link}
              to="/admin/report/create"
              variant="contained"
              color="primary"
            >
              등록
            </Button>
          </div>
        </div>
      </GridToolbarContainer>
    </div>
  );
}

const AdminReportListPage = () => {
  const { data: reportsData } = useGetReportsForAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSnackbar({ open: true, message });
      setSearchParams(
        (prev) => {
          prev.delete('message');
          return prev;
        },
        {
          replace: true,
        },
      );
    }
  }, [searchParams, setSearchParams]);

  const columns = useMemo(() => {
    return createColumns({
      handleDelete: (id) => {
        console.log('delete', id);
      },
      handleEdit: (id) => {
        console.log('edit', id);
      },
    });
  }, []);

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

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

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </main>
  );
};

export default AdminReportListPage;
