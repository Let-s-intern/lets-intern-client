import {
  AdminBlogReview,
  getAdminBlogReviewList,
  useDeleteAdminBlogReview,
  useGetAdminBlogReviewList,
  usePatchAdminBlogReview,
  usePostAdminBlogReview,
} from '@/api/review/review';
import AdminReviewHeader from '@/app/admin/review/AdminReviewHeader';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import { PaymentMethodKey } from '@/data/getPaymentSearchParams';
import dayjs from '@/lib/dayjs';
import { ProgramTypeEnum } from '@/schema';
import { bankTypeToText } from '@/utils/convert';
import { generateUUID } from '@/utils/random';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button, Checkbox, FormControlLabel, Switch } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  BLOG_REVIEW_EXPORT_COLUMNS,
  downloadBlogReviewCsv,
} from './blogReviewExport';

// 커스텀 툴바 props 를 MUI DataGrid slotProps.toolbar 타입에 등록 (slotProps 로 주입 가능하게)
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onExportCsv: () => void;
    onPrint: () => void;
    isBusy: boolean;
    showRowNumber: boolean;
    onToggleRowNumber: (next: boolean) => void;
  }
}

/**
 * 서버 페이지네이션 도입 후 MUI GridToolbarExport 는 현재 페이지만 내보내므로,
 * 클릭 시 전량을 별도 조회해 CSV/인쇄하는 커스텀 버튼으로 대체한다. (핸들러는 페이지에서 주입)
 */
function CustomToolbar({
  onExportCsv,
  onPrint,
  isBusy,
  showRowNumber,
  onToggleRowNumber,
}: {
  onExportCsv: () => void;
  onPrint: () => void;
  isBusy: boolean;
  showRowNumber: boolean;
  onToggleRowNumber: (next: boolean) => void;
}) {
  return (
    <GridToolbarContainer>
      <Button size="small" onClick={onExportCsv} disabled={isBusy}>
        {isBusy ? '준비 중…' : 'CSV 다운로드'}
      </Button>
      <Button size="small" onClick={onPrint} disabled={isBusy}>
        인쇄
      </Button>
      <FormControlLabel
        sx={{ marginLeft: 'auto', marginRight: 0 }}
        control={
          <Switch
            size="small"
            checked={showRowNumber}
            onChange={(e) => onToggleRowNumber(e.target.checked)}
          />
        }
        label="번호"
      />
    </GridToolbarContainer>
  );
}

type Row = AdminBlogReview & {
  id: number | string;
  isNew: boolean;
};

