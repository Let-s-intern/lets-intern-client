'use client';

import {
  CreateLeadHistoryRequest,
  LeadEvent,
  LeadHistoryEventType,
  useCreateLeadHistoryMutation,
  useLeadEventListQuery,
  useLeadHistoryListQuery,
} from '@/api/lead';
import Heading from '@/components/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  GroupingState,
  type Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

const leadHistoryEventTypeLabels: Record<LeadHistoryEventType, string> = {
  SIGN_UP: '회원가입',
  PROGRAM: '프로그램 참여',
  LEAD_EVENT: '리드 이벤트',
};

const eventTypeOptions: Array<{ value: LeadHistoryEventType; label: string }> =
  (
    Object.entries(leadHistoryEventTypeLabels) as Array<
      [LeadHistoryEventType, string]
    >
  ).map(([value, label]) => ({ value, label }));

type LeadHistoryRow = {
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
  eventType?: LeadHistoryEventType;
  leadEventId?: number | null;
  leadEventType?: string | null;
  userId?: number | null;
  title?: string | null;
  finalPrice?: number | null;
  createDate?: string | null;
};

const FILTER_QUERY_KEY = 'filters';

type LeadHistoryFilterField = 'leadEvent' | 'program' | 'eventType';
type LeadHistoryFilterOperator = 'include' | 'exclude';
type LeadHistoryFilterCombinator = 'AND' | 'OR';

type LeadHistoryFilterCondition = {
  id: string;
  field: LeadHistoryFilterField;
  operator: LeadHistoryFilterOperator;
  values: string[];
  combinator: LeadHistoryFilterCombinator;
};

type StoredLeadHistoryFilterCondition = Omit<LeadHistoryFilterCondition, 'id'>;

type LeadHistoryGroupSummary = {
  rows: LeadHistoryRow[];
  leadEventIds: Set<string>;
  eventTypes: Set<LeadHistoryEventType>;
  programTitles: Set<string>;
};

const filterFieldDefinitions: Record<
  LeadHistoryFilterField,
  { label: string; valueLabel: string }
> = {
  leadEvent: { label: '리드 이벤트', valueLabel: '이벤트 선택' },
  program: { label: '프로그램', valueLabel: '프로그램 선택' },
  eventType: { label: '이벤트 유형', valueLabel: '이벤트 유형 선택' },
};

const filterOperatorOptions: Array<{
  value: LeadHistoryFilterOperator;
  label: string;
}> = [
  { value: 'include', label: '하나라도 있음' },
  { value: 'exclude', label: '하나도 없음' },
];

