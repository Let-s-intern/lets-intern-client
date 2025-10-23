'use client';

import {
  CreateLeadHistoryRequest,
  LeadEvent,
  LeadHistory,
  LeadHistoryEventType,
  LeadHistoryFilters,
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { groupBy } from 'es-toolkit';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

const leadHistoryEventTypeLabels: Record<LeadHistoryEventType, string> = {
  SIGN_UP: '회원가입',
  PROGRAM: '프로그램 참여',
  LEAD_EVENT: '리드 이벤트',
};

type LeadHistoryGroupRow = {
  id: string;
  phoneNum: string | null;
  displayPhoneNum: string;
  name: string | null;
  email: string | null;
  inflow: string | null;
  firstInflowDate: string | null;
  university: string | null;
  major: string | null;
  wishField: string | null;
  wishCompany: string | null;
  wishIndustry: string | null;
  wishJob: string | null;
  jobStatus: string | null;
  instagramId: string | null;
  latestEventType?: LeadHistoryEventType;
  latestEventTitle: string | null;
  programHistory: { date: string; title: string | null }[];
  latestCreateDate: string | null;
  latestTimestamp: number;
  totalActions: number;
  programCount: number;
  totalFinalPrice: number;
  items: LeadHistory[];
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

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
};

const toTimestamp = (value?: string | null) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const date = dayjs(value);
  return date.isValid() ? date.valueOf() : Number.NEGATIVE_INFINITY;
};

const formatNullableText = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim().length ? value : '-';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return '-';
};

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'string' ? value : String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const parseEventTypeParam = (param: string | null): LeadHistoryEventType[] => {
  if (!param) return [];
  return param
    .split(',')
    .map((value) => value.trim())
    .filter(
      (value): value is LeadHistoryEventType =>
        value === 'SIGN_UP' || value === 'PROGRAM' || value === 'LEAD_EVENT',
    );
};

const buildFiltersFromParams = (
  params: URLSearchParams,
): LeadHistoryFilters => {
  const leadEventIdsParam = params.get('leadEventIds') ?? '';
  const leadEventTypesParam = params.get('leadEventTypes') ?? '';
  const namesParam = params.get('names') ?? '';
  const phoneNumsParam = params.get('phoneNums') ?? '';

  const eventTypeList = parseEventTypeParam(params.get('eventTypes'));
  const leadEventIdList = splitToNumberList(leadEventIdsParam);
  const leadEventTypeList = splitToList(leadEventTypesParam);
  const nameList = splitToList(namesParam);
  const phoneNumList = splitToList(phoneNumsParam);

  return {
    eventTypeList: eventTypeList.length ? eventTypeList : undefined,
    leadEventIdList: leadEventIdList.length ? leadEventIdList : undefined,
    leadEventTypeList: leadEventTypeList.length ? leadEventTypeList : undefined,
    nameList: nameList.length ? nameList : undefined,
    phoneNumList: phoneNumList.length ? phoneNumList : undefined,
  };
};

const buildFormStateFromParams = (params: URLSearchParams) => ({
  eventTypes: parseEventTypeParam(params.get('eventTypes')),
  leadEventIds: params.get('leadEventIds') ?? '',
  leadEventTypes: params.get('leadEventTypes') ?? '',
  names: params.get('names') ?? '',
  phoneNums: params.get('phoneNums') ?? '',
});

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

