import { twMerge } from '@/lib/twMerge';
import {
  Button,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import type {
  LeadHistoryFilterCombinator,
  LeadHistoryFilterConditionNode,
  LeadHistoryFilterField,
  LeadHistoryFilterGroupNode,
  LeadHistoryFilterOperator,
  SelectOption,
} from '../types';
import {
  filterFieldDefinitions,
  filterOperatorOptions,
  operatorLockedFields,
} from '../types';

interface FilterEditorCallbacks {
  onUpdateCondition: (
    conditionId: string,
    updates: Partial<Omit<LeadHistoryFilterConditionNode, 'id' | 'type'>>,
  ) => void;
  onUpdateGroupCombinator: (
    groupId: string,
    combinator: LeadHistoryFilterCombinator,
  ) => void;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveNode: (nodeId: string) => void;
  getOptionsForField: (field: LeadHistoryFilterField) => SelectOption[];
  getValueLabel: (field: LeadHistoryFilterField, value: string) => string;
}

const FilterConditionEditor = ({
  node,
  callbacks,
}: {
  node: LeadHistoryFilterConditionNode;
  callbacks: FilterEditorCallbacks;
}) => {
  const valueOptions = callbacks.getOptionsForField(node.field);

  return (
    <div className="rounded flex w-full flex-wrap items-end gap-2 border border-gray-200 bg-white px-2 py-2">
      <TextField
        select
        size="small"
        label="대상"
        value={node.field}
        onChange={(event) =>
          callbacks.onUpdateCondition(node.id, {
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
      {!operatorLockedFields.has(node.field) && (
        <TextField
          select
          size="small"
          label="조건"
          value={node.operator}
          onChange={(event) =>
            callbacks.onUpdateCondition(node.id, {
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
          callbacks.onUpdateCondition(node.id, { values: nextValues });
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
                      label={callbacks.getValueLabel(
                        node.field,
                        String(item),
                      )}
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
        onClick={() => callbacks.onRemoveNode(node.id)}
      >
        삭제
      </Button>
    </div>
  );
};

interface FilterGroupEditorProps {
  node: LeadHistoryFilterGroupNode;
  isRoot?: boolean;
  callbacks: FilterEditorCallbacks;
}

const FilterGroupEditor = ({
  node,
  isRoot = false,
  callbacks,
}: FilterGroupEditorProps) => {
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
            callbacks.onUpdateGroupCombinator(
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
            onClick={() => callbacks.onAddCondition(node.id)}
          >
            <Plus size={12} className="mr-1" />
            조건
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => callbacks.onAddGroup(node.id)}
          >
            <Plus size={12} className="mr-1" />
            그룹
          </Button>
          {!isRoot && (
            <Button
              size="small"
              color="error"
              variant="text"
              onClick={() => callbacks.onRemoveNode(node.id)}
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
              <FilterConditionEditor
                key={child.id}
                node={child}
                callbacks={callbacks}
              />
            ) : (
              <FilterGroupEditor
                key={child.id}
                node={child}
                callbacks={callbacks}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default FilterGroupEditor;
export type { FilterEditorCallbacks };
