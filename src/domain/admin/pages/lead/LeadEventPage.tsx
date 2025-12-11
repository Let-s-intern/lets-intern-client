'use client';

import {
  CreateLeadEventRequest,
  LeadEvent,
  LeadEventListParams,
  useCreateLeadEventMutation,
  useDeleteLeadEventMutation,
  useLeadEventListQuery,
} from '@/api/lead';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';

const splitToList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const splitToNumberList = (value: string) =>
  splitToList(value)
    .map((item) => Number(item))
    .filter((num) => !Number.isNaN(num));

const optionalArray = <T,>(value: T[]) =>
  value.length > 0 ? value : undefined;

type LeadEventRow = LeadEvent & { id: number };

const defaultFilterForm = {
  leadEventIds: '',
  types: '',
  titleKeyword: '',
};

const CreateLeadEventDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  onValidationError,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadEventRequest) => Promise<void>;
  isSubmitting: boolean;
  onValidationError: (message: string) => void;
}) => {
  const [form, setForm] = useState<CreateLeadEventRequest>({
    type: '',
    title: '',
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm({ type: '', title: '' });
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.type || !form.title) {
      onValidationError('타입과 제목을 모두 입력해주세요.');
      return;
    }

    await onSubmit(form);
    setForm({ type: '', title: '' });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>리드 이벤트 등록</DialogTitle>
      <DialogContent className="flex flex-col gap-4 py-4">
        <TextField
          required
          label="타입"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="예: CAMPAIGN, OFFLINE"
        />
        <TextField
          required
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LeadEventPage = () => {
  const [filterForm, setFilterForm] = useState(defaultFilterForm);
  const [appliedFilters, setAppliedFilters] = useState<
    Partial<Omit<LeadEventListParams, 'pageable'>>
  >({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const { snackbar } = useAdminSnackbar();

  const queryParams = useMemo<LeadEventListParams>(
    () => ({
      pageable: {
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      },
      ...appliedFilters,
    }),
    [appliedFilters, paginationModel.page, paginationModel.pageSize],
  );

  const { data, isLoading } = useLeadEventListQuery(queryParams);

  const rows = useMemo<LeadEventRow[]>(() => {
    const list = data?.leadEventList ?? [];
    const baseIndex = paginationModel.page * paginationModel.pageSize;
    return list.map((item, index) => ({
      ...item,
      id: baseIndex + index,
    }));
  }, [data, paginationModel.page, paginationModel.pageSize]);

  const handleFilterChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const leadEventIdList = splitToNumberList(filterForm.leadEventIds);
    const typeList = splitToList(filterForm.types);
    const titleKeyword = filterForm.titleKeyword.trim();

    setAppliedFilters({
      leadEventIdList: optionalArray(leadEventIdList),
      typeList: optionalArray(typeList),
      titleKeyword: titleKeyword || undefined,
    });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleFilterReset = () => {
    setFilterForm(defaultFilterForm);
    setAppliedFilters({});
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createLeadEvent = useCreateLeadEventMutation();
  const deleteLeadEvent = useDeleteLeadEventMutation();

  const handleCreate = async (payload: CreateLeadEventRequest) => {
    try {
      await createLeadEvent.mutateAsync(payload);
      snackbar('이벤트가 등록되었습니다.');
      setIsCreateOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      snackbar('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = useCallback(
    async (leadEventId: number) => {
      const confirmed = window.confirm('해당 리드 이벤트를 삭제하시겠습니까?');
      if (!confirmed) return;

      try {
        await deleteLeadEvent.mutateAsync(leadEventId);
        snackbar('이벤트가 삭제되었습니다.');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        snackbar('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [deleteLeadEvent, snackbar],
  );

  const columns = useMemo<GridColDef<LeadEventRow>[]>(
    () => [
      {
        field: 'leadEventId',
        headerName: '이벤트 ID',
        width: 140,
      },
      {
        field: 'title',
        headerName: '제목',
        width: 240,
      },
      {
        field: 'type',
        headerName: '타입',
        width: 180,
      },
      {
        field: 'createDate',
        headerName: '생성일',
        width: 200,
        valueFormatter: (value) =>
          value ? dayjs(value).format('YYYY.MM.DD HH:mm') : '-',
      },
      {
        field: 'actions',
        headerName: '관리',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Button
            color="error"
            size="small"
            variant="outlined"
            onClick={() => handleDelete(row.leadEventId)}
            disabled={deleteLeadEvent.isPending}
          >
            삭제
          </Button>
        ),
      },
    ],
    [deleteLeadEvent.isPending, handleDelete],
  );

  return (
    <section className="p-5">
      <Heading className="mb-4">리드 이벤트 관리</Heading>
      <form
        className="rounded mb-4 flex flex-col gap-4 bg-neutral-90 p-4"
        onSubmit={handleFilterSubmit}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="이벤트 ID"
            name="leadEventIds"
            value={filterForm.leadEventIds}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="타입"
            name="types"
            value={filterForm.types}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="제목 키워드"
            name="titleKeyword"
            value={filterForm.titleKeyword}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="contained">
            검색
          </Button>
          <Button type="button" variant="outlined" onClick={handleFilterReset}>
            전체보기
          </Button>
          <Typography className="text-xsmall14 text-neutral-400">
            여러 값을 입력할 경우 쉼표(,) 또는 줄바꿈으로 구분해주세요.
          </Typography>
        </div>
      </form>

      <div className="mb-4 flex justify-between">
        <Typography className="text-xsmall14 text-neutral-500">
          필터 적용 시 페이지는 초기화됩니다. 그리드의 정렬 및 검색 기능은
          지원하지 않습니다.
        </Typography>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          이벤트 등록
        </Button>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        loading={isLoading}
        rowCount={data?.pageInfo.totalElements ?? 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[20, 50, 100]}
        autoHeight
      />

      <CreateLeadEventDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createLeadEvent.isPending}
        onValidationError={(message) => snackbar(message)}
      />
    </section>
  );
};

export default LeadEventPage;
