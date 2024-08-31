import { Button, Snackbar } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  ToolbarPropsOverrides,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdminReportListItem,
  convertReportTypeToDisplayName,
  useGetReportsForAdmin,
} from '../../../api/report';

type Row = AdminReportListItem & { id: number };

// const bankTextMap: Record<z.infer<typeof accountType>, string> = {
//   KB: 'KB국민',
//   HANA: '하나',
//   WOORI: '우리',
//   SHINHAN: '신한',
//   NH: 'NH농협',
//   SH: 'SH수협',
//   IBK: 'IBK기업',
//   MG: '새마을금고',
//   KAKAO: '카카오뱅크',
//   TOSS: '토스뱅크',
// };

function createColumns({
  handleDelete,
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
      // valueFormatter: (_, row) => {
      //   return `${row.applicationCount}/${row.feedbackApplicationCount}`;
      // },
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

    // { field: 'name', headerName: '이름', width: 100 },
    // { field: 'email', headerName: '이메일', width: 200 },
    // { field: 'phoneNum', headerName: '전화번호', width: 150 },
    // {
    //   field: 'account',
    //   headerName: '환급계좌번호',
    //   width: 150,
    //   valueFormatter(_, row) {
    //     return row.accountType
    //       ? `${bankTextMap[row.accountType]} ${row.accountNum}`
    //       : '';
    //   },
    // },
    // ...ths
    //   .filter((th) => th !== 99)
    //   .map((th): GridColDef<Row> => {
    //     return {
    //       field: `th${th}`,
    //       headerName: `${th}회차`,
    //       valueGetter(_, row) {
    //         const score = row.scores.find((s) => s.th === th);
    //         return score?.score ?? '0';
    //       },
    //       sortable: false,
    //       filterable: false,
    //       editable: false,
    //       cellClassName: (params) => 'p-0',
    //       width: 50,
    //     };
    //   }),
    // {
    //   field: 'th99',
    //   headerName: '운영진',
    //   width: 50,
    //   editable: true,
    //   cellClassName: 'p-0',
    //   valueGetter(_, row) {
    //     const score = row.scores.find((s) => s.th === 99);
    //     return score?.score ?? '0';
    //   },
    // },
    // { field: 'total', headerName: '총점', width: 50 },
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
    // {
    //   field: 'isRefunded',
    //   headerName: '환급여부',
    //   width: 150,
    //   editable: true,
    //   renderCell({ value }) {
    //     return <Switch checked={value} disabled />;
    //   },
    //   cellClassName: 'p-0',
    //   renderEditCell(params) {
    //     return (
    //       <div className="flex h-full w-full items-center justify-start px-2">
    //         <Switch
    //           checked={params.value}
    //           onChange={(e) => {
    //             params.api.setEditCellValue({
    //               id: params.id,
    //               field: params.field,
    //               value: e.target.checked,
    //             });
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];
}

// declare module '@mui/x-data-grid' {
//   interface ToolbarPropsOverrides {
//     onMakeRefundedClick?: (selected: Map<number, Row>) => void;
//   }
// }

function Toolbar({ onMakeRefundedClick }: ToolbarPropsOverrides) {
  const api = useGridApiContext();
  const hasSelected = api.current.getSelectedRows().size !== 0;

  return (
    <div>
      <GridToolbarContainer>
        {/* <Button
          onClick={() => {
            api.current.exportDataAsCsv({
              fileName: `페이백_${dayjs().format('YYYY-MM-DD')}`,
              getRowsToExport(params) {
                return params.apiRef.current
                  .getAllRowIds()
                  .map((id) => ({
                    id,
                    total: params.apiRef.current.getCellValue(id, 'total'),
                  }))
                  .filter((row) => row.total >= 80)
                  .sort((a, b) => b.total - a.total)
                  .map((row) => row.id);
              },
            });
          }}
          variant="outlined"
        >
          80점 이상 데이터 추출
        </Button>
        <Button
          onClick={() => {
            onMakeRefundedClick?.(
              api.current.getSelectedRows() as Map<number, Row>,
            );
          }}
          disabled={!hasSelected}
          variant="outlined"
        >
          환급 완료로 변경
        </Button>
        <Button
          onClick={() => {
            api.current.sortColumn('total', 'desc');
          }}
          variant="outlined"
        >
          점수 정렬
        </Button>
        */}
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
        slotProps={
          {
            // toolbar: {
            //   async onMakeRefundedClick(selected) {
            //     const selectedArray = [...selected.entries()];
            //     const res = await Promise.allSettled(
            //       selectedArray.map(([id, row]) => {
            //         return updateMutation.mutateAsync({ id, isRefunded: true });
            //       }),
            //     );
            //     const success: string[] = [];
            //     const failed: string[] = [];
            //     res.forEach((r, i) => {
            //       if (r.status === 'rejected') {
            //         console.error(r.reason);
            //         failed.push(selectedArray[i][1].name || '');
            //       } else {
            //         success.push(selectedArray[i][1].name || '');
            //       }
            //     });
            //     setSnackbar({
            //       open: true,
            //       message: `${
            //         success.length !== 0
            //           ? `환급 완료: ${success.join(', ')}${
            //               failed.length !== 0 ? ', ' : ''
            //             }`
            //           : ''
            //       }${failed.length !== 0 ? `실패: ${failed.join(', ')}` : ''}`,
            //     });
            //     refetch();
            //   },
            // },
          }
        }
        // checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        // processRowUpdate={async (updatedRow, originalRow) => {
        //   const payload: UpdatePaybackReq = {};

        //   if (
        //     updatedRow.isRefunded !== originalRow.isRefunded &&
        //     typeof updatedRow.isRefunded === 'boolean'
        //   ) {
        //     payload.isRefunded = updatedRow.isRefunded;
        //   }

        //   if (updatedRow.th99) {
        //     payload.adminScore = Number(updatedRow.th99);
        //   }

        //   if (Object.keys(payload).length === 0) {
        //     return updatedRow;
        //   }

        //   await updateMutation.mutateAsync({ ...payload, id: updatedRow.id });
        //   setSnackbar({
        //     open: true,
        //     message: '점수 정보가 업데이트 되었습니다.',
        //   });
        //   refetch();

        //   return updatedRow;
        // }}
        // onProcessRowUpdateError={console.error}
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
