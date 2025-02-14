import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { generateUuid } from '@/utils/random';
import { Button, Checkbox } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import { useMemo } from 'react';

const mockData = [
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다1',
    url: 'https://www.naver.com/',
    isVisible: true,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다2',
    url: 'https://www.naver.com/',
    isVisible: false,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다3',
    url: 'https://www.naver.com/',
    isVisible: true,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다4',
    url: 'https://www.naver.com/',
    isVisible: true,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다5',
    url: 'https://www.naver.com/',
    isVisible: false,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
  {
    id: generateUuid(),
    title: '메인 배너 제목입니다6',
    url: 'https://www.naver.com/',
    isVisible: true,
    startDate: '2025-02-14T13:29:26',
    endDate: '2025-04-26T13:29:26',
  },
];

export default function BlogBannerListPage() {
  const rows = useMemo(() => {
    return mockData.map((data) => ({
      ...data,
      startDate: dayjs(data.startDate).format(LOCALIZED_YYYY_MDdd_HHmm),
      endDate: dayjs(data.endDate).format(LOCALIZED_YYYY_MDdd_HHmm),
    }));
  }, []);
  type Row = {
    id: string;
    title: string;
    url: string;
    isVisible: boolean;
    startDate: string;
    endDate: string;
  };

  const columns: GridColDef<Row>[] = [
    {
      field: 'title',
      headerName: '제목',
      width: 200,
    },
    {
      field: 'url',
      headerName: '링크',
      width: 150,
      sortable: false,
    },
    {
      field: 'isVisible',
      headerName: '노출 여부',
      sortable: false,
      width: 100,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Row, boolean>) => (
        <Checkbox
          checked={params.value}
          onChange={async () => console.log('Change isVisible')}
        />
      ),
    },
    { field: 'startDate', headerName: '시작일', width: 240 },
    { field: 'endDate', headerName: '종료일', width: 240 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '액션',
      width: 100,
      getActions: (params: GridRowParams<Row>) => {
        const id = params.id;
        return [
          <GridActionsCellItem
            key={'edit' + id}
            icon={<Pencil size={20} />}
            label="Edit"
            onClick={() => {}}
          />,
          <GridActionsCellItem
            key={'delete' + id}
            icon={<Trash color="red" size={20} />}
            label="Delete"
            onClick={() => {}}
          />,
        ];
      },
    },
  ];

  return (
    <div className="p-5">
      <h1 className="mb-2 text-medium22 font-bold">블로그 광고 배너 관리</h1>
      <div className="flex justify-end pb-2">
        <Button className="h-fit" variant="outlined" onClick={() => {}}>
          등록
        </Button>
      </div>
      <DataGrid
        columnGroupingModel={[
          {
            groupId: 'period',
            headerName: '노출기간',
            children: [{ field: 'startDate' }, { field: 'endDate' }],
          },
        ]}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
      />
    </div>
  );
}
