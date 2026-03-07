import { LeadManagementUser } from '@/api/leadManagement';
import { nanoid } from 'nanoid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// --- Filter Types ---

export type FilterField = 'magnet' | 'magnetType' | 'program' | 'marketingAgree';
export type FilterOperator = 'include' | 'exclude';
export type FilterCombinator = 'AND' | 'OR';

export type FilterConditionNode = {
  id: string;
  type: 'condition';
  field: FilterField;
  operator: FilterOperator;
  values: string[];
};

export type FilterGroupNode = {
  id: string;
  type: 'group';
  combinator: FilterCombinator;
  children: FilterNode[];
};

export type FilterNode = FilterGroupNode | FilterConditionNode;

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

export const filterFieldDefinitions: Record<
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

export const filterOperatorOptions: Array<{
  value: FilterOperator;
  label: string;
}> = [
  { value: 'include', label: '하나라도 있음' },
  { value: 'exclude', label: '하나도 없음' },
];

export const marketingAgreeOptions: Array<{ value: string; label: string }> = [
  { value: 'agreed', label: '동의' },
  { value: 'notAgreed', label: '미동의' },
];

const marketingAgreeLabelMap = new Map(
  marketingAgreeOptions.map(({ value, label }) => [value, label]),
);

export const operatorLockedFields = new Set<FilterField>(['marketingAgree']);

// --- Filter Tree Utils ---

const FILTER_QUERY_KEY = 'filters';

export const createConditionNode = (
  overrides: Partial<Omit<FilterConditionNode, 'id' | 'type'>> = {},
): FilterConditionNode => ({
  id: nanoid(),
  type: 'condition',
  field: overrides.field ?? 'magnet',
  operator: overrides.operator ?? 'include',
  values: overrides.values ?? [],
});

export const createGroupNode = (
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
  try {
    const parsed = JSON.parse(raw) as StoredFilterGroupNode;
    return fromStoredGroupNode(parsed);
  } catch {
    return createGroupNode();
  }
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

// --- Hook ---

export const useLeadManagementFilter = (users: LeadManagementUser[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterTree = useMemo<FilterGroupNode>(
    () => deserializeFilterTree(searchParams.get(FILTER_QUERY_KEY)),
    [searchParams],
  );

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

  return {
    filterTree,
    filteredUsers,
    totalUserCount: users.length,
    handleResetFilters,
    handleAddCondition,
    handleAddGroup,
    handleUpdateGroupCombinator,
    handleUpdateCondition,
    handleRemoveNode,
    getValueLabel,
    getOptionsForField,
  };
};
