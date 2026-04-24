import { nanoid } from 'nanoid';
import type {
  LeadHistoryFilterConditionNode,
  LeadHistoryFilterGroupNode,
  LeadHistoryFilterNode,
  LeadHistoryGroupSummary,
  StoredLeadHistoryFilterConditionNode,
  StoredLeadHistoryFilterGroupNode,
  StoredLeadHistoryFilterNode,
} from '../types';

export const createConditionNode = (
  overrides: Partial<
    Omit<LeadHistoryFilterConditionNode, 'id' | 'type'>
  > = {},
): LeadHistoryFilterConditionNode => ({
  id: nanoid(),
  type: 'condition',
  field: overrides.field ?? 'magnet',
  operator: overrides.operator ?? 'include',
  values: overrides.values ?? [],
});

export const createGroupNode = (
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
    operator:
      node.field === 'membership' || node.field === 'marketingAgree'
        ? 'include'
        : node.operator,
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

export const serializeFilterTree = (
  root: LeadHistoryFilterGroupNode,
): string | undefined => {
  if (!root.children.length) return undefined;
  return JSON.stringify(toStoredNode(root));
};

export const deserializeFilterTree = (
  raw: string | null,
): LeadHistoryFilterGroupNode => {
  if (!raw) return createGroupNode();
  const parsed = JSON.parse(raw) as StoredLeadHistoryFilterGroupNode;
  return fromStoredGroupNode(parsed);
};

export const getFilterTreeSignature = (
  root: LeadHistoryFilterGroupNode,
) => {
  return serializeFilterTree(root) ?? '';
};

export const hasConditionWithValues = (
  node: LeadHistoryFilterNode,
): boolean => {
  if (node.type === 'condition') return node.values.length > 0;
  return node.children.some((child) => hasConditionWithValues(child));
};

const evaluateConditionNode = (
  summary: LeadHistoryGroupSummary,
  condition: LeadHistoryFilterConditionNode,
): boolean => {
  if (!condition.values.length) return true;

  switch (condition.field) {
    case 'magnet': {
      const hasAny = condition.values.some((v) =>
        summary.magnetIds.has(String(v)),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'program': {
      const hasAny = condition.values.some((v) =>
        summary.programTitles.has(String(v)),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'magnetType': {
      const hasAny = condition.values.some((v) =>
        summary.magnetTypes.has(String(v)),
      );
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'membership': {
      const status = summary.hasSignedUp ? 'signedUp' : 'notSignedUp';
      const hasAny = condition.values.some((v) => v === status);
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    case 'marketingAgree': {
      const status = summary.hasMarketingAgreement ? 'agreed' : 'notAgreed';
      const hasAny = condition.values.some((v) => v === status);
      return condition.operator === 'include' ? hasAny : !hasAny;
    }
    default:
      return true;
  }
};

export const evaluateFilterNode = (
  summary: LeadHistoryGroupSummary,
  node: LeadHistoryFilterNode,
): boolean => {
  if (node.type === 'condition') return evaluateConditionNode(summary, node);
  if (!node.children.length) return true;

  if (node.combinator === 'AND') {
    return node.children.every((child) =>
      evaluateFilterNode(summary, child),
    );
  }
  return node.children.some((child) => evaluateFilterNode(summary, child));
};

export const updateFilterNode = (
  node: LeadHistoryFilterNode,
  targetId: string,
  updater: (node: LeadHistoryFilterNode) => LeadHistoryFilterNode,
): LeadHistoryFilterNode => {
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

export const appendChildToGroup = (
  node: LeadHistoryFilterNode,
  targetGroupId: string,
  child: LeadHistoryFilterNode,
): LeadHistoryFilterNode => {
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

export const removeFilterNode = (
  node: LeadHistoryFilterNode,
  targetId: string,
): LeadHistoryFilterNode | null => {
  if (node.id === targetId) return null;
  if (node.type !== 'group') return node;

  const nextChildren = node.children
    .map((child) => removeFilterNode(child, targetId))
    .filter((child): child is LeadHistoryFilterNode => child !== null);

  return { ...node, children: nextChildren };
};
