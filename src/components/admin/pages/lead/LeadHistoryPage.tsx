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
import { ChangeEvent, memo, type ReactNode, useMemo, useState } from 'react';

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
            <thead className="bg-neutral-100">
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

  const { data: leadHistoryData = [], isLoading } = useLeadHistoryListQuery();

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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Typography className="text-xsmall14 text-neutral-500">
          전화번호별 그룹이 기본으로 확장되어 개별 리드 히스토리를 바로 확인할
          수 있습니다.
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" disabled={!rows.length}>
            CSV 다운로드
          </Button>
          <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
            리드 등록
          </Button>
        </div>
      </div>

      <LeadHistoryTable data={rows} columns={columns} isLoading={isLoading} />

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
