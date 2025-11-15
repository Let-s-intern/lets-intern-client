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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccessorKeyColumnDef,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  type ReactNode,
  useCallback,
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

const membershipOptions: Array<{ value: string; label: string }> = [
  { value: 'signedUp', label: '회원가입' },
  { value: 'notSignedUp', label: '미가입' },
];

type LeadHistoryRow = {
  id: string;
  phoneNum: string | null;
  displayPhoneNum: string;
  name: string | null;
  email: string | null;
  inflow: string | null;
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

type LeadHistoryFilterField =
  | 'leadEvent'
  | 'program'
  | 'eventType'
  | 'membership';
type LeadHistoryFilterOperator = 'include' | 'exclude';
type LeadHistoryFilterCombinator = 'AND' | 'OR';

type LeadHistoryFilterConditionNode = {
  id: string;
  type: 'condition';
  field: LeadHistoryFilterField;
  operator: LeadHistoryFilterOperator;
  values: string[];
};

type LeadHistoryFilterGroupNode = {
  id: string;
  type: 'group';
  combinator: LeadHistoryFilterCombinator;
  children: LeadHistoryFilterNode[];
};

type LeadHistoryFilterNode =
  | LeadHistoryFilterGroupNode
  | LeadHistoryFilterConditionNode;

type StoredLeadHistoryFilterConditionNode = {
  type: 'condition';
  field: LeadHistoryFilterField;
  operator: LeadHistoryFilterOperator;
  values?: string[];
};

type StoredLeadHistoryFilterGroupNode = {
  type: 'group';
  combinator: LeadHistoryFilterCombinator;
  children?: StoredLeadHistoryFilterNode[];
};

type StoredLeadHistoryFilterNode =
  | StoredLeadHistoryFilterConditionNode
  | StoredLeadHistoryFilterGroupNode;

type LeadHistoryGroupSummary = {
  leadEventIds: Set<string>;
  eventTypes: Set<LeadHistoryEventType>;
  programTitles: Set<string>;
  hasSignedUp: boolean;
};

const filterFieldDefinitions: Record<
  LeadHistoryFilterField,
  { label: string; valueLabel: string }
> = {
  leadEvent: { label: '리드 이벤트', valueLabel: '이벤트 선택' },
  program: { label: '프로그램', valueLabel: '프로그램 선택' },
  eventType: { label: '이벤트 유형', valueLabel: '이벤트 유형 선택' },
  membership: { label: '회원가입 여부', valueLabel: '회원가입 여부 선택' },
};

const filterOperatorOptions: Array<{
  value: LeadHistoryFilterOperator;
  label: string;
}> = [
  { value: 'include', label: '하나라도 있음' },
  { value: 'exclude', label: '하나도 없음' },
];

const createConditionNode = (
  overrides: Partial<Omit<LeadHistoryFilterConditionNode, 'id' | 'type'>> = {},
): LeadHistoryFilterConditionNode => ({
  id: nanoid(),
  type: 'condition',
  field: overrides.field ?? 'leadEvent',
  operator: overrides.operator ?? 'include',
  values: overrides.values ?? [],
});

const createGroupNode = (
  overrides: Partial<Omit<LeadHistoryFilterGroupNode, 'id' | 'type'>> = {},
): LeadHistoryFilterGroupNode => ({
  id: nanoid(),
  type: 'group',
  combinator: overrides.combinator ?? 'AND',
  children: overrides.children ?? [],
});

const toStoredNode = (
  node: LeadHistoryFilterNode,
): StoredLeadHistoryFilterNode => {
  if (node.type === 'condition') {
    return {
      type: 'condition',
      field: node.field,
      operator: node.operator,
      values: node.values,
    };
  }

  return {
    type: 'group',
    combinator: node.combinator,
    children: node.children.map(toStoredNode),
  };
};

const fromStoredConditionNode = (
  node: StoredLeadHistoryFilterConditionNode,
): LeadHistoryFilterConditionNode => {
  return createConditionNode({
    field: node.field,
    operator: node.field === 'membership' ? 'include' : node.operator,
    values: node.values?.map((value) => String(value)) ?? [],
  });
};

const fromStoredGroupNode = (
  node: StoredLeadHistoryFilterGroupNode,
): LeadHistoryFilterGroupNode => {
  return createGroupNode({
    combinator: node.combinator,
    children:
      node.children?.map((child) =>
        child.type === 'condition'
          ? fromStoredConditionNode(child)
          : fromStoredGroupNode(child),
      ) ?? [],
  });
};

const serializeFilterTree = (
  root: LeadHistoryFilterGroupNode,
): string | undefined => {
  if (!root.children.length) {
    return undefined;
  }

  return JSON.stringify(toStoredNode(root));
};

const deserializeFilterTree = (
  raw: string | null,
): LeadHistoryFilterGroupNode => {
  if (!raw) {
    return createGroupNode();
  }

  const parsed = JSON.parse(raw) as StoredLeadHistoryFilterGroupNode;
  return fromStoredGroupNode(parsed);
};

const getFilterTreeSignature = (root: LeadHistoryFilterGroupNode) => {
  return serializeFilterTree(root) ?? '';
};

const hasConditionWithValues = (node: LeadHistoryFilterNode): boolean => {
  if (node.type === 'condition') {
    return node.values.length > 0;
  }

  return node.children.some((child) => hasConditionWithValues(child));
};

const evaluateConditionNode = (
  summary: LeadHistoryGroupSummary,
  condition: LeadHistoryFilterConditionNode,
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
    case 'membership': {
      const status = summary.hasSignedUp ? 'signedUp' : 'notSignedUp';
      const hasAny = condition.values.some((value) => value === status);
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    default:
      return true;
  }
};

const evaluateFilterNode = (
  summary: LeadHistoryGroupSummary,
  node: LeadHistoryFilterNode,
): boolean => {
  if (node.type === 'condition') {
    return evaluateConditionNode(summary, node);
  }

  if (!node.children.length) {
    return true;
  }

  if (node.combinator === 'AND') {
    return node.children.every((child) => evaluateFilterNode(summary, child));
  }

  return node.children.some((child) => evaluateFilterNode(summary, child));
};

const updateFilterNode = (
  node: LeadHistoryFilterNode,
  targetId: string,
  updater: (node: LeadHistoryFilterNode) => LeadHistoryFilterNode,
): LeadHistoryFilterNode => {
  if (node.id === targetId) {
    return updater(node);
  }

  if (node.type === 'group') {
    return {
      ...node,
      children: node.children.map((child) =>
        updateFilterNode(child, targetId, updater),
      ),
    };
  }

  return node;
};

const appendChildToGroup = (
  node: LeadHistoryFilterNode,
  targetGroupId: string,
  child: LeadHistoryFilterNode,
): LeadHistoryFilterNode => {
  if (node.id === targetGroupId && node.type === 'group') {
    return {
      ...node,
      children: [...node.children, child],
    };
  }

  if (node.type === 'group') {
    return {
      ...node,
      children: node.children.map((nested) =>
        appendChildToGroup(nested, targetGroupId, child),
      ),
    };
  }

  return node;
};

const removeFilterNode = (
  node: LeadHistoryFilterNode,
  targetId: string,
): LeadHistoryFilterNode | null => {
  if (node.id === targetId) {
    return null;
  }

  if (node.type !== 'group') {
    return node;
  }

  const nextChildren = node.children
    .map((child) => removeFilterNode(child, targetId))
    .filter((child): child is LeadHistoryFilterNode => child !== null);

  return {
    ...node,
    children: nextChildren,
  };
};

const renderGroupedLeaf = (
  row: Row<LeadHistoryRow>,
  render: (original: LeadHistoryRow) => ReactNode,
) => {
  if (row.getIsGrouped()) {
    return <span className="text-gray-400"></span>;
  }
  return render(row.original);
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

const VISIBLE_GROUP_LIMIT = 10;

const LeadHistoryTable = ({
  data,
  columns,
  isLoading,
}: {
  data: LeadHistoryRow[];
  columns: ColumnDef<LeadHistoryRow>[];
  isLoading: boolean;
}) => {
  const [grouping] = useState<GroupingState>(['displayPhoneNum']);
  const table = useReactTable({
    data,
    columns,
    state: { grouping, expanded: true },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetExpanded: false,
    getRowId: (row) => row.id,
  });

  const groupedRowModel = table.getGroupedRowModel();
  const totalGroupCount = groupedRowModel.rows.length;
  const displayedGroupCount =
    totalGroupCount === 0 ? 0 : Math.min(totalGroupCount, VISIBLE_GROUP_LIMIT);
  const remainingGroupCount = Math.max(
    totalGroupCount - displayedGroupCount,
    0,
  );
  const allRows = table.getRowModel().rows;
  const rowsToRender = useMemo(() => {
    if (!allRows.length) return allRows;
    const result: typeof allRows = [];
    let groupsSeen = 0;

    for (const row of allRows) {
      if (row.depth === 0) {
        groupsSeen += 1;
        if (groupsSeen > VISIBLE_GROUP_LIMIT) {
          break;
        }
      }
      result.push(row);
    }

    return result;
  }, [allRows]);

  const columnCount = table.getAllLeafColumns().length || columns.length || 1;

  return (
    <div className="rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  if (header.isPlaceholder) {
                    return <th key={header.id} className="px-3 py-2" />;
                  }

                  const headerClassName =
                    header.column.columnDef.meta?.headerClassName ?? '';

                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2 font-medium text-gray-700 ${headerClassName}`}
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
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
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
                  className="px-3 py-10 text-center text-gray-500"
                >
                  로딩 중...
                </td>
              </tr>
            ) : allRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rowsToRender.map((row) => (
                <tr
                  key={row.id}
                  className={twMerge(
                    'border-t border-gray-100',
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
                        className={`px-3 py-2 align-top text-gray-900 ${cellClassName}`}
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
      {!isLoading && remainingGroupCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          상위 {displayedGroupCount}개 전화번호 그룹만 표시됩니다. 외{' '}
          {remainingGroupCount}개는 CSV 다운로드로 확인하세요.
        </div>
      )}
      {!isLoading && remainingGroupCount === 0 && totalGroupCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-center text-[12px] text-gray-500">
          전화번호 그룹 {totalGroupCount}개를 모두 보여주고 있습니다.
        </div>
      )}
    </div>
  );
};

const CreateLeadHistoryDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  leadEvents,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadHistoryRequest) => Promise<void>;
  isSubmitting: boolean;
  leadEvents?: LeadEvent[];
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

    payload.userId = form.userId ? Number(form.userId) : undefined;

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
  const filterTree = useMemo<LeadHistoryFilterGroupNode>(
    () => deserializeFilterTree(searchParams.get(FILTER_QUERY_KEY)),
    [searchParams],
  );

  const { data: leadHistoryData = [], isLoading } = useLeadHistoryListQuery();

  const leadEventListParams = useMemo(
    () => ({
      pageable: { page: 1, size: 1000 },
    }),
    [],
  );
  const { data: leadEventData } = useLeadEventListQuery(leadEventListParams);

  const replaceFilterTree = useCallback(
    (nextTree: LeadHistoryFilterGroupNode) => {
      const currentSignature = getFilterTreeSignature(filterTree);
      const nextSignature = getFilterTreeSignature(nextTree);

      if (currentSignature === nextSignature) {
        // eslint-disable-next-line no-console
        console.log('[lead] No changes in filter tree, skipping URL update');
        return;
      }

      const serialized = serializeFilterTree(nextTree);
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
    },
    [filterTree, pathname, router, searchParams],
  );

  const updateFilterTree = useCallback(
    (
      updater: (
        current: LeadHistoryFilterGroupNode,
      ) => LeadHistoryFilterGroupNode,
    ) => {
      const baseTree = filterTree;
      const nextTree = updater(baseTree);
      replaceFilterTree(nextTree);
    },
    [filterTree, replaceFilterTree],
  );

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
        leadEventIds: new Set<string>(),
        eventTypes: new Set<LeadHistoryEventType>(),
        programTitles: new Set<string>(),
        hasSignedUp: false,
      };

      if (row.leadEventId !== null && row.leadEventId !== undefined) {
        summary.leadEventIds.add(String(row.leadEventId));
      }

      if (row.eventType) {
        summary.eventTypes.add(row.eventType);
      }

      if (row.eventType === 'PROGRAM' && row.title) {
        summary.programTitles.add(row.title);
      }

      if (row.userId !== null && row.userId !== undefined) {
        summary.hasSignedUp = true;
      }

      map.set(key, summary);
    });
    return map;
  }, [allRows]);

  const hasActiveFilter = useMemo(
    () => hasConditionWithValues(filterTree),
    [filterTree],
  );

  const filteredRows = useMemo(() => {
    if (!hasActiveFilter) {
      return allRows;
    }

    const allowed = new Set<string>();

    groupSummaryMap.forEach((summary, key) => {
      if (evaluateFilterNode(summary, filterTree)) {
        allowed.add(key);
      }
    });

    if (!allowed.size) {
      return [];
    }

    return allRows.filter((row) => allowed.has(row.displayPhoneNum));
  }, [allRows, filterTree, groupSummaryMap, hasActiveFilter]);

  const handleResetFilters = useCallback(() => {
    const nextTree = createGroupNode();
    replaceFilterTree(nextTree);
  }, [replaceFilterTree]);

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

  const handleAddCondition = useCallback(
    (groupId: string) => {
      updateFilterTree(
        (prev) =>
          appendChildToGroup(
            prev,
            groupId,
            createConditionNode(),
          ) as LeadHistoryFilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleAddGroup = useCallback(
    (groupId: string) => {
      updateFilterTree(
        (prev) =>
          appendChildToGroup(
            prev,
            groupId,
            createGroupNode(),
          ) as LeadHistoryFilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleUpdateGroupCombinator = useCallback(
    (groupId: string, combinator: LeadHistoryFilterCombinator) => {
      updateFilterTree(
        (prev) =>
          updateFilterNode(prev, groupId, (node) => {
            if (node.type !== 'group') {
              return node;
            }
            return {
              ...node,
              combinator,
            };
          }) as LeadHistoryFilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleUpdateCondition = useCallback(
    (
      conditionId: string,
      updates: Partial<Omit<LeadHistoryFilterConditionNode, 'id' | 'type'>>,
    ) => {
      updateFilterTree(
        (prev) =>
          updateFilterNode(prev, conditionId, (node) => {
            if (node.type !== 'condition') {
              return node;
            }

            let next: LeadHistoryFilterConditionNode = { ...node };

            if (updates.field && updates.field !== node.field) {
              next = {
                ...next,
                field: updates.field,
                values: [],
                operator:
                  updates.field === 'membership' ? 'include' : next.operator,
              };
            } else if (updates.field) {
              next = {
                ...next,
                field: updates.field,
              };
            }

            if (updates.operator && next.field !== 'membership') {
              next = {
                ...next,
                operator: updates.operator,
              };
            }

            if (updates.values) {
              next = {
                ...next,
                values: updates.values,
              };
            } else if (updates.values !== undefined) {
              next = {
                ...next,
                values: [],
              };
            }

            return next;
          }) as LeadHistoryFilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      updateFilterTree((prev) => {
        if (prev.id === nodeId) {
          return prev;
        }
        const next = removeFilterNode(prev, nodeId);
        if (!next || next.type !== 'group') {
          return prev;
        }
        return next;
      });
    },
    [updateFilterTree],
  );

  const rootHasChildren = filterTree.children.length > 0;

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
      if (field === 'membership') {
        const option = membershipOptions.find((item) => item.value === value);
        return option?.label ?? value;
      }
      return value;
    },
    [leadEventLabelMap],
  );

  const getOptionsForField = useCallback(
    (field: LeadHistoryFilterField) => {
      if (field === 'leadEvent') {
        return leadEventOptions;
      }
      if (field === 'program') {
        return programOptions;
      }
      if (field === 'membership') {
        return membershipOptions;
      }
      return eventTypeOptions;
    },
    [leadEventOptions, programOptions],
  );

  const FilterConditionEditor = ({
    node,
  }: {
    node: LeadHistoryFilterConditionNode;
  }) => {
    const valueOptions = getOptionsForField(node.field);

    return (
      <div className="rounded flex w-full flex-wrap items-end gap-2 border border-gray-200 bg-white px-2 py-2">
        <TextField
          select
          size="small"
          label="대상"
          value={node.field}
          onChange={(event) =>
            handleUpdateCondition(node.id, {
              field: event.target.value as LeadHistoryFilterField,
            })
          }
          className="min-w-[120px]"
        >
          {Object.entries(filterFieldDefinitions).map(([value, { label }]) => (
            <MenuItem key={value} value={value} className="text-xsmall14">
              {label}
            </MenuItem>
          ))}
        </TextField>
        {node.field !== 'membership' && (
          <TextField
            select
            size="small"
            label="조건"
            value={node.operator}
            onChange={(event) =>
              handleUpdateCondition(node.id, {
                operator: event.target.value as LeadHistoryFilterOperator,
              })
            }
            className="min-w-[120px]"
          >
            {filterOperatorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          size="small"
          fullWidth
          label={filterFieldDefinitions[node.field].valueLabel}
          value={node.values}
          onChange={(event) => {
            const { value } = event.target;
            const nextValues = Array.isArray(value)
              ? value.map((item) => String(item))
              : [String(value)];
            handleUpdateCondition(node.id, {
              values: nextValues,
            });
          }}
          slotProps={{
            select: {
              multiple: true,
              displayEmpty: true,
              renderValue: (selected) => {
                if (
                  !selected ||
                  (Array.isArray(selected) && selected.length === 0)
                ) {
                  return '';
                }

                const list = Array.isArray(selected) ? selected : [selected];
                const normalizedList = list.filter(
                  (item): item is string | number =>
                    item !== undefined &&
                    item !== null &&
                    String(item).length > 0,
                );

                if (!normalizedList.length) {
                  return '';
                }

                return (
                  <div className="flex flex-wrap gap-1">
                    {normalizedList.map((item) => (
                      <Chip
                        key={String(item)}
                        size="small"
                        label={getValueLabel(node.field, String(item))}
                      />
                    ))}
                  </div>
                );
              },
            },
          }}
          className="min-w-[200px] flex-1"
          disabled={!valueOptions.length}
          helperText={
            !valueOptions.length ? '선택 가능한 항목이 없습니다.' : undefined
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
          onClick={() => handleRemoveNode(node.id)}
        >
          삭제
        </Button>
      </div>
    );
  };

  const FilterGroupEditor = ({
    node,
    isRoot = false,
  }: {
    node: LeadHistoryFilterGroupNode;
    isRoot?: boolean;
  }) => {
    return (
      <div
        className={twMerge(
          'rounded flex flex-col gap-2 border border-gray-200 bg-gray-50 p-3',
          !isRoot && 'ml-4',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Typography className="text-[11px] font-medium text-gray-600">
            {isRoot ? '최상위 그룹' : '하위 그룹'}
          </Typography>
          <TextField
            select
            size="small"
            label="연결"
            value={node.combinator}
            onChange={(event) =>
              handleUpdateGroupCombinator(
                node.id,
                event.target.value as LeadHistoryFilterCombinator,
              )
            }
            className="w-24"
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </TextField>
          <div className="ml-auto flex items-center gap-1">
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAddCondition(node.id)}
            >
              <Plus size={12} className="mr-1" />
              조건
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAddGroup(node.id)}
            >
              <Plus size={12} className="mr-1" />
              그룹
            </Button>
            {!isRoot && (
              <Button
                size="small"
                color="error"
                variant="text"
                onClick={() => handleRemoveNode(node.id)}
              >
                삭제
              </Button>
            )}
          </div>
        </div>
        {node.children.length === 0 ? (
          <Typography className="rounded border border-dashed border-gray-200 bg-white px-2 py-2 text-[12px] text-gray-500">
            조건이 없습니다. 버튼을 눌러 조건 또는 하위 그룹을 추가하세요.
          </Typography>
        ) : (
          <div className="flex flex-col gap-2">
            {node.children.map((child) =>
              child.type === 'condition' ? (
                <FilterConditionEditor key={child.id} node={child} />
              ) : (
                <FilterGroupEditor key={child.id} node={child} />
              ),
            )}
          </div>
        )}
      </div>
    );
  };

  const columns = useMemo<AccessorKeyColumnDef<LeadHistoryRow>[]>(
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
                <span>{value}</span>
                <span className="text-xs text-gray-400">({count}건)</span>
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
        aggregationFn: (_, leafRows) => {
          const names = new Set<string>(
            leafRows
              .map((row) => row.original.name)
              .filter((name): name is string => !!name),
          );
          return Array.from(names).join(', ');
        },
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
        accessorKey: 'createDate',
        header: '생성일',
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

  const handleDownloadCsv = useCallback(() => {
    if (!filteredRows.length) {
      window.alert('다운로드할 리드 히스토리가 없습니다.');
      return;
    }

    const resolveHeaderLabel = (
      column: AccessorKeyColumnDef<LeadHistoryRow>,
    ) => {
      const headerProp = column.header;

      if (typeof headerProp === 'string' || typeof headerProp === 'number') {
        return String(headerProp);
      }
      if (typeof headerProp === 'function') {
        return column.id ?? column.accessorKey ?? '';
      }
      return column.id ?? column.accessorKey ?? '';
    };

    const sortedRows = [...filteredRows].sort((a, b) => {
      const phoneCompare = (a.displayPhoneNum ?? '').localeCompare(
        b.displayPhoneNum ?? '',
        undefined,
        { sensitivity: 'base' },
      );
      if (phoneCompare !== 0) {
        return phoneCompare;
      }
      return (a.createDate ?? '').localeCompare(b.createDate ?? '');
    });

    const headerRow = columns
      .map((column) => escapeCsvValue(resolveHeaderLabel(column)))
      .join(',');

    const formattedRows = sortedRows.map((row) => {
      return columns.map((column) => {
        const key = column.accessorKey as keyof LeadHistoryRow;

        switch (key) {
          case 'createDate':
            return row.createDate
              ? dayjs(row.createDate).format('YYYY.MM.DD.')
              : '';
          case 'eventType':
            return row.eventType
              ? leadHistoryEventTypeLabels[row.eventType]
              : '';
          case 'finalPrice':
            return row.finalPrice !== null && row.finalPrice !== undefined
              ? new Intl.NumberFormat('ko-KR').format(row.finalPrice)
              : '';
          default:
            return row[key] ?? '';
        }
      });
    });

    const rows = formattedRows.map((row) =>
      row.map((value) => escapeCsvValue(value)).join(','),
    );

    const csvBody = [headerRow, ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvBody}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `lead-history_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [columns, filteredRows]);

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

      <div className="rounded mb-4 border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Typography className="text-xs text-gray-600">
            AND/OR 트리를 구성해 특정 이벤트·프로그램 참여 이력 여부로 전화번호
            그룹을 필터링할 수 있습니다.
          </Typography>
          <div className="ml-auto flex gap-1">
            <Button
              size="small"
              variant="text"
              onClick={handleResetFilters}
              disabled={!rootHasChildren}
            >
              조건 초기화
            </Button>
          </div>
        </div>

        <FilterGroupEditor node={filterTree} isRoot />

        <div className="mt-2 text-right text-[12px] text-gray-500">
          조건에 맞는 전화번호 그룹 {filteredGroupCount}/{totalGroupCount}개 ·
          리드 {filteredRows.length}/{allRows.length}건
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={handleDownloadCsv}
            disabled={!filteredRows.length}
          >
            CSV 다운로드
          </Button>
          <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
            리드 히스토리 등록
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
      />
    </section>
  );
};

export default LeadHistoryPage;
