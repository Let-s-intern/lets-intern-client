import {
  useDeleteAdminBlogPopup,
  useGetAdminBlogPopupList,
} from '@/api/blog/blogPopup';
import { AdminBlogPopupListItem } from '@/api/blog/blogPopupSchema';
import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import Heading from '@/domain/admin/ui/heading/Heading';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { usePageableWithSearchParams } from '@/hooks/usePageableWithSearchParams';
import { formatPriority } from './popup/blogPopupForm';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

type Row = {
  id: number;
} & AdminBlogPopupListItem;

/** 클릭률은 서버가 이미 백분율로 내려준다. 화면에서 다시 나누지 않는다. */
export const formatClickRate = (clickRate?: number | null) =>
  `${(clickRate ?? 0).toFixed(1)}%`;

/**
 * 우선순위가 없는 팝업은 정렬 방향과 상관없이 항상 뒤로 간다. 숫자를 지정한 팝업보다
 * 뒤로 밀린다는 규칙을 목록도 그대로 보여줘야 한다.
 */
export const comparePriority = (
  a: number | null | undefined,
  b: number | null | undefined,
  sortDirection: 'asc' | 'desc',
) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return sortDirection === 'desc' ? b - a : a - b;
};

export const formatTarget = (
  row: Pick<Row, 'targetType' | 'targetBlogCount'>,
) => (row.targetType === 'ALL' ? '전체' : `선택 ${row.targetBlogCount ?? 0}개`);

export default function BlogPopupListPage() {
  const navigate = useNavigate();

  const { pageable, handlePageChange } = usePageableWithSearchParams({
    defaultPage: 1,
    defaultSize: 10,
  });

  const { data } = useGetAdminBlogPopupList(pageable);
  const remove = useDeleteAdminBlogPopup();

  const rows = useMemo(
    () =>
      data?.blogPopupList.map((popup) => ({
        ...popup,
        id: popup.blogPopupId,
        target: formatTarget(popup),
        startDate: popup.startDate
          ? dayjs(popup.startDate).format(LOCALIZED_YYYY_MDdd_HHmm)
          : '',
        endDate: popup.endDate
          ? dayjs(popup.endDate).format(LOCALIZED_YYYY_MDdd_HHmm)
          : '',
      })) ?? [],
    [data],
  );

  const columns: GridColDef<Row>[] = [
    { field: 'title', headerName: '제목', width: 200 },
    { field: 'target', headerName: '노출 대상', width: 100, sortable: false },
    {
      field: 'priority',
      headerName: '우선순위',
      width: 100,
      type: 'number',
      valueFormatter: (value: number | null) => formatPriority(value),
      getSortComparator: (sortDirection) => (a, b) =>
        comparePriority(a, b, sortDirection === 'desc' ? 'desc' : 'asc'),
    },
    { field: 'link', headerName: '링크', width: 200, sortable: false },
    { field: 'startDate', headerName: '시작일', width: 200, sortable: false },
    { field: 'endDate', headerName: '종료일', width: 200, sortable: false },
    {
      field: 'isVisible',
      headerName: '노출 여부',
      width: 100,
      sortable: false,
      valueFormatter: (value: boolean) => (value ? '노출 중' : '중지'),
    },
    {
      field: 'impressionCount',
      headerName: '노출 수',
      width: 100,
      type: 'number',
    },
    { field: 'clickCount', headerName: '클릭 수', width: 100, type: 'number' },
    {
      // 정렬은 DataGrid 가 화면에서 처리한다. 목록 규모가 작아 서버 정렬이 필요 없다.
      field: 'clickRate',
      headerName: '클릭률',
      width: 100,
      type: 'number',
      valueFormatter: (value: number | null) => formatClickRate(value),
    },
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
            onClick={() => navigate(`/blog/popup/edit/${id}`)}
          />,
          <GridActionsCellItem
            key={'delete' + id}
            icon={<Trash color="red" size={20} />}
            label="Delete"
            onClick={() => {
              if (!window.confirm('정말로 삭제하시겠습니까?')) return;
              remove.mutate(Number(id));
            }}
          />,
        ];
      },
    },
  ];

  return (
    <div className="p-5">
      <Heading>블로그 팝업 관리</Heading>
      <div className="flex justify-end pb-2">
        <Button
          className="h-fit"
          variant="outlined"
          onClick={() => navigate('/blog/popup/create')}
        >
          등록
        </Button>
      </div>
      <DataGrid
        autoHeight
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
      {data?.pageInfo && (
        <MuiPagination
          className="mt-4"
          pageInfo={data.pageInfo}
          page={pageable.page}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