export default function AdminBlogReviewListPage() {
  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const { data } = useGetAdminBlogReviewList({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const postReview = usePostAdminBlogReview();
  const patchReview = usePatchAdminBlogReview();
  const deleteReview = useDeleteAdminBlogReview();

  // 번호(No.) 컬럼은 기본 숨김, 툴바 토글로 표시
  const [showRowNumber, setShowRowNumber] = useState(false);

  const columns: GridColDef<Row>[] = [
    {
      field: '__rowNum',
      headerName: 'No.',
      width: 64,
      sortable: false,
      filterable: false,
      editable: false,
      // 서버 페이지네이션이라 페이지가 넘어가도 이어지는 절대 순번(예: 6페이지 → 101~)
      renderCell: (params) => {
        const idx = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return paginationModel.page * paginationModel.pageSize + idx + 1;
      },
    },
    {
      field: 'postDate',
      type: 'dateTime',
      headerName: '추가일자',
      width: 200,
      editable: true,
    },
    {
      field: 'programType',
      headerName: '프로그램 구분',
      width: 150,
      editable: true,
      sortable: false,
      type: 'singleSelect',
      valueOptions: Object.values(ProgramTypeEnum.exclude(['VOD']).enum),
    },
    {
      field: 'programTitle',
      headerName: '프로그램 명',
      width: 200,
      editable: true,
      sortable: false,
    },
    {
      field: 'name',
      headerName: '이름',
      width: 110,
      editable: true,
      sortable: false,
    },
    {
      field: 'phoneNum',
      headerName: '연락처',
      width: 200,
    },
    {
      field: 'accountType',
      headerName: '은행명',
      width: 110,
      renderCell(params: GridRenderCellParams<Row, PaymentMethodKey>) {
        return params.value ? bankTypeToText[params.value] : '-';
      },
    },
    {
      field: 'accountNum',
      headerName: '계좌번호',
      width: 200,
    },
    {
      field: 'title',
      headerName: '제목',
      sortable: false,
      width: 200,
    },
    {
      field: 'description',
      headerName: '설명',
      sortable: false,
      width: 200,
    },
    {
      field: 'url',
      headerName: 'URL',
      sortable: false,
      width: 160,
      editable: true,
      renderCell: (params: GridRenderCellParams<Row, string>) => {
        // editable + 외부 제출 리뷰 데이터라 신뢰 불가 → http(s) 스킴만 허용.
        // (javascript:/data: URI 가 window.open 으로 실행되는 XSS 차단)
        const url = params.value;
        const isSafe = !!url && /^https?:\/\//i.test(url);
        return isSafe ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            확인
          </Button>
        ) : null;
      },
    },
    {
      field: 'isConfirmed',
      headerName: '운영진확인',
      sortable: false,
      width: 80,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Row, boolean>) => (
        <Checkbox
          checked={params.value}
          onChange={async () => {
            const { blogReviewId } = params.row;
            await patchReview.mutateAsync({
              blogReviewId,
              isConfirmed: !params.value,
            });
          }}
        />
      ),
    },
    {
      field: 'isRemittanceConfirmed',
      headerName: '송금확인',
      sortable: false,
      width: 80,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Row, boolean>) => (
        <Checkbox
          checked={params.value}
          onChange={async () => {
            const { blogReviewId } = params.row;
            await patchReview.mutateAsync({
              blogReviewId,
              isRemittanceConfirmed: !params.value,
            });
          }}
        />
      ),
    },
    {
      field: 'isVisible',
      headerName: '노출여부',
      sortable: false,
      width: 80,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Row, boolean>) => (
        <Checkbox
          checked={params.value}
          onChange={async () => {
            const { blogReviewId } = params.row;
            await patchReview.mutateAsync({
              blogReviewId,
              isVisible: !params.value,
            });
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '액션',
      width: 100,
      getActions: (params: GridRowParams<Row>) => {
        const id = params.id;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'save' + id}
              icon={<Check color="#4D55F5" size={20} />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancel' + id}
              icon={<X size={20} />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={'edit' + id}
            icon={<Pencil size={20} />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            key={'delete' + id}
            icon={<Trash color="red" size={20} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  const [rows, setRows] = useState<Row[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // ── 전량 내보내기/인쇄 (서버 페이지네이션 우회: 클릭 시 전체를 별도 조회) ──
  const [isExporting, setIsExporting] = useState(false);
  const [printReviews, setPrintReviews] = useState<AdminBlogReview[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const pendingPrint = useRef(false);
  const reactToPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: '블로그 후기 목록',
    // 인쇄 후 화면 밖 대량 DOM 을 정리(불필요한 리렌더 방지)
    onAfterPrint: () => setPrintReviews([]),
  });

  const totalElements = data?.pageInfo.totalElements ?? 0;

  // 전체 후기 조회 (화면 목록은 page/size 만 쓰므로 필터 없이 전량)
  // BE 최대 페이지 크기 제한을 고려해 청크 단위로 순회하며 병합한다.
  const fetchAllReviews = async () => {
    const CHUNK_SIZE = 1000;
    const all: AdminBlogReview[] = [];
    let page = 0;
    while (true) {
      const res = await getAdminBlogReviewList({ page, size: CHUNK_SIZE });
      all.push(...res.reviewList);
      if (
        res.reviewList.length < CHUNK_SIZE ||
        all.length >= res.pageInfo.totalElements
      ) {
        break;
      }
      page += 1;
    }
    return all;
  };

  const handleExportCsv = async () => {
    if (totalElements === 0) {
      window.alert('내보낼 후기가 없습니다.');
      return;
    }
    setIsExporting(true);
    try {
      downloadBlogReviewCsv(await fetchAllReviews());
    } catch (e) {
      console.error(e);
      window.alert('CSV 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequestPrint = async () => {
    if (totalElements === 0) {
      window.alert('인쇄할 후기가 없습니다.');
      return;
    }
    setIsExporting(true);
    try {
      pendingPrint.current = true;
      setPrintReviews(await fetchAllReviews());
    } catch (e) {
      console.error(e);
      pendingPrint.current = false;
      window.alert('인쇄 준비에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // 인쇄 DOM(printReviews) 이 렌더된 다음 프레임에 인쇄 실행
  useEffect(() => {
    if (pendingPrint.current && printReviews.length > 0) {
      pendingPrint.current = false;
      reactToPrint();
    }
  }, [printReviews, reactToPrint]);

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleAddRow = () => {
    const newReview = createRow();
    setRows((oldRows) => [newReview, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newReview.id]: { mode: GridRowModes.Edit },
    }));
  };

  const createRow = () => ({
    id: generateUUID(),
    blogReviewId: 0, // 의미 없는 값
    postDate: new Date(),
    programType: ProgramTypeEnum.enum.CHALLENGE,
    programTitle: undefined,
    name: undefined,
    title: undefined,
    description: undefined,
    url: undefined,
    thumbnail: undefined,
    isVisible: false,
    isNew: true,
  });

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // 수정 중인 행 바깥을 클릭해도 수정 모드 유지
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const isDelete = confirm('삭제하시겠습니까?');
    if (isDelete) await deleteReview.mutateAsync(id);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel<Row>) => {
    const {
      blogReviewId,
      programType,
      isVisible,
      programTitle,
      name,
      description,
      url,
      postDate,
    } = newRow;
    const updatedRow = { ...newRow, isNew: false };
    const target = rows.find((row) => row.id === newRow.id);

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (target?.isNew) {
      // [API] 리뷰 생성
      await postReview.mutateAsync({
        programType: programType ?? ProgramTypeEnum.enum.CHALLENGE,
        programTitle,
        name,
        description,
        url,
        postDate: dayjs(postDate).format(YYYY_MMDD_THHmmss),
      });
    } else {
      // [API] 리뷰 수정
      await patchReview.mutateAsync({
        blogReviewId,
        programType: programType ?? ProgramTypeEnum.enum.CHALLENGE,
        programTitle,
        name,
        description,
        url,
        isVisible: isVisible ?? false,
        postDate: dayjs(postDate).format(YYYY_MMDD_THHmmss),
      });
    }

    return updatedRow;
  };

  // 행 초기화
  useEffect(() => {
    const initialRows =
      data?.reviewList.map((review) => ({
        ...review,
        id: review.blogReviewId,
        isNew: false,
      })) ?? [];

    setRows(initialRows);
  }, [data, setRows]);

  return (
    <div className="p-5">
      <AdminReviewHeader />
      <div className="flex items-end justify-between pb-2">
        <div>
          <h2 className="font-semibold">동작 설명</h2>
          <p className="text-xsmall14">
            <span className="text-requirement block">
              *<b>등록/편집</b>: 한 번에 하나만 가능
            </span>
            <span className="block">
              *생성 시에는 노출 불가능 (default: false)
            </span>
            <span className="block">
              *URL이 없는 리뷰를 노출하지 마세요{' '}
              <span className="text-requirement">
                (USER 페이지에서 에러 발생)
              </span>
            </span>
          </p>
        </div>
        <div>
          <h2 className="font-semibold">등록할 수 있는 URL 목록</h2>
          <ul className="text-xsmall14 list-disc pl-6">
            <li>
              네이버 블로그 (<b className="text-requirement">모바일</b>)
            </li>
            <li>티스토리 블로그</li>
            <li>미디엄 Medium</li>
            <li>벨로그 Velog</li>
            <li>디스콰이엇 Disquiet</li>
          </ul>
        </div>
        <Button className="h-fit" variant="outlined" onClick={handleAddRow}>
          등록
        </Button>
      </div>
      <DataGrid
        autoHeight
        editMode="row"
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableRowSelectionOnClick
        pagination
        paginationMode="server"
        rowCount={data?.pageInfo.totalElements ?? 0}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        columnVisibilityModel={{ __rowNum: showRowNumber }}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            onExportCsv: handleExportCsv,
            onPrint: handleRequestPrint,
            isBusy: isExporting,
            showRowNumber,
            onToggleRowNumber: setShowRowNumber,
          },
        }}
      />

      {/* 인쇄 전용 DOM — 화면 밖에 두고 react-to-print 가 클론해 인쇄. 전량(printReviews) 렌더 */}
      <div className="pointer-events-none fixed left-[-10000px] top-0 -z-10">
        <div ref={printRef} className="p-6">
          <h1 className="mb-3 text-lg font-bold">
            블로그 후기 목록 ({printReviews.length}건)
          </h1>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="border border-neutral-400 px-1.5 py-1 text-left">
                  No.
                </th>
                {BLOG_REVIEW_EXPORT_COLUMNS.map((c) => (
                  <th
                    key={c.header}
                    className="border border-neutral-400 px-1.5 py-1 text-left"
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {printReviews.map((review, index) => (
                <tr key={review.blogReviewId}>
                  <td className="border border-neutral-400 px-1.5 py-1 align-top">
                    {index + 1}
                  </td>
                  {BLOG_REVIEW_EXPORT_COLUMNS.map((c) => (
                    <td
                      key={c.header}
                      className="border border-neutral-400 px-1.5 py-1 align-top"
                    >
                      {c.value(review)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
