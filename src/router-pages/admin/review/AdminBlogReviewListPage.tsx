'use client';

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
} from '@mui/x-data-grid';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import {
  AdminBlogReview,
  useGetAdminBlogReviewList,
  usePostAdminBlogReview,
} from '@/api/review';
import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ProgramTypeEnum } from '@/schema';
import { generateUuid } from '@/utils/random';
import AdminReviewHeader from './AdminReviewHeader';

type Row = AdminBlogReview & { id: number | string; isNew: boolean };

export default function AdminBlogReviewListPage() {
  const { data } = useGetAdminBlogReviewList();
  const postReview = usePostAdminBlogReview();

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
      valueOptions: Object.values(ProgramTypeEnum.enum),
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
      renderCell: (params: GridRenderCellParams<Row, boolean>) => {
        return <CellCheckbox defaultValue={params.value ?? true} />;
      },
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
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancel' + id}
              icon={<X size={20} />}
              label="Cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={'edit' + id}
            icon={<Pencil size={20} />}
            label="Edit"
          />,
          <GridActionsCellItem
            key={'delete' + id}
            icon={<Trash color="red" size={20} />}
            label="Delete"
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [rows, setRows] = useState<Row[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleSaveClick = (id: GridRowId) => {
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
    id: generateUuid(),
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

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow: GridRowModel<Row>) => {
    const updatedRow = { ...newRow, isNew: false };
    const target = rows.find((row) => row.id === newRow.id);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (target?.isNew) {
      await postReview.mutateAsync({
        programType: newRow.programType ?? ProgramTypeEnum.enum.CHALLENGE,
        programTitle: newRow.programTitle,
        name: newRow.name,
        url: newRow.url,
        postDate: dayjs(newRow.postDate).format(YYYY_MMDD_THHmmss),
      });
    } else {
      // Patch
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
      <div className="flex items-center justify-between p-2">
        <span className="text-requirement">더블 클릭하여 수정하세요</span>
        <Button variant="outlined" onClick={handleAddRow}>
          등록
        </Button>
      </div>
      <DataGrid
        editMode="row"
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
