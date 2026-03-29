'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { FilterEditorCallbacks } from '../section/FilterEditor';
import type {
  LeadHistoryFilterCombinator,
  LeadHistoryFilterConditionNode,
  LeadHistoryFilterField,
  LeadHistoryFilterGroupNode,
  LeadHistoryGroupSummary,
  LeadHistoryRow,
  SelectOption,
} from '../types';
import {
  FILTER_QUERY_KEY,
  marketingAgreeLabelMap,
  marketingAgreeOptions,
  membershipOptions,
} from '../types';
import {
  appendChildToGroup,
  createConditionNode,
  createGroupNode,
  deserializeFilterTree,
  evaluateFilterNode,
  getFilterTreeSignature,
  hasConditionWithValues,
  removeFilterNode,
  serializeFilterTree,
  updateFilterNode,
} from '../utils/filterTree';
import { compareLeadHistoryRowsByName } from '../utils/rowUtils';

interface UseLeadHistoryFilterParams {
  allRows: LeadHistoryRow[];
  groupSummaryMap: Map<string, LeadHistoryGroupSummary>;
  magnetOptions: SelectOption[];
  magnetLabelMap: Map<string, string>;
  programOptions: SelectOption[];
  magnetTypeOptions: SelectOption[];
  magnetTypeLabelMap: Map<string, string>;
}

const useLeadHistoryFilter = ({
  allRows,
  groupSummaryMap,
  magnetOptions,
  magnetLabelMap,
  programOptions,
  magnetTypeOptions,
  magnetTypeLabelMap,
}: UseLeadHistoryFilterParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterTree = useMemo<LeadHistoryFilterGroupNode>(
    () => deserializeFilterTree(searchParams.get(FILTER_QUERY_KEY)),
    [searchParams],
  );

  // --- URL sync ---
  const replaceFilterTree = useCallback(
    (nextTree: LeadHistoryFilterGroupNode) => {
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

  const updateTree = useCallback(
    (
      updater: (
        current: LeadHistoryFilterGroupNode,
      ) => LeadHistoryFilterGroupNode,
    ) => {
      replaceFilterTree(updater(filterTree));
    },
    [filterTree, replaceFilterTree],
  );

  // --- Filtering ---
  const hasActiveFilter = useMemo(
    () => hasConditionWithValues(filterTree),
    [filterTree],
  );

  const filteredRows = useMemo(() => {
    if (!allRows.length) return [];
    let rowsToSort: LeadHistoryRow[] = allRows;

    if (hasActiveFilter) {
      const allowed = new Set<string>();
      groupSummaryMap.forEach((summary, key) => {
        if (evaluateFilterNode(summary, filterTree)) allowed.add(key);
      });
      if (!allowed.size) return [];
      rowsToSort = allRows.filter((row) =>
        allowed.has(row.displayPhoneNum),
      );
    }

    return [...rowsToSort].sort(compareLeadHistoryRowsByName);
  }, [allRows, filterTree, groupSummaryMap, hasActiveFilter]);

  const filteredGroupCount = useMemo(() => {
    const groups = new Set<string>();
    filteredRows.forEach((row) => groups.add(row.displayPhoneNum));
    return groups.size;
  }, [filteredRows]);

  const totalGroupCount = groupSummaryMap.size;

  // --- Filter editor callbacks ---
  const handleAddCondition = useCallback(
    (groupId: string) => {
      updateTree(
        (prev) =>
          appendChildToGroup(
            prev,
            groupId,
            createConditionNode(),
          ) as LeadHistoryFilterGroupNode,
      );
    },
    [updateTree],
  );

  const handleAddGroup = useCallback(
    (groupId: string) => {
      updateTree(
        (prev) =>
          appendChildToGroup(
            prev,
            groupId,
            createGroupNode(),
          ) as LeadHistoryFilterGroupNode,
      );
    },
    [updateTree],
  );

  const handleUpdateGroupCombinator = useCallback(
    (groupId: string, combinator: LeadHistoryFilterCombinator) => {
      updateTree(
        (prev) =>
          updateFilterNode(prev, groupId, (node) => {
            if (node.type !== 'group') return node;
            return { ...node, combinator };
          }) as LeadHistoryFilterGroupNode,
      );
    },
    [updateTree],
  );

  const handleUpdateCondition = useCallback(
    (
      conditionId: string,
      updates: Partial<
        Omit<LeadHistoryFilterConditionNode, 'id' | 'type'>
      >,
    ) => {
      updateTree(
        (prev) =>
          updateFilterNode(prev, conditionId, (node) => {
            if (node.type !== 'condition') return node;
            let next: LeadHistoryFilterConditionNode = { ...node };

            if (updates.field && updates.field !== node.field) {
              next = {
                ...next,
                field: updates.field,
                values: [],
                operator: 'include',
              };
            } else if (updates.field) {
              next = { ...next, field: updates.field };
            }

            if (
              updates.operator &&
              next.field !== 'membership' &&
              next.field !== 'marketingAgree'
            ) {
              next = { ...next, operator: updates.operator };
            }

            if (updates.values) {
              next = { ...next, values: updates.values };
            } else if (updates.values !== undefined) {
              next = { ...next, values: [] };
            }

            return next;
          }) as LeadHistoryFilterGroupNode,
      );
    },
    [updateTree],
  );

  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      updateTree((prev) => {
        if (prev.id === nodeId) return prev;
        const next = removeFilterNode(prev, nodeId);
        if (!next || next.type !== 'group') return prev;
        return next;
      });
    },
    [updateTree],
  );

  const resetFilters = useCallback(() => {
    replaceFilterTree(createGroupNode());
  }, [replaceFilterTree]);

  const getValueLabel = useCallback(
    (field: LeadHistoryFilterField, value: string) => {
      if (field === 'magnet') return magnetLabelMap.get(value) ?? value;
      if (field === 'program') return value;
      if (field === 'magnetType')
        return magnetTypeLabelMap.get(value) ?? value;
      if (field === 'marketingAgree')
        return marketingAgreeLabelMap.get(value) ?? value;
      if (field === 'membership') {
        return (
          membershipOptions.find((item) => item.value === value)?.label ??
          value
        );
      }
      return value;
    },
    [magnetLabelMap, magnetTypeLabelMap],
  );

  const getOptionsForField = useCallback(
    (field: LeadHistoryFilterField): SelectOption[] => {
      if (field === 'magnet') return magnetOptions;
      if (field === 'program') return programOptions;
      if (field === 'magnetType') return magnetTypeOptions;
      if (field === 'membership') return membershipOptions;
      if (field === 'marketingAgree') return marketingAgreeOptions;
      return [];
    },
    [magnetOptions, programOptions, magnetTypeOptions],
  );

  const callbacks = useMemo<FilterEditorCallbacks>(
    () => ({
      onUpdateCondition: handleUpdateCondition,
      onUpdateGroupCombinator: handleUpdateGroupCombinator,
      onAddCondition: handleAddCondition,
      onAddGroup: handleAddGroup,
      onRemoveNode: handleRemoveNode,
      getOptionsForField,
      getValueLabel,
    }),
    [
      handleUpdateCondition,
      handleUpdateGroupCombinator,
      handleAddCondition,
      handleAddGroup,
      handleRemoveNode,
      getOptionsForField,
      getValueLabel,
    ],
  );

  return {
    filterTree,
    filteredRows,
    filteredGroupCount,
    totalGroupCount,
    rootHasChildren: filterTree.children.length > 0,
    callbacks,
    resetFilters,
  };
};

export default useLeadHistoryFilter;
