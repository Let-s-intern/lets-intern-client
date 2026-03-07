'use client';

import {
  LeadManagementUser,
  useLeadManagementListQuery,
} from '@/api/leadManagement';
import TableCell from '@/domain/admin/ui/table/new/TableCell';
import TableRow from '@/domain/admin/ui/table/new/TableRow';
import TableTemplate, {
  TableTemplateProps,
} from '@/domain/admin/ui/table/new/TableTemplate';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Button, Chip, MenuItem, TextField, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// --- Filter Types ---

type FilterField = 'magnet' | 'magnetType' | 'program' | 'marketingAgree';
type FilterOperator = 'include' | 'exclude';
type FilterCombinator = 'AND' | 'OR';

type FilterConditionNode = {
  id: string;
  type: 'condition';
  field: FilterField;
  operator: FilterOperator;
  values: string[];
};

type FilterGroupNode = {
  id: string;
  type: 'group';
  combinator: FilterCombinator;
  children: FilterNode[];
};

type FilterNode = FilterGroupNode | FilterConditionNode;

type StoredFilterConditionNode = {
  type: 'condition';
  field: FilterField;
  operator: FilterOperator;
  values?: string[];
};

type StoredFilterGroupNode = {
  type: 'group';
  combinator: FilterCombinator;
  children?: StoredFilterNode[];
};

type StoredFilterNode = StoredFilterConditionNode | StoredFilterGroupNode;

// --- Filter Definitions ---

const filterFieldDefinitions: Record<
  FilterField,
  { label: string; valueLabel: string }
> = {
  magnet: { label: '마그넷 참여', valueLabel: '마그넷 선택' },
  magnetType: { label: '마그넷 타입', valueLabel: '타입 선택' },
  program: { label: '프로그램 참여', valueLabel: '프로그램 선택' },
  marketingAgree: {
    label: '마케팅 동의 여부',
    valueLabel: '마케팅 동의 여부 선택',
  },
};

const filterOperatorOptions: Array<{
  value: FilterOperator;
  label: string;
}> = [
  { value: 'include', label: '하나라도 있음' },
  { value: 'exclude', label: '하나도 없음' },
];

const marketingAgreeOptions: Array<{ value: string; label: string }> = [
  { value: 'agreed', label: '동의' },
  { value: 'notAgreed', label: '미동의' },
];

const marketingAgreeLabelMap = new Map(
  marketingAgreeOptions.map(({ value, label }) => [value, label]),
);

const operatorLockedFields = new Set<FilterField>(['marketingAgree']);

// --- Filter Tree Utils ---

const FILTER_QUERY_KEY = 'filters';

const createConditionNode = (
  overrides: Partial<Omit<FilterConditionNode, 'id' | 'type'>> = {},
): FilterConditionNode => ({
  id: nanoid(),
  type: 'condition',
  field: overrides.field ?? 'magnet',
  operator: overrides.operator ?? 'include',
  values: overrides.values ?? [],
});

const createGroupNode = (
  overrides: Partial<Omit<FilterGroupNode, 'id' | 'type'>> = {},
): FilterGroupNode => ({
  id: nanoid(),
  type: 'group',
  combinator: overrides.combinator ?? 'AND',
  children: overrides.children ?? [],
});

const toStoredNode = (node: FilterNode): StoredFilterNode => {
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
  node: StoredFilterConditionNode,
): FilterConditionNode =>
  createConditionNode({
    field: node.field,
    operator: node.field === 'marketingAgree' ? 'include' : node.operator,
    values: node.values?.map(String) ?? [],
  });

const fromStoredGroupNode = (node: StoredFilterGroupNode): FilterGroupNode =>
  createGroupNode({
    combinator: node.combinator,
    children:
      node.children?.map((child) =>
        child.type === 'condition'
          ? fromStoredConditionNode(child)
          : fromStoredGroupNode(child),
      ) ?? [],
  });

const serializeFilterTree = (root: FilterGroupNode): string | undefined => {
  if (!root.children.length) return undefined;
  return JSON.stringify(toStoredNode(root));
};

const deserializeFilterTree = (raw: string | null): FilterGroupNode => {
  if (!raw) return createGroupNode();
  const parsed = JSON.parse(raw) as StoredFilterGroupNode;
  return fromStoredGroupNode(parsed);
};

const getFilterTreeSignature = (root: FilterGroupNode) =>
  serializeFilterTree(root) ?? '';

