import { useGetAdminBlogBannerList, usePatchAdminBlogBanner } from '@/api/blog';
import { AdminBlogBannerListItem } from '@/api/blogSchema';
import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
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
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type Row = {
  id: number;
} & AdminBlogBannerListItem;

export default function BlogBannerListPage() {
  const navigate = useNavigate();

  const { data } = useGetAdminBlogBannerList();
  const patch = usePatchAdminBlogBanner();

  const rows = useMemo(() => {
    return data?.blogBannerList.map((data) => ({
      ...data,
      id: data.blogBannerId,
      startDate: dayjs(data.startDate).format(LOCALIZED_YYYY_MDdd_HHmm),
      endDate: dayjs(data.endDate).format(LOCALIZED_YYYY_MDdd_HHmm),
    }));
  }, [data]);

  const columns: GridColDef<Row>[] = [
    {
      field: 'title',
      headerName: '제목',
      width: 200,
    },
    {
      field: 'link',
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
          onChange={async () => {
            await patch.mutateAsync({
              blogBannerId: params.row.blogBannerId,
              isVisible: !params.value,
            });
          }}
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
            onClick={() => navigate(`/admin/blog/banner/edit/${id}`)}
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
      <Heading>블로그 광고 배너 관리</Heading>
      <div className="flex justify-end pb-2">
        <Button
          className="h-fit"
          variant="outlined"
          onClick={() => navigate('/admin/blog/banner/create')}
        >
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
