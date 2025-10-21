'use client';

import {
  CreateLeadHistoryRequest,
  LeadEvent,
  LeadHistory,
  LeadHistoryEventType,
  LeadHistoryListParams,
  useCreateLeadHistoryMutation,
  useLeadEventListQuery,
  useLeadHistoryListQuery,
} from '@/api/lead';
import Heading from '@/components/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

const leadHistoryEventTypeLabels: Record<LeadHistoryEventType, string> = {
  SIGN_UP: '회원가입',
  PROGRAM: '프로그램',
  LEAD_EVENT: '리드 이벤트',
};

const splitToList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const splitToNumberList = (value: string) =>
  splitToList(value)
    .map((item) => Number(item))
    .filter((num) => !Number.isNaN(num));

const optionalArray = <T,>(value: T[]) => (value.length > 0 ? value : undefined);

type LeadHistoryRow = LeadHistory & {
  id: number;
  eventTitle: string | null;
};

const defaultFilterForm = {
  eventTypes: [] as LeadHistoryEventType[],
  leadEventIds: '',
  leadEventTypes: '',
  names: '',
  phoneNums: '',
};

const defaultCreateForm: Record<
  keyof CreateLeadHistoryRequest | 'userId' | 'leadEventId',
  string
> = {
  leadEventId: '',
  userId: '',
  name: '',
  phoneNum: '',
  email: '',
  inflow: '',
  university: '',
  major: '',
  wishField: '',
  wishCompany: '',
  wishIndustry: '',
  wishJob: '',
  jobStatus: '',
  instagramId: '',
};

const CreateLeadHistoryDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  leadEvents,
  onValidationError,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadHistoryRequest) => Promise<void>;
  isSubmitting: boolean;
  leadEvents?: LeadEvent[];
  onValidationError: (message: string) => void;
}) => {
  const [form, setForm] = useState(defaultCreateForm);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(defaultCreateForm);
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.leadEventId) {
      onValidationError('리드 이벤트를 선택해주세요.');
      return;
    }

    const payload: CreateLeadHistoryRequest = {
      leadEventId: Number(form.leadEventId),
      name: form.name || undefined,
      phoneNum: form.phoneNum || undefined,
      email: form.email || undefined,
      inflow: form.inflow || undefined,
      university: form.university || undefined,
      major: form.major || undefined,
      wishField: form.wishField || undefined,
      wishCompany: form.wishCompany || undefined,
      wishIndustry: form.wishIndustry || undefined,
      wishJob: form.wishJob || undefined,
      jobStatus: form.jobStatus || undefined,
      instagramId: form.instagramId || undefined,
    };

    if (form.userId) {
      const userId = Number(form.userId);
      if (!Number.isNaN(userId)) {
        payload.userId = userId;
      }
    }

    await onSubmit(payload);
    setForm(defaultCreateForm);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>리드 등록</DialogTitle>
      <DialogContent className="flex flex-col gap-4 py-4">
        <TextField
          select
          required
          label="리드 이벤트"
          name="leadEventId"
          value={form.leadEventId}
          onChange={handleChange}
          helperText="리드가 소속될 이벤트를 선택하세요."
        >
          {leadEvents?.map((event) => (
            <MenuItem key={event.leadEventId} value={event.leadEventId}>
              {event.title ?? `#${event.leadEventId}`}
            </MenuItem>
          ))}
        </TextField>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="회원 ID"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="기존 회원이라면 숫자 ID를 입력하세요."
          />
          <TextField
            label="이름"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="전화번호"
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
          />
          <TextField
            label="이메일"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="유입 경로"
            name="inflow"
            value={form.inflow}
            onChange={handleChange}
          />
          <TextField
            label="대학"
            name="university"
            value={form.university}
            onChange={handleChange}
          />
          <TextField
            label="전공"
            name="major"
            value={form.major}
            onChange={handleChange}
          />
          <TextField
            label="희망 직무"
            name="wishJob"
            value={form.wishJob}
            onChange={handleChange}
          />
          <TextField
            label="희망 회사"
            name="wishCompany"
            value={form.wishCompany}
            onChange={handleChange}
          />
          <TextField
            label="희망 산업군"
            name="wishIndustry"
            value={form.wishIndustry}
            onChange={handleChange}
          />
          <TextField
            label="희망 분야"
            name="wishField"
            value={form.wishField}
            onChange={handleChange}
          />
          <TextField
            label="현 직무 상태"
            name="jobStatus"
            value={form.jobStatus}
            onChange={handleChange}
          />
          <TextField
            label="인스타그램 ID"
            name="instagramId"
            value={form.instagramId}
            onChange={handleChange}
          />
        </div>
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