const hasConditionWithValues = (node: FilterNode): boolean => {
  if (node.type === 'condition') return node.values.length > 0;
  return node.children.some(hasConditionWithValues);
};

const updateFilterNode = (
  node: FilterNode,
  targetId: string,
  updater: (node: FilterNode) => FilterNode,
): FilterNode => {
  if (node.id === targetId) return updater(node);
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
  node: FilterNode,
  targetGroupId: string,
  child: FilterNode,
): FilterNode => {
  if (node.id === targetGroupId && node.type === 'group') {
    return { ...node, children: [...node.children, child] };
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
  node: FilterNode,
  targetId: string,
): FilterNode | null => {
  if (node.id === targetId) return null;
  if (node.type !== 'group') return node;
  const nextChildren = node.children
    .map((child) => removeFilterNode(child, targetId))
    .filter((child): child is FilterNode => child !== null);
  return { ...node, children: nextChildren };
};

// --- Filter Evaluation ---

type UserSummary = {
  magnetIds: Set<string>;
  magnetTypes: Set<string>;
  programIds: Set<string>;
  hasMarketingAgreement: boolean;
};

const buildUserSummary = (user: LeadManagementUser): UserSummary => ({
  magnetIds: new Set(user.magnetHistory.map((m) => String(m.id))),
  magnetTypes: new Set<string>(), // TODO: API에서 마그넷 타입 정보 포함 시 채움
  programIds: new Set(user.programHistory.map((p) => String(p.id))),
  hasMarketingAgreement: user.marketingAgree,
});

const evaluateCondition = (
  summary: UserSummary,
  condition: FilterConditionNode,
): boolean => {
  if (!condition.values.length) return true;

  switch (condition.field) {
    case 'magnet': {
      const hasAny = condition.values.some((v) => summary.magnetIds.has(v));
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'magnetType': {
      const hasAny = condition.values.some((v) => summary.magnetTypes.has(v));
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'program': {
      const hasAny = condition.values.some((v) => summary.programIds.has(v));
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'marketingAgree': {
      const status = summary.hasMarketingAgreement ? 'agreed' : 'notAgreed';
      return condition.values.some((v) => v === status);
    }
    default:
      return true;
  }
};

const evaluateFilterNode = (
  summary: UserSummary,
  node: FilterNode,
): boolean => {
  if (node.type === 'condition') return evaluateCondition(summary, node);
  if (!node.children.length) return true;
  if (node.combinator === 'AND') {
    return node.children.every((child) => evaluateFilterNode(summary, child));
  }
  return node.children.some((child) => evaluateFilterNode(summary, child));
};

// --- CSV Utils ---

const escapeCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'string' ? value : String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
};

// --- Table Column Key ---

type TableColumnKey =
  | 'name'
  | 'phoneNum'
  | 'grade'
  | 'wishJobGroup'
  | 'wishJob'
  | 'wishIndustry'
  | 'wishCompany'
  | 'programHistory'
  | 'magnetHistory'
  | 'marketingAgree';

const tableColumnMetaData: TableTemplateProps<TableColumnKey>['columnMetaData'] =
  {
    name: { headLabel: '이름', cellWidth: 'w-[7%]' },
    phoneNum: { headLabel: '전화번호', cellWidth: 'w-[10%]' },
    grade: { headLabel: '학년', cellWidth: 'w-[5%]' },
    wishJobGroup: { headLabel: '희망 직군', cellWidth: 'w-[8%]' },
    wishJob: { headLabel: '희망 직무', cellWidth: 'w-[8%]' },
    wishIndustry: { headLabel: '희망 산업', cellWidth: 'w-[8%]' },
    wishCompany: { headLabel: '희망 기업', cellWidth: 'w-[8%]' },
    programHistory: { headLabel: '프로그램 참여 이력', cellWidth: 'w-[16%]' },
    magnetHistory: { headLabel: '마그넷 신청 이력', cellWidth: 'w-[16%]' },
    marketingAgree: { headLabel: '마케팅 동의 여부', cellWidth: 'w-[10%]' },
  };

const TABLE_MIN_WIDTH = '80rem';

const LeadUserRow = ({ user }: { user: LeadManagementUser }) => (
  <TableRow minWidth={TABLE_MIN_WIDTH}>
    <TableCell cellWidth={tableColumnMetaData.name.cellWidth}>
      <Link
        href={`/admin/leads/managements/${user.id}`}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {user.name}
      </Link>
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.phoneNum.cellWidth}>
      {user.phoneNum || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.grade.cellWidth}>
      {user.grade || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishJobGroup.cellWidth}>
      {user.wishJobGroup || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishJob.cellWidth}>
      {user.wishJob || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishIndustry.cellWidth}>
      {user.wishIndustry || '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.wishCompany.cellWidth}>
      {user.wishCompany || '-'}
    </TableCell>
    <TableCell
      cellWidth={tableColumnMetaData.programHistory.cellWidth}
      textEllipsis
    >
      {user.programHistory.length
        ? user.programHistory.map((p) => `${p.title}(${p.id})`).join(' · ')
        : '-'}
    </TableCell>
    <TableCell
      cellWidth={tableColumnMetaData.magnetHistory.cellWidth}
      textEllipsis
    >
      {user.magnetHistory.length
        ? user.magnetHistory.map((m) => `${m.title}(${m.id})`).join(' · ')
        : '-'}
    </TableCell>
    <TableCell cellWidth={tableColumnMetaData.marketingAgree.cellWidth}>
      {user.marketingAgree ? '동의' : '미동의'}
    </TableCell>
  </TableRow>
);

// --- Main Page ---

const LeadManagementPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterTree = useMemo<FilterGroupNode>(
    () => deserializeFilterTree(searchParams.get(FILTER_QUERY_KEY)),
    [searchParams],
  );

  const { data: users = [], isLoading } = useLeadManagementListQuery();

  // --- Filter tree state management ---

  const replaceFilterTree = useCallback(
    (nextTree: FilterGroupNode) => {
      const currentSignature = getFilterTreeSignature(filterTree);
      const nextSignature = getFilterTreeSignature(nextTree);
      if (currentSignature === nextSignature) return;

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
    (updater: (current: FilterGroupNode) => FilterGroupNode) => {
      replaceFilterTree(updater(filterTree));
    },
    [filterTree, replaceFilterTree],
  );

  // --- Derived options ---

  const magnetOptions = useMemo(() => {
    const unique = new Map<string, string>();
    users.forEach((user) => {
      user.magnetHistory.forEach((m) => {
        unique.set(String(m.id), m.title);
      });
    });
    return Array.from(unique.entries()).map(([value, label]) => ({
      value,
      label: `${label}(${value})`,
    }));
  }, [users]);

  const magnetLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    magnetOptions.forEach(({ value, label }) => map.set(value, label));
    return map;
  }, [magnetOptions]);

  const programOptions = useMemo(() => {
    const unique = new Map<string, string>();
    users.forEach((user) => {
      user.programHistory.forEach((p) => {
        unique.set(String(p.id), p.title);
      });
    });
    return Array.from(unique.entries()).map(([value, label]) => ({
      value,
      label: `${label}(${value})`,
    }));
  }, [users]);

  const programLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    programOptions.forEach(({ value, label }) => map.set(value, label));
    return map;
  }, [programOptions]);

  // TODO: API에서 마그넷 타입 목록이 내려오면 실제 옵션으로 교체
  const magnetTypeOptions = useMemo<Array<{ value: string; label: string }>>(
    () => [],
    [],
  );

  // --- Filter evaluation ---

  const hasActiveFilter = useMemo(
    () => hasConditionWithValues(filterTree),
    [filterTree],
  );

  const filteredUsers = useMemo(() => {
    if (!hasActiveFilter) return users;
    return users.filter((user) => {
      const summary = buildUserSummary(user);
      return evaluateFilterNode(summary, filterTree);
    });
  }, [users, filterTree, hasActiveFilter]);

  // --- Filter handlers ---

  const handleResetFilters = useCallback(() => {
    replaceFilterTree(createGroupNode());
  }, [replaceFilterTree]);

  const handleAddCondition = useCallback(
    (groupId: string) => {
      updateFilterTree(
        (prev) =>
          appendChildToGroup(
            prev,
            groupId,
            createConditionNode(),
          ) as FilterGroupNode,
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
          ) as FilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleUpdateGroupCombinator = useCallback(
    (groupId: string, combinator: FilterCombinator) => {
      updateFilterTree(
        (prev) =>
          updateFilterNode(prev, groupId, (node) => {
            if (node.type !== 'group') return node;
            return { ...node, combinator };
          }) as FilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleUpdateCondition = useCallback(
    (
      conditionId: string,
      updates: Partial<Omit<FilterConditionNode, 'id' | 'type'>>,
    ) => {
      updateFilterTree(
        (prev) =>
          updateFilterNode(prev, conditionId, (node) => {
            if (node.type !== 'condition') return node;
            let next: FilterConditionNode = { ...node };

            if (updates.field && updates.field !== node.field) {
              next = {
                ...next,
                field: updates.field,
                values: [],
                operator: operatorLockedFields.has(updates.field)
                  ? 'include'
                  : next.operator,
              };
            } else if (updates.field) {
              next = { ...next, field: updates.field };
            }

            if (updates.operator && !operatorLockedFields.has(next.field)) {
              next = { ...next, operator: updates.operator };
            }

            if (updates.values) {
              next = { ...next, values: updates.values };
            } else if (updates.values !== undefined) {
              next = { ...next, values: [] };
            }

            return next;
          }) as FilterGroupNode,
      );
    },
    [updateFilterTree],
  );

  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      updateFilterTree((prev) => {
        if (prev.id === nodeId) return prev;
        const next = removeFilterNode(prev, nodeId);
        if (!next || next.type !== 'group') return prev;
        return next;
      });
    },
    [updateFilterTree],
  );

  // --- Value label helpers ---

  const getValueLabel = useCallback(
    (field: FilterField, value: string) => {
      if (field === 'magnet') return magnetLabelMap.get(value) ?? value;
      if (field === 'program') return programLabelMap.get(value) ?? value;
      if (field === 'marketingAgree')
        return marketingAgreeLabelMap.get(value) ?? value;
      return value;
    },
    [magnetLabelMap, programLabelMap],
  );

  const getOptionsForField = useCallback(
    (field: FilterField) => {
      if (field === 'magnet') return magnetOptions;
      if (field === 'magnetType') return magnetTypeOptions;
      if (field === 'program') return programOptions;
      if (field === 'marketingAgree') return marketingAgreeOptions;
      return [];
    },
    [magnetOptions, magnetTypeOptions, programOptions],
  );

  // --- CSV ---

  const handleDownloadCsv = useCallback(() => {
    if (!filteredUsers.length) {
      window.alert('다운로드할 데이터가 없습니다.');
      return;
    }

    const headers = [
      '이름',
      '전화번호',
      '학년',
      '희망직군',
      '희망직무',
      '희망산업',
      '희망기업',
      '프로그램 참여 이력',
      '마그넷 신청 이력',
      '마케팅 동의 여부',
    ];

    const headerRow = headers.map(escapeCsvValue).join(',');
    const rows = filteredUsers.map((user) =>
      [
        user.name,
        user.phoneNum,
        user.grade,
        user.wishJobGroup,
        user.wishJob,
        user.wishIndustry,
        user.wishCompany,
        user.programHistory.map((p) => `${p.title}(${p.id})`).join(' · '),
        user.magnetHistory.map((m) => `${m.title}(${m.id})`).join(' · '),
        user.marketingAgree ? '동의' : '미동의',
      ]
        .map(escapeCsvValue)
        .join(','),
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
      `lead-management_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredUsers]);

  // --- Filter UI Components ---

  const FilterConditionEditor = ({ node }: { node: FilterConditionNode }) => {
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
              field: event.target.value as FilterField,
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
        {!operatorLockedFields.has(node.field) && (
          <TextField
            select
            size="small"
            label="조건"
            value={node.operator}
            onChange={(event) =>
              handleUpdateCondition(node.id, {
                operator: event.target.value as FilterOperator,
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
              ? value.map(String)
              : [String(value)];
            handleUpdateCondition(node.id, { values: nextValues });
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
                if (!normalizedList.length) return '';
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
    node: FilterGroupNode;
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
                event.target.value as FilterCombinator,
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

  const rootHasChildren = filterTree.children.length > 0;

  return (
    <>
      <div className="px-12 pt-6">
        <div className="rounded mb-4 border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Typography className="text-xs text-gray-600">
              AND/OR 트리를 구성해 특정 이벤트·프로그램 참여 이력 여부로
              전화번호 그룹을 필터링할 수 있습니다.
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
            {filteredUsers.length}/{users.length}명
          </div>
        </div>
      </div>

      <div className="flex justify-end px-12">
        <Button
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={!filteredUsers.length}
        >
          CSV 내보내기
        </Button>
      </div>

      <TableTemplate<TableColumnKey>
        title="리드 관리"
        columnMetaData={tableColumnMetaData}
        minWidth={TABLE_MIN_WIDTH}
      >
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">로딩 중...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          filteredUsers.map((user) => <LeadUserRow key={user.id} user={user} />)
        )}
      </TableTemplate>
    </>
  );
};

export default LeadManagementPage;
