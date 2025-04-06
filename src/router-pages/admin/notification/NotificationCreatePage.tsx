import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { generateUUID } from '@/utils/random';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Button, Checkbox } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';

type Row = {
  title: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
} & {
  id: number | string;
};

const NotificationCreatePage = () => {
  const columns: GridColDef<Row>[] = [
    {
      field: 'title',
      headerName: '제목',
      width: 200,
    },
    { field: 'startDate', headerName: '시작일', width: 240 },
    { field: 'endDate', headerName: '종료일', width: 240 },
    {
      field: 'isVisible',
      headerName: '노출 여부',
      sortable: false,
      width: 80,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Row, boolean>) => (
        <Checkbox
          checked={params.value}
          onChange={async () => {
            // const { blogReviewId } = params.row;
            // await patchReview.mutateAsync({
            //   blogReviewId,
            //   isVisible: !params.value,
            // });
            console.log('노출 여부 수정');
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '관리',
      width: 100,
      getActions: (params: GridRowParams<Row>) => {
        const id = params.id;

        return [
          <GridActionsCellItem
            key={'edit' + id}
            icon={<Pencil size={20} />}
            label="Edit"
            onClick={() => console.log('수정')}
          />,
          <GridActionsCellItem
            key={'delete' + id}
            icon={<Trash color="red" size={20} />}
            label="Delete"
            onClick={() => console.log('삭제')}
          />,
        ];
      },
    },
  ];
  const rows = [
    {
      id: generateUUID(),
      title: '추천 프로그램 1',
      startDate: dayjs('2025-04-06T08:37:00').format(LOCALIZED_YYYY_MDdd_HHmm),
      endDate: dayjs('2025-05-06T08:37:00').format(LOCALIZED_YYYY_MDdd_HHmm),
      isVisible: true,
    },
    {
      id: generateUUID(),
      title: '추천 프로그램 2',
      startDate: dayjs('2025-04-06T08:37:00').format(LOCALIZED_YYYY_MDdd_HHmm),
      endDate: dayjs('2025-08-06T08:37:00').format(LOCALIZED_YYYY_MDdd_HHmm),
      isVisible: false,
    },
  ];

  return (
    <div className="p-5">
      <Header>
        <Heading>출시 알림 신청</Heading>
        <Button variant="outlined" onClick={() => console.log('추가')}>
          추가
        </Button>
      </Header>

      <main>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
        />
      </main>
    </div>
  );
};

export default NotificationCreatePage;
