import {
  AdminBlogReview,
  useDeleteAdminBlogReview,
  useGetAdminBlogReviewList,
  usePatchAdminBlogReview,
  usePostAdminBlogReview,
} from '@/api/review';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ProgramTypeEnum } from '@/schema';
import { generateUUID } from '@/utils/random';
import { Button, Checkbox } from '@mui/material';
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
  GridToolbarExport,
} from '@mui/x-data-grid';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminReviewHeader from './AdminReviewHeader';

function CustomToolbar() {
  const csvOptions = {
    fileName: `blog-review-${Date.now().toString()}`,
    utf8WithBom: true,
  };

  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={csvOptions} />
    </GridToolbarContainer>
  );
}

const createRow = () => ({
  id: generateUUID(),
  blogReviewId: 0, // 의미 없는 값
  postDate: new Date(),
  programType: ProgramTypeEnum.enum.CHALLENGE,
  programTitle: undefined,
  name: undefined,
  title: undefined,
  url: undefined,
  thumbnail: undefined,
  isVisible: false,
  isNew: true,
});

type Row = AdminBlogReview & {
  id: number | string;
  isNew: boolean;
};

export default function AdminBlogReviewListPage() {
  const { data } = useGetAdminBlogReviewList();
  const postReview = usePostAdminBlogReview();
  const patchReview = usePatchAdminBlogReview();
  const deleteReview = useDeleteAdminBlogReview();

  const columns: GridColDef<Row>[] = [
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
      field: 'bankName',
      headerName: '은행명',
      width: 110,
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
      data?.map((review) => ({
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
            <span className="block text-requirement">
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
          <ul className="list-disc pl-6 text-xsmall14">
            <li>
              네이버 블로그 (<b className="text-requirement">모바일</b>)
            </li>
            <li>티스토리 블로그</li>
            <li>미디엄 Medium</li>
            <li>벨로그 Velog</li>
            <li>디스콰이엇 Disquiet</li>
          </ul>
        </div>
        <div>
          <Button className="h-fit" variant="outlined" onClick={handleAddRow}>
            등록
          </Button>
        </div>
      </div>
      <DataGrid
        editMode="row"
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableRowSelectionOnClick
        hideFooter
        slots={{ toolbar: CustomToolbar }}
      />
    </div>
  );
}