const LeadHistoryTable = memo(
  ({
    data,
    columns,
    isLoading,
  }: {
    data: LeadHistoryGroupRow[];
    columns: ColumnDef<LeadHistoryGroupRow>[];
    isLoading: boolean;
  }) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
      data,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getRowId: (row) => row.id,
    });

    const columnCount = table.getAllLeafColumns().length || columns.length || 1;

    return (
      <div className="rounded border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (header.isPlaceholder) {
                      return <th key={header.id} className="px-3 py-2" />;
                    }

                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    const headerClassName =
                      header.column.columnDef.meta?.headerClassName ?? '';

                    return (
                      <th
                        key={header.id}
                        className={`px-3 py-2 font-medium text-neutral-700 ${headerClassName}`}
                      >
                        <button
                          type="button"
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          className={`flex items-center gap-1 ${canSort ? 'cursor-pointer select-none' : 'cursor-default'}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' && (
                            <span aria-hidden className="text-[10px] leading-none">
                              ▲
                            </span>
                          )}
                          {sorted === 'desc' && (
                            <span aria-hidden className="text-[10px] leading-none">
                              ▼
                            </span>
                          )}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-3 py-10 text-center text-neutral-500"
                  >
                    로딩 중...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-3 py-6 text-center text-neutral-500"
                  >
                    표시할 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-neutral-100 hover:bg-neutral-90/40"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const cellClassName =
                        cell.column.columnDef.meta?.cellClassName ?? '';

                      return (
                        <td
                          key={cell.id}
                          className={`px-3 py-2 align-top text-neutral-900 ${cellClassName}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

LeadHistoryTable.displayName = 'LeadHistoryTable';

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
  const [form, setForm] = useState<
    Record<keyof CreateLeadHistoryRequest | 'userId' | 'leadEventId', string>
  >({
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
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm({
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
    });
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
    handleClose();
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultFormValues = useMemo(
    () => buildFormStateFromParams(searchParams),
    [searchParams],
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { snackbar } = useAdminSnackbar();

  const appliedFilters = useMemo<LeadHistoryFilters>(
    () => buildFiltersFromParams(searchParams),
    [searchParams],
  );

  const { data: leadHistoryData = [], isLoading } =
    useLeadHistoryListQuery(appliedFilters);

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

  const groupedRows = useMemo<LeadHistoryGroupRow[]>(() => {
    if (!leadHistoryData.length) return [];

    const groups = groupBy(leadHistoryData, (item) => {
      const normalizedPhone = item.phoneNum?.trim();
      if (normalizedPhone) return `PHONE_${normalizedPhone}`;
      if (item.userId !== null && item.userId !== undefined) {
        return `USER_${item.userId}`;
      }
      return '__NO_PHONE__';
    });

    const createRow = (
      rowId: string,
      items: LeadHistory[],
    ): LeadHistoryGroupRow => {
      const sorted = [...items].sort(
        (a, b) => toTimestamp(b.createDate) - toTimestamp(a.createDate),
      );

      const getLatestValue = <T,>(
        selector: (item: LeadHistory) => T | null | undefined,
      ): T | null => {
        for (const history of sorted) {
          const value = selector(history);
          if (!isEmptyValue(value)) {
            return (value as T) ?? null;
          }
        }
        return null;
      };

      const getOldestValue = <T,>(
        selector: (item: LeadHistory) => T | null | undefined,
      ): T | null => {
        for (let index = sorted.length - 1; index >= 0; index -= 1) {
          const value = selector(sorted[index]);
          if (!isEmptyValue(value)) {
            return (value as T) ?? null;
          }
        }
        return null;
      };

      const primaryPhone =
        getLatestValue((item) => item.phoneNum?.trim()) ?? null;

      const normalizedKeyPhone = rowId.startsWith('PHONE_')
        ? rowId.replace('PHONE_', '')
        : null;

      const displayPhoneNum =
        primaryPhone ??
        normalizedKeyPhone ??
        (rowId.startsWith('USER_')
          ? `회원 #${rowId.replace('USER_', '')}`
          : '미등록');

      const latestCreateDate =
        sorted.find((item) => item.createDate)?.createDate ?? null;
      const latestTimestamp = toTimestamp(latestCreateDate);

      const latestEventType = sorted.find((item) => item.eventType)?.eventType;

      const latestEventTitleFromData =
        getLatestValue((item) => item.title) ?? null;

      let latestEventTitle = latestEventTitleFromData;
      if (!latestEventTitle) {
        const historyWithEventId = sorted.find(
          (item) => item.leadEventId !== null && item.leadEventId !== undefined,
        );
        if (historyWithEventId?.leadEventId != null) {
          latestEventTitle =
            leadEventMap.get(historyWithEventId.leadEventId) ?? null;
        }
      }

      const programHistory = sorted
        .filter((item) => item.eventType === 'PROGRAM')
        .map((item) => ({
          date: item.createDate ?? '',
          title: item.title ?? null,
        }));

      return {
        id: rowId,
        phoneNum: primaryPhone,
        displayPhoneNum,
        name: getLatestValue((item) => item.name),
        email: getLatestValue((item) => item.email),
        inflow: getOldestValue((item) => item.inflow),
        firstInflowDate: getOldestValue((item) => item.createDate),
        university: getLatestValue((item) => item.university),
        major: getLatestValue((item) => item.major),
        wishField: getLatestValue((item) => item.wishField),
        wishCompany: getLatestValue((item) => item.wishCompany),
        wishIndustry: getLatestValue((item) => item.wishIndustry),
        wishJob: getLatestValue((item) => item.wishJob),
        jobStatus: getLatestValue((item) => item.jobStatus),
        instagramId: getLatestValue((item) => item.instagramId),
        latestEventType: latestEventType ?? undefined,
        latestEventTitle,
        programHistory,
        latestCreateDate,
        latestTimestamp,
        totalActions: items.length,
        programCount: items.filter((item) => item.eventType === 'PROGRAM')
          .length,
        totalFinalPrice: items.reduce(
          (sum, item) => sum + (item.finalPrice ?? 0),
          0,
        ),
        items,
      };
    };

    const rows: LeadHistoryGroupRow[] = [];

    Object.entries(groups).forEach(([groupKey, items]) => {
      if (groupKey === '__NO_PHONE__') {
        items.forEach((item, index) => {
          rows.push(createRow(`${groupKey}_${index}`, [item]));
        });
      } else {
        rows.push(createRow(groupKey, items));
      }
    });

    return rows.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }, [leadHistoryData, leadEventMap]);

  const filteredRows = useMemo(() => {
    return groupedRows.filter((row) => {
      if (
        appliedFilters.eventTypeList &&
        !appliedFilters.eventTypeList.some((type) =>
          row.items.some((item) => item.eventType === type),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.leadEventIdList &&
        !appliedFilters.leadEventIdList.some((id) =>
          row.items.some((item) => item.leadEventId === id),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.leadEventTypeList &&
        !appliedFilters.leadEventTypeList.some((type) =>
          row.items.some((item) => item.leadEventType === type),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.nameList &&
        !appliedFilters.nameList.some((name) =>
          row.items.some((item) => item.name === name),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.phoneNumList &&
        !appliedFilters.phoneNumList.some((phone) =>
          row.items.some((item) => item.phoneNum?.trim() === phone),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, groupedRows]);

  const columns = useMemo<ColumnDef<LeadHistoryGroupRow>[]>(
    () => [
      {
        accessorKey: 'displayPhoneNum',
        header: '전화번호',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => formatNullableText(row.original.displayPhoneNum),
      },
      {
        accessorKey: 'name',
        header: '이름',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
        cell: ({ row }) => formatNullableText(row.original.name),
      },
      {
        accessorKey: 'email',
        header: '이메일',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
        cell: ({ row }) => formatNullableText(row.original.email),
      },
      {
        accessorKey: 'latestEventType',
        header: '최신 이벤트 유형',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => {
          const value = row.original.latestEventType;
          return value ? leadHistoryEventTypeLabels[value] : '-';
        },
      },
      {
        accessorKey: 'latestEventTitle',
        header: '최신 이벤트',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
        cell: ({ row }) => formatNullableText(row.original.latestEventTitle),
      },
      {
        accessorKey: 'latestCreateDate',
        header: '최신 유입일자',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => {
          const value = row.original.latestCreateDate;
          return value ? dayjs(value).format('YYYY/MM/DD') : '-';
        },
      },
      {
        accessorKey: 'firstInflowDate',
        header: '첫 유입일자',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => {
          const value = row.original.firstInflowDate;
          return value ? dayjs(value).format('YYYY/MM/DD') : '-';
        },
      },
      {
        accessorKey: 'inflow',
        header: '첫 유입 경로',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => formatNullableText(row.original.inflow),
      },
      {
        accessorKey: 'totalActions',
        header: '전체 행동 횟수',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => row.original.totalActions ?? '-',
      },
      {
        accessorKey: 'programCount',
        header: '프로그램 참여 수',
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'min-w-[180px]',
        },
        cell: ({ row }) => row.original.programCount ?? '-',
      },
      {
        accessorKey: 'programHistory',
        header: '프로그램 참여 이력',
        enableSorting: false,
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName:
            'min-w-[220px]',
        },
        cell: ({ row }) => {
          const value = row.original.programHistory;
          if (!Array.isArray(value) || value.length === 0) {
            return <span>-</span>;
          }

          return (
            <div className="max-h-32 overflow-y-auto whitespace-normal text-[11px] leading-tight">
              {value.slice(0, 5).map((item, idx) => (
                <div key={`${item.date}-${idx}`}>
                  {item.date ? dayjs(item.date).format('YY/MM/DD') : '—'}
                  {item.title ? ` - ${item.title}` : ''}
                </div>
              ))}
              {value.length > 5 && <div>외 {value.length - 5}건</div>}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalFinalPrice',
        header: '총 결제 금액',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => {
          const value = row.original.totalFinalPrice;
          return typeof value === 'number'
            ? new Intl.NumberFormat('ko-KR').format(value)
            : '-';
        },
      },
      {
        accessorKey: 'university',
        header: '대학',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) => formatNullableText(row.original.university),
      },
      {
        accessorKey: 'major',
        header: '전공',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) => formatNullableText(row.original.major),
      },
      {
        accessorKey: 'wishField',
        header: '희망 분야',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) => formatNullableText(row.original.wishField),
      },
      {
        accessorKey: 'wishCompany',
        header: '희망 회사',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) => formatNullableText(row.original.wishCompany),
      },
      {
        accessorKey: 'wishIndustry',
        header: '희망 산업군',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => formatNullableText(row.original.wishIndustry),
      },
      {
        accessorKey: 'wishJob',
        header: '희망 직무',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) => formatNullableText(row.original.wishJob),
      },
      {
        accessorKey: 'jobStatus',
        header: '현 직무 상태',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => formatNullableText(row.original.jobStatus),
      },
      {
        accessorKey: 'instagramId',
        header: '인스타그램',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) => formatNullableText(row.original.instagramId),
      },
    ],
    [],
  );

  const createLeadHistory = useCreateLeadHistoryMutation();

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const eventTypes = formData
      .getAll('eventTypes')
      .filter(Boolean) as string[];
    const leadEventIds = (formData.get('leadEventIds') as string | null) ?? '';
    const leadEventTypes =
      (formData.get('leadEventTypes') as string | null) ?? '';
    const names = (formData.get('names') as string | null) ?? '';
    const phoneNums = (formData.get('phoneNums') as string | null) ?? '';

    const nextParams = new URLSearchParams();

    if (eventTypes.length) {
      const uniqueEventTypes = Array.from(new Set(eventTypes));
      nextParams.set('eventTypes', uniqueEventTypes.join(','));
    }

    const setSearchParam = (key: string, value: string) => {
      if (value.trim().length) {
        nextParams.set(key, value.trim());
      }
    };

    setSearchParam('leadEventIds', leadEventIds);
    setSearchParam('leadEventTypes', leadEventTypes);
    setSearchParam('names', names);
    setSearchParam('phoneNums', phoneNums);

    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname;
    router.replace(nextUrl);
  };

  const handleFilterReset = () => {
    router.replace(pathname);
  };

  const handleDownloadCsv = useCallback(() => {
    if (!filteredRows.length) {
      snackbar('다운로드할 데이터가 없습니다.');
      return;
    }

    const headers = [
      '전화번호',
      '이름',
      '이메일',
      '최신 이벤트 유형',
      '최신 이벤트',
      '최신 유입일자',
      '첫 유입일자',
      '첫 유입 경로',
      '프로그램 참여 수',
      '프로그램 참여 이력',
      '전체 행동 횟수',
      '총 결제 금액',
      '대학',
      '전공',
      '희망 분야',
      '희망 회사',
      '희망 산업군',
      '희망 직무',
      '현 직무 상태',
      '인스타그램 ID',
    ];

    const rows = filteredRows.map((row) => [
      row.displayPhoneNum ?? '',
      row.name ?? '',
      row.email ?? '',
      row.latestEventType
        ? leadHistoryEventTypeLabels[row.latestEventType]
        : '',
      row.latestEventTitle ?? '',
      row.latestCreateDate
        ? dayjs(row.latestCreateDate).format('YYYY/MM/DD')
        : '',
      row.firstInflowDate
        ? dayjs(row.firstInflowDate).format('YYYY/MM/DD')
        : '',
      row.inflow ?? '',
      String(row.programCount ?? ''),
      row.programHistory
        .map((item) =>
          [
            item.date ? dayjs(item.date).format('YY/MM/DD') : '',
            item.title ?? '',
          ]
            .filter(Boolean)
            .join(' - '),
        )
        .join(' | '),
      String(row.totalActions ?? ''),
      String(row.totalFinalPrice ?? ''),
      row.university ?? '',
      row.major ?? '',
      row.wishField ?? '',
      row.wishCompany ?? '',
      row.wishIndustry ?? '',
      row.wishJob ?? '',
      row.jobStatus ?? '',
      row.instagramId ?? '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-history-${dayjs().format('YYYYMMDDHHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredRows, snackbar]);

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
        className="rounded mb-4 flex flex-col gap-4 bg-neutral-90 p-4"
        onSubmit={handleFilterSubmit}
      >
        <div className="flex flex-wrap gap-4">
          {(
            Object.keys(leadHistoryEventTypeLabels) as LeadHistoryEventType[]
          ).map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  name="eventTypes"
                  value={type}
                  defaultChecked={defaultFormValues.eventTypes.includes(type)}
                />
              }
              label={leadHistoryEventTypeLabels[type]}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="리드 이벤트 ID"
            name="leadEventIds"
            defaultValue={defaultFormValues.leadEventIds}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="리드 이벤트 타입"
            name="leadEventTypes"
            defaultValue={defaultFormValues.leadEventTypes}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="이름"
            name="names"
            defaultValue={defaultFormValues.names}
            placeholder="쉼표(,) 또는 줄바꿈으로 다중 입력"
          />
          <TextField
            label="전화번호"
            name="phoneNums"
            defaultValue={defaultFormValues.phoneNums}
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
            전화번호 기준으로 리드가 그룹화되어 표기됩니다. 여러 값을 입력할
            경우 쉼표(,) 또는 줄바꿈으로 구분해주세요.
          </Typography>
        </div>
      </form>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Typography className="text-xsmall14 text-neutral-500">
          전체 행동 횟수·프로그램 참여 수·총 결제 금액이 전화번호 단위로
          집계되어 노출됩니다.
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={handleDownloadCsv}
            disabled={!filteredRows.length}
          >
            CSV 다운로드
          </Button>
          <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
            리드 등록
          </Button>
        </div>
      </div>

      <LeadHistoryTable
        data={filteredRows}
        columns={columns}
        isLoading={isLoading}
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