const LeadHistoryPage = () => {
  const [filterForm, setFilterForm] = useState(defaultFilterForm);
  const [appliedFilters, setAppliedFilters] = useState<
    Partial<Omit<LeadHistoryListParams, 'pageable'>>
  >({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });
  const { snackbar } = useAdminSnackbar();

  const queryParams = useMemo<LeadHistoryListParams>(
    () => ({
      pageable: {
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      },
      ...appliedFilters,
    }),
    [appliedFilters, paginationModel.page, paginationModel.pageSize],
  );

  const { data, isLoading } = useLeadHistoryListQuery(queryParams);

  const leadEventListParams = useMemo(
    () => ({
      pageable: { page: 1, size: 1000 },
    }),
    [],
  );
  const { data: leadEventData } = useLeadEventListQuery(leadEventListParams);

  const leadEventMap = useMemo(() => {
    const map = new Map<number, string>();
    leadEventData?.leadEventList.forEach((event) => {
      map.set(event.leadEventId, event.title ?? '');
    });
    return map;
  }, [leadEventData]);

  const rows = useMemo<LeadHistoryRow[]>(() => {
    const list = data?.leadHistoryList ?? [];
    const baseIndex = paginationModel.page * paginationModel.pageSize;

    return list.map((item, index) => ({
      ...item,
      id: baseIndex + index,
      eventTitle:
        item.title ??
        (item.leadEventId != null
          ? leadEventMap.get(item.leadEventId) ?? null
          : null),
    }));
  }, [data, leadEventMap, paginationModel.page, paginationModel.pageSize]);

  const columns = useMemo<GridColDef<LeadHistoryRow>[]>(
    () => [
      {
        field: 'eventType',
        headerName: '유형',
        width: 120,
        valueFormatter: ({ value }) =>
          value ? leadHistoryEventTypeLabels[value as LeadHistoryEventType] : '-',
      },
      {
        field: 'eventTitle',
        headerName: '이벤트',
        width: 200,
        valueGetter: ({ row }: { row: LeadHistoryRow }) =>
          row.eventTitle ??
          (row.leadEventId ? `#${row.leadEventId}` : '미지정 이벤트'),
      },
      {
        field: 'name',
        headerName: '이름',
        width: 120,
      },
      {
        field: 'phoneNum',
        headerName: '전화번호',
        width: 140,
      },
      {
        field: 'email',
        headerName: '이메일',
        width: 220,
      },
      {
        field: 'inflow',
        headerName: '유입 경로',
        width: 160,
      },
      {
        field: 'wishField',
        headerName: '희망 분야',
        width: 150,
      },
      {
        field: 'wishCompany',
        headerName: '희망 회사',
        width: 150,
      },
      {
        field: 'wishIndustry',
        headerName: '희망 산업군',
        width: 150,
      },
      {
        field: 'wishJob',
        headerName: '희망 직무',
        width: 150,
      },
      {
        field: 'university',
        headerName: '대학',
        width: 140,
      },
      {
        field: 'major',
        headerName: '전공',
        width: 140,
      },
      {
        field: 'jobStatus',
        headerName: '현 직무 상태',
        width: 160,
      },
      {
        field: 'finalPrice',
        headerName: '최종 결제 금액',
        width: 160,
        valueFormatter: ({ value }) =>
          typeof value === 'number'
            ? new Intl.NumberFormat('ko-KR').format(value)
            : '-',
      },
      {
        field: 'instagramId',
        headerName: '인스타그램',
        width: 160,
      },
      {
        field: 'createDate',
        headerName: '등록일',
        width: 200,
        valueFormatter: ({ value }) =>
          value ? dayjs(value as string).format('YYYY/MM/DD HH:mm') : '-',
      },
    ],
    [],
  );

  const handleFilterChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventTypeToggle = (value: LeadHistoryEventType) => {
    setFilterForm((prev) => {
      const hasValue = prev.eventTypes.includes(value);
      const nextEventTypes = hasValue
        ? prev.eventTypes.filter((item) => item !== value)
        : [...prev.eventTypes, value];

      return { ...prev, eventTypes: nextEventTypes };
    });
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const leadEventIdList = splitToNumberList(filterForm.leadEventIds);
    const leadEventTypeList = splitToList(filterForm.leadEventTypes);
    const nameList = splitToList(filterForm.names);
    const phoneNumList = splitToList(filterForm.phoneNums);

    setAppliedFilters({
      eventTypeList: optionalArray(filterForm.eventTypes),
      leadEventIdList: optionalArray(leadEventIdList),
      leadEventTypeList: optionalArray(leadEventTypeList),
      nameList: optionalArray(nameList),
      phoneNumList: optionalArray(phoneNumList),
    });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleFilterReset = () => {
    setFilterForm(defaultFilterForm);
    setAppliedFilters({});
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createLeadHistory = useCreateLeadHistoryMutation();

  const handleCreate = async (payload: CreateLeadHistoryRequest) => {
    try {
      await createLeadHistory.mutateAsync(payload);
      snackbar('리드가 등록되었습니다.');
      setIsCreateOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      snackbar('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">리드 히스토리 관리</Heading>
      <form
        className="mb-4 flex flex-col gap-4 rounded bg-neutral-90 p-4"
        onSubmit={handleFilterSubmit}
      >
        <div className="flex flex-wrap gap-4">
          {(Object.keys(leadHistoryEventTypeLabels) as LeadHistoryEventType[]).map(
            (type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={filterForm.eventTypes.includes(type)}
                    onChange={() => handleEventTypeToggle(type)}
                  />
                }
                label={leadHistoryEventTypeLabels[type]}
              />
            ),
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="리드 이벤트 ID"
            name="leadEventIds"
            value={filterForm.leadEventIds}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="리드 이벤트 타입"
            name="leadEventTypes"
            value={filterForm.leadEventTypes}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="이름"
            name="names"
            value={filterForm.names}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="전화번호"
            name="phoneNums"
            value={filterForm.phoneNums}
            onChange={handleFilterChange}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
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
          리드 등록
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

      <CreateLeadHistoryDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createLeadHistory.isPending}
        leadEvents={leadEventData?.leadEventList}
        onValidationError={(message) => snackbar(message)}
      />
    </section>
  );
};

export default LeadHistoryPage;