const generateFilterId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `filter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const isFilterField = (value: unknown): value is LeadHistoryFilterField => {
  return value === 'leadEvent' || value === 'program' || value === 'eventType';
};

const isFilterOperator = (
  value: unknown,
): value is LeadHistoryFilterOperator => {
  return value === 'include' || value === 'exclude';
};

const isFilterCombinator = (
  value: unknown,
): value is LeadHistoryFilterCombinator => {
  return value === 'AND' || value === 'OR';
};

const serializeFilterConditions = (
  filters: LeadHistoryFilterCondition[],
): string | undefined => {
  if (!filters.length) {
    return undefined;
  }

  const stored: StoredLeadHistoryFilterCondition[] = filters.map(
    ({ id: _id, ...rest }, index) => ({
      ...rest,
      combinator: index === 0 ? 'AND' : rest.combinator,
    }),
  );

  return JSON.stringify(stored);
};

const deserializeFilterConditions = (
  raw: string | null,
): LeadHistoryFilterCondition[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const deserialized: LeadHistoryFilterCondition[] = parsed
      .map((item, index) => {
        if (typeof item !== 'object' || item === null) {
          return null;
        }

        const { field, operator, values, combinator } =
          item as StoredLeadHistoryFilterCondition;

        if (!isFilterField(field) || !isFilterOperator(operator)) {
          return null;
        }

        const normalizedValues = Array.isArray(values)
          ? values.map((value) => String(value))
          : [];

        const normalizedCombinator =
          index === 0 || !isFilterCombinator(combinator) ? 'AND' : combinator;

        return {
          id: generateFilterId(),
          field,
          operator,
          values: normalizedValues,
          combinator: normalizedCombinator,
        };
      })
      .filter((item): item is LeadHistoryFilterCondition => item !== null);

    return deserialized;
  } catch {
    return [];
  }
};

const areFilterConditionsEqual = (
  current: LeadHistoryFilterCondition[],
  next: LeadHistoryFilterCondition[],
): boolean => {
  if (current.length !== next.length) {
    return false;
  }

  return current.every((condition, index) => {
    const target = next[index];
    if (!target) {
      return false;
    }

    if (
      condition.field !== target.field ||
      condition.operator !== target.operator ||
      condition.combinator !== target.combinator
    ) {
      return false;
    }

    if (condition.values.length !== target.values.length) {
      return false;
    }

    return condition.values.every(
      (value, valueIndex) => value === target.values[valueIndex],
    );
  });
};

const evaluateConditionAgainstSummary = (
  summary: LeadHistoryGroupSummary,
  condition: LeadHistoryFilterCondition,
): boolean => {
  if (!condition.values.length) {
    return true;
  }

  switch (condition.field) {
    case 'leadEvent': {
      const hasAny = condition.values.some((value) =>
        summary.leadEventIds.has(String(value)),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'program': {
      const hasAny = condition.values.some((value) =>
        summary.programTitles.has(String(value)),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'eventType': {
      const hasAny = condition.values.some((value) =>
        summary.eventTypes.has(value as LeadHistoryEventType),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    default:
      return true;
  }
};

const renderGroupedLeaf = (
  row: Row<LeadHistoryRow>,
  render: (original: LeadHistoryRow) => ReactNode,
) => {
  if (row.getIsGrouped()) {
    return <span className="text-neutral-400"></span>;
  }
  const original = row.original;
  if (!original) {
    return null;
  }
  return render(original);
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

const LeadHistoryTable = memo(
  ({
    data,
    columns,
    isLoading,
  }: {
    data: LeadHistoryRow[];
    columns: ColumnDef<LeadHistoryRow>[];
    isLoading: boolean;
  }) => {
    const [sorting, setSorting] = useState<SortingState>([
      { id: 'createDate', desc: true },
    ]);
    const [grouping] = useState<GroupingState>(['displayPhoneNum']);
    const [expanded, setExpanded] = useState<ExpandedState>(true);

    const table = useReactTable({
      data,
      columns,
      state: { sorting, grouping, expanded },
      onSortingChange: setSorting,
      onExpandedChange: setExpanded,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getRowId: (row) => row.id,
    });

    const columnCount = table.getAllLeafColumns().length || columns.length || 1;

    return (
      <div className="rounded border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => {
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
                        style={{
                          ...(i === 0
                            ? {
                                position: 'sticky',
                                left: 0,
                                background: '#fff',
                                zIndex: 1,
                              }
                            : // : i === 1
                              //   ? {
                              //       position: 'sticky',
                              //       left: 200,
                              //       background: '#fff',
                              //       borderRight: '1px solid #ddd',
                              //       zIndex: 2,
                              //     }
                              {}),
                        }}
                      >
                        <button
                          type="button"
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          className={`flex items-center gap-1 ${canSort ? 'cursor-pointer select-none' : 'cursor-default'}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' && (
                            <span
                              aria-hidden
                              className="text-[10px] leading-none"
                            >
                              ▲
                            </span>
                          )}
                          {sorted === 'desc' && (
                            <span
                              aria-hidden
                              className="text-[10px] leading-none"
                            >
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
                    className={twMerge(
                      'border-t border-neutral-100',
                      !row.getIsGrouped() && 'bg-slate-50',
                      row.getIsGrouped() && 'font-medium',
                    )}
                  >
                    {row.getVisibleCells().map((cell, i) => {
                      const cellClassName =
                        cell.column.columnDef.meta?.cellClassName ?? '';

                      return (
                        <td
                          key={cell.id}
                          className={`px-3 py-2 align-top text-neutral-900 ${cellClassName}`}
                          style={{
                            padding: '8px',
                            borderBottom: '1px solid #eee',
                            // 첫 번째 컬럼 고정
                            ...(i === 0
                              ? {
                                  position: 'sticky',
                                  left: 0,
                                  background: '#fff',
                                  zIndex: 1,
                                }
                              : // : i === 1
                                //   ? {
                                //       position: 'sticky',
                                //       left: 200,
                                //       background: '#fff',
                                //       borderRight: '1px solid #ddd',
                                //       zIndex: 2,
                                //     }
                                {}),
                          }}
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { snackbar } = useAdminSnackbar();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<LeadHistoryFilterCondition[]>(() =>
    deserializeFilterConditions(searchParams.get(FILTER_QUERY_KEY)),
  );

  const { data: leadHistoryData = [], isLoading } = useLeadHistoryListQuery();

  const leadEventListParams = useMemo(
    () => ({
      pageable: { page: 1, size: 1000 },
    }),
    [],
  );
  const { data: leadEventData } = useLeadEventListQuery(leadEventListParams);

  useEffect(() => {
    const parsed = deserializeFilterConditions(
      searchParams.get(FILTER_QUERY_KEY),
    );
    setFilters((prev) =>
      areFilterConditionsEqual(prev, parsed) ? prev : parsed,
    );
  }, [searchParams]);

  useEffect(() => {
    const serialized = serializeFilterConditions(filters);
    const currentSerialized = searchParams.get(FILTER_QUERY_KEY) ?? undefined;
    if (
      serialized === currentSerialized ||
      (!serialized && !currentSerialized)
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (serialized) {
      params.set(FILTER_QUERY_KEY, serialized);
    } else {
      params.delete(FILTER_QUERY_KEY);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [filters, pathname, router, searchParams]);

  const leadEventMap = useMemo(() => {
    const map = new Map<number, string>();
    leadEventData?.leadEventList.forEach((event) => {
      map.set(event.leadEventId, event.title ?? '');
    });
    return map;
  }, [leadEventData]);

  const allRows = useMemo<LeadHistoryRow[]>(() => {
    if (!leadHistoryData.length) return [];

    return leadHistoryData.map((item, index) => {
      const trimmedPhone = item.phoneNum?.trim() ?? null;
      const displayPhoneNum =
        trimmedPhone ??
        (item.userId !== null && item.userId !== undefined
          ? `회원 #${item.userId}`
          : '미등록');

      const leadEventTitle =
        item.title ??
        (item.leadEventId !== null && item.leadEventId !== undefined
          ? (leadEventMap.get(item.leadEventId) ?? null)
          : null);

      const rowId = [
        trimmedPhone ?? 'NO_PHONE',
        item.leadEventId ?? 'NO_EVENT',
        item.createDate ?? index,
      ].join('_');

      return {
        id: rowId,
        phoneNum: trimmedPhone,
        displayPhoneNum,
        name: item.name ?? null,
        email: item.email ?? null,
        inflow: item.inflow ?? null,
        firstInflowDate: item.createDate ?? null,
        university: item.university ?? null,
        major: item.major ?? null,
        wishField: item.wishField ?? null,
        wishCompany: item.wishCompany ?? null,
        wishIndustry: item.wishIndustry ?? null,
        wishJob: item.wishJob ?? null,
        jobStatus: item.jobStatus ?? null,
        instagramId: item.instagramId ?? null,
        eventType: item.eventType,
        leadEventId: item.leadEventId ?? null,
        leadEventType: item.leadEventType ?? null,
        userId: item.userId ?? null,
        title: leadEventTitle,
        finalPrice: item.finalPrice ?? null,
        createDate: item.createDate ?? null,
      };
    });
  }, [leadHistoryData, leadEventMap]);

  const leadEventOptions = useMemo(
    () =>
      (leadEventData?.leadEventList ?? []).map((event) => ({
        value: String(event.leadEventId),
        label: event.title ?? `#${event.leadEventId}`,
      })),
    [leadEventData],
  );

  const leadEventLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    leadEventOptions.forEach(({ value, label }) => {
      map.set(value, label);
    });
    return map;
  }, [leadEventOptions]);

  const programOptions = useMemo(() => {
    const unique = new Set<string>();
    allRows.forEach((row) => {
      if (row.eventType === 'PROGRAM' && row.title) {
        unique.add(row.title);
      }
    });
    return Array.from(unique)
      .sort((a, b) => a.localeCompare(b))
      .map((title) => ({
        value: title,
        label: title,
      }));
  }, [allRows]);

  const groupSummaryMap = useMemo(() => {
    const map = new Map<string, LeadHistoryGroupSummary>();
    allRows.forEach((row) => {
      const key = row.displayPhoneNum;
      const summary = map.get(key) ?? {
        rows: [],
        leadEventIds: new Set<string>(),
        eventTypes: new Set<LeadHistoryEventType>(),
        programTitles: new Set<string>(),
      };

      summary.rows.push(row);

      if (row.leadEventId !== null && row.leadEventId !== undefined) {
        summary.leadEventIds.add(String(row.leadEventId));
      }

      if (row.eventType) {
        summary.eventTypes.add(row.eventType);
      }

      if (row.eventType === 'PROGRAM' && row.title) {
        summary.programTitles.add(row.title);
      }

      map.set(key, summary);
    });
    return map;
  }, [allRows]);

  const activeFilters = useMemo(() => {
    const nonEmpty = filters.filter((condition) => condition.values.length > 0);
    if (!nonEmpty.length) {
      return [];
    }
    return nonEmpty.map((condition, index) => ({
      ...condition,
      combinator: index === 0 ? 'AND' : condition.combinator,
    }));
  }, [filters]);

  const filteredRows = useMemo(() => {
    if (!activeFilters.length) {
      return allRows;
    }

    const allowed = new Set<string>();

    groupSummaryMap.forEach((summary, key) => {
      let match = true;

      activeFilters.forEach((condition, index) => {
        const conditionResult = evaluateConditionAgainstSummary(
          summary,
          condition,
        );

        if (index === 0) {
          match = conditionResult;
          return;
        }

        match =
          condition.combinator === 'AND'
            ? match && conditionResult
            : match || conditionResult;
      });

      if (match) {
        allowed.add(key);
      }
    });

    if (!allowed.size) {
      return [];
    }

    return allRows.filter((row) => allowed.has(row.displayPhoneNum));
  }, [activeFilters, allRows, groupSummaryMap]);

  const handleAddCondition = useCallback(() => {
    setFilters((prev) => [
      ...prev,
      {
        id: generateFilterId(),
        field: 'leadEvent',
        operator: 'include',
        values: [],
        combinator: 'AND',
      },
    ]);
  }, []);

  const handleUpdateCondition = useCallback(
    (id: string, updates: Partial<Omit<LeadHistoryFilterCondition, 'id'>>) => {
      setFilters((prev) =>
        prev.map((condition, index) => {
          if (condition.id !== id) {
            return condition;
          }

          const nextCondition: LeadHistoryFilterCondition = { ...condition };

          if (updates.field && updates.field !== condition.field) {
            nextCondition.field = updates.field;
            nextCondition.values = [];
          } else if (updates.field) {
            nextCondition.field = updates.field;
          }

          if (updates.operator) {
            nextCondition.operator = updates.operator;
          }

          if ('values' in updates && updates.values !== undefined) {
            nextCondition.values = updates.values;
          }

          if (index === 0) {
            nextCondition.combinator = 'AND';
          } else if (updates.combinator) {
            nextCondition.combinator = updates.combinator;
          }

          return nextCondition;
        }),
      );
    },
    [],
  );

  const handleRemoveCondition = useCallback((id: string) => {
    setFilters((prev) => {
      const next = prev.filter((condition) => condition.id !== id);
      if (next.length > 0) {
        next[0] = { ...next[0], combinator: 'AND' };
      }
      return next;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const getValueLabel = useCallback(
    (field: LeadHistoryFilterField, value: string) => {
      if (field === 'leadEvent') {
        return leadEventLabelMap.get(value) ?? value;
      }
      if (field === 'program') {
        return value;
      }
      if (field === 'eventType') {
        return (
          leadHistoryEventTypeLabels[value as LeadHistoryEventType] ?? value
        );
      }
      return value;
    },
    [leadEventLabelMap],
  );

  const filteredGroupCount = useMemo(() => {
    if (!filteredRows.length) {
      return 0;
    }
    const groups = new Set<string>();
    filteredRows.forEach((row) => {
      groups.add(row.displayPhoneNum);
    });
    return groups.size;
  }, [filteredRows]);

  const totalGroupCount = groupSummaryMap.size;

  const columns = useMemo<ColumnDef<LeadHistoryRow>[]>(
    () => [
      {
        accessorKey: 'displayPhoneNum',
        header: '전화번호',
        enableGrouping: true,
        groupedColumnMode: 'remove',
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'min-w-[200px]',
        },
        cell: ({ row, getValue }) => {
          const value = formatNullableText(getValue());
          if (row.getIsGrouped()) {
            const count = row.subRows?.length ?? 0;
            return (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={row.getToggleExpandedHandler()}
                  className="rounded flex h-6 w-6 items-center justify-center border border-neutral-200 text-[10px] leading-none text-neutral-600"
                  aria-label={
                    row.getIsExpanded()
                      ? '전화번호 그룹 접기'
                      : '전화번호 그룹 펼치기'
                  }
                >
                  {row.getIsExpanded() ? '-' : '+'}
                </button>
                <span>{value}</span>
                <span className="text-xs text-neutral-400">({count}건)</span>
              </div>
            );
          }
          return value;
        },
      },
      {
        accessorKey: 'name',
        header: '이름',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
        aggregationFn: 'unique',
      },

      {
        accessorKey: 'email',
        header: '이메일',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
      },
      {
        accessorKey: 'eventType',
        header: '이벤트 유형',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) => {
            const value = original.eventType;
            return value ? leadHistoryEventTypeLabels[value] : '-';
          }),
      },
      {
        accessorKey: 'title',
        header: '이벤트 제목',
        meta: {
          headerClassName: 'min-w-[220px]',
          cellClassName: 'min-w-[220px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.title),
          ),
      },
      {
        accessorKey: 'leadEventId',
        header: '리드 이벤트 ID',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.leadEventId),
          ),
      },
      {
        accessorKey: 'leadEventType',
        header: '리드 이벤트 타입',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.leadEventType),
          ),
      },
      {
        accessorKey: 'userId',
        header: '회원 ID',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'min-w-[120px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.userId),
          ),
      },
      {
        accessorKey: 'createDate',
        header: '유입일시',
        meta: {
          headerClassName: 'min-w-[170px]',
          cellClassName: 'min-w-[170px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) => {
            const value = original.createDate;
            return value ? dayjs(value).format('YYYY.MM.DD.') : '-';
          }),
      },
      {
        accessorKey: 'firstInflowDate',
        header: '첫 유입일자',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) => {
            const value = original.firstInflowDate;
            return value ? dayjs(value).format('YYYY.MM.DD.') : '-';
          }),
      },
      {
        accessorKey: 'inflow',
        header: '유입 경로',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.inflow),
          ),
      },
      {
        accessorKey: 'university',
        header: '대학',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.university),
          ),
      },
      {
        accessorKey: 'major',
        header: '전공',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.major),
          ),
      },
      {
        accessorKey: 'wishField',
        header: '희망 분야',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.wishField),
          ),
      },
      {
        accessorKey: 'wishCompany',
        header: '희망 회사',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.wishCompany),
          ),
      },
      {
        accessorKey: 'wishIndustry',
        header: '희망 산업군',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.wishIndustry),
          ),
      },
      {
        accessorKey: 'wishJob',
        header: '희망 직무',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.wishJob),
          ),
      },
      {
        accessorKey: 'jobStatus',
        header: '현 직무 상태',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'min-w-[150px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.jobStatus),
          ),
      },
      {
        accessorKey: 'instagramId',
        header: '인스타그램 ID',
        meta: {
          headerClassName: 'min-w-[160px]',
          cellClassName: 'min-w-[160px]',
        },
        cell: ({ row }) =>
          renderGroupedLeaf(row, (original) =>
            formatNullableText(original.instagramId),
          ),
      },
      {
        accessorKey: 'finalPrice',
        header: '결제 금액',
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'min-w-[140px]',
        },
        // cell: ({ row, getValue }) =>

        cell: (info) => {
          const v = info.getValue<number>()
            ? new Intl.NumberFormat('ko-KR').format(info.getValue<number>())
            : '-';
          if (info.row.getIsGrouped()) {
            return <strong>{v}</strong>;
          }
          return v;
        },

        aggregationFn: 'sum',
      },
    ],
    [],
  );

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

      <div className="rounded mb-4 border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <Typography className="text-sm font-medium text-neutral-700">
              전화번호 그룹 필터
            </Typography>
            <Typography className="text-xs text-neutral-500">
              조건을 AND/OR로 조합해 특정 이벤트·프로그램 참여 이력을 기반으로
              전화번호 그룹을 필터링합니다.
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="text"
              onClick={handleResetFilters}
              disabled={!filters.length}
            >
              조건 초기화
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleAddCondition}
            >
              조건 추가
            </Button>
          </div>
        </div>

        {filters.length === 0 ? (
          <Typography className="rounded border border-dashed border-neutral-200 p-3 text-xs text-neutral-500">
            추가된 필터 조건이 없습니다. &ldquo;조건 추가&rdquo; 버튼을 눌러
            조건을 구성하세요.
          </Typography>
        ) : (
          <div className="flex flex-col gap-3">
            {filters.map((condition, index) => {
              const valueOptions =
                condition.field === 'leadEvent'
                  ? leadEventOptions
                  : condition.field === 'program'
                    ? programOptions
                    : eventTypeOptions;

              return (
                <div
                  key={condition.id}
                  className="rounded flex w-full flex-wrap items-end gap-2 border border-neutral-200 bg-gray-50 p-3"
                >
                  {index > 0 && (
                    <TextField
                      select
                      size="small"
                      label="연결"
                      value={condition.combinator}
                      onChange={(event) =>
                        handleUpdateCondition(condition.id, {
                          combinator: event.target
                            .value as LeadHistoryFilterCombinator,
                        })
                      }
                      className="w-20 min-w-[80px]"
                    >
                      <MenuItem value="AND">AND</MenuItem>
                      <MenuItem value="OR">OR</MenuItem>
                    </TextField>
                  )}
                  <TextField
                    select
                    size="small"
                    label="대상"
                    value={condition.field}
                    onChange={(event) =>
                      handleUpdateCondition(condition.id, {
                        field: event.target.value as LeadHistoryFilterField,
                      })
                    }
                    className="min-w-[160px]"
                  >
                    {Object.entries(filterFieldDefinitions).map(
                      ([value, { label }]) => (
                        <MenuItem
                          key={value}
                          value={value as LeadHistoryFilterField}
                        >
                          {label}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="조건"
                    value={condition.operator}
                    onChange={(event) =>
                      handleUpdateCondition(condition.id, {
                        operator: event.target
                          .value as LeadHistoryFilterOperator,
                      })
                    }
                    className="min-w-[140px]"
                  >
                    {filterOperatorOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label={filterFieldDefinitions[condition.field].valueLabel}
                    value={condition.values}
                    onChange={(event) => {
                      const { value } = event.target;
                      const nextValues = Array.isArray(value)
                        ? value.map((item) => String(item))
                        : [String(value)];
                      handleUpdateCondition(condition.id, {
                        values: nextValues,
                      });
                    }}
                    SelectProps={{
                      multiple: true,
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (
                          !selected ||
                          (Array.isArray(selected) && !selected.length)
                        ) {
                          return '';
                        }
                        const list = Array.isArray(selected)
                          ? selected
                          : [selected];
                        return list
                          .map((item) =>
                            getValueLabel(condition.field, String(item)),
                          )
                          .join(', ');
                      },
                    }}
                    className="min-w-[220px] flex-1"
                    disabled={!valueOptions.length}
                    helperText={
                      !valueOptions.length
                        ? '선택 가능한 항목이 없습니다.'
                        : undefined
                    }
                  >
                    {valueOptions.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() => handleRemoveCondition(condition.id)}
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 text-right text-xs text-neutral-500">
          조건에 맞는 전화번호 그룹 {filteredGroupCount}/{totalGroupCount}개 ·
          리드 {filteredRows.length}/{allRows.length}건
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Typography className="text-xsmall14 text-neutral-500">
          전화번호별 그룹이 기본으로 확장되어 개별 리드 히스토리를 바로 확인할
          수 있습니다.
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" disabled={!filteredRows.length}>
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
