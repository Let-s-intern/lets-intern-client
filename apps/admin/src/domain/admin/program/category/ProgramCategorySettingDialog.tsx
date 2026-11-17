import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaTrash } from 'react-icons/fa';
import {
  useAdminProgramCategoryGroupsQuery,
  useCreateProgramCategory,
  useCreateProgramCategoryGroup,
  useDeleteProgramCategory,
  useDeleteProgramCategoryGroup,
  useReorderProgramCategories,
  useReorderProgramCategoryGroups,
  useUpdateProgramCategory,
  useUpdateProgramCategoryGroup,
  type ProgramCategory,
} from './programCategoryApi';

interface ItemRowProps {
  title: string;
  caption?: string;
  isVisible: boolean;
  selected?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect?: () => void;
  onRename: (title: string) => void;
  onToggleVisible: (isVisible: boolean) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}

/** 이름은 포커스를 벗어나거나 Enter 를 누를 때 저장한다 */
const ItemRow = ({
  title,
  caption,
  isVisible,
  selected,
  isFirst,
  isLast,
  onSelect,
  onRename,
  onToggleVisible,
  onMove,
  onDelete,
}: ItemRowProps) => {
  const [value, setValue] = useState(title);

  useEffect(() => setValue(title), [title]);

  const commit = () => {
    const next = value.trim();
    if (!next) {
      setValue(title);
      return;
    }
    if (next !== title) onRename(next);
  };

  return (
    <li
      className={`flex items-center gap-1 rounded-xs px-2 py-1 ${
        selected ? 'bg-primary-10' : ''
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect}
    >
      <TextField
        size="small"
        value={value}
        inputProps={{ maxLength: 30 }}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        onFocus={onSelect}
        sx={{ flex: 1, opacity: isVisible ? 1 : 0.5 }}
      />
      {caption && (
        <span className="shrink-0 text-xsmall14 text-neutral-40">
          {caption}
        </span>
      )}
      <IconButton
        size="small"
        disabled={isFirst}
        onClick={(e) => {
          e.stopPropagation();
          onMove(-1);
        }}
        aria-label="위로"
      >
        <FaArrowUp size={12} />
      </IconButton>
      <IconButton
        size="small"
        disabled={isLast}
        onClick={(e) => {
          e.stopPropagation();
          onMove(1);
        }}
        aria-label="아래로"
      >
        <FaArrowDown size={12} />
      </IconButton>
      <Switch
        size="small"
        checked={isVisible}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onToggleVisible(e.target.checked)}
        inputProps={{ 'aria-label': '노출' }}
      />
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="삭제"
      >
        <FaTrash size={12} />
      </IconButton>
    </li>
  );
};

const AddRow = ({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (title: string) => Promise<unknown>;
}) => {
  const [value, setValue] = useState('');

  const submit = async () => {
    const title = value.trim();
    if (!title) return;
    await onAdd(title);
    setValue('');
  };

  return (
    <div className="mt-2 flex gap-2">
      <TextField
        size="small"
        placeholder={placeholder}
        value={value}
        inputProps={{ maxLength: 30 }}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        sx={{ flex: 1 }}
      />
      <Button variant="outlined" onClick={submit}>
        추가
      </Button>
    </div>
  );
};

const moveId = (ids: number[], index: number, direction: -1 | 1) => {
  const next = [...ids];
  [next[index], next[index + direction]] = [
    next[index + direction],
    next[index],
  ];
  return next;
};

interface ProgramCategorySettingDialogProps {
  open: boolean;
  onClose: () => void;
}

/** 목록(왼쪽)과 고른 목록의 카테고리(오른쪽)를 추가·이름 변경·순서·숨김한다. 삭제는 없다 */
const ProgramCategorySettingDialog = ({
  open,
  onClose,
}: ProgramCategorySettingDialogProps) => {
  const { snackbar } = useAdminSnackbar();
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const createGroup = useCreateProgramCategoryGroup();
  const updateGroup = useUpdateProgramCategoryGroup();
  const reorderGroups = useReorderProgramCategoryGroups();
  const createCategory = useCreateProgramCategory();
  const updateCategory = useUpdateProgramCategory();
  const reorderCategories = useReorderProgramCategories();
  const deleteGroup = useDeleteProgramCategoryGroup();
  const deleteCategory = useDeleteProgramCategory();

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0];

  const run = async (task: Promise<unknown>) => {
    try {
      await task;
    } catch {
      snackbar('저장에 실패했습니다.');
    }
  };

  // 연결된 프로그램이 있거나 안에 카테고리가 있을 때만 한 번 더 묻는다
  const handleDeleteGroup = (group: (typeof groups)[number]) => {
    const linked = group.categoryList.reduce(
      (sum, c) => sum + c.programCount,
      0,
    );
    if (
      group.categoryList.length > 0 &&
      !window.confirm(
        `"${group.title}" 목록을 지우면 안의 카테고리 ${group.categoryList.length}개와 프로그램 연결 ${linked}건도 함께 지워집니다. 삭제할까요?`,
      )
    )
      return;
    if (selectedGroupId === group.id) setSelectedGroupId(null);
    run(deleteGroup.mutateAsync(group.id));
  };

  const handleDeleteCategory = (category: ProgramCategory) => {
    if (
      category.programCount > 0 &&
      !window.confirm(
        `"${category.title}" 은 프로그램 ${category.programCount}개에 연결돼 있습니다. 연결도 함께 지워집니다. 삭제할까요?`,
      )
    )
      return;
    run(deleteCategory.mutateAsync(category.id));
  };

  const groupIds = groups.map((group) => group.id);
  const categoryIds = selectedGroup?.categoryList.map((c) => c.id) ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>카테고리 설정</DialogTitle>
      <DialogContent>
        <p className="mb-4 text-xsmall14 text-neutral-40">
          목록은 프로그램 목록 필터의 제목 줄, 카테고리는 그 아래 체크박스가
          됩니다. 잠시 빼 두려면 숨김, 아예 없애려면 삭제를 씁니다.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="mb-2 font-semibold">목록</h3>
            <ul className="flex flex-col gap-1">
              {groups.map((group, index) => (
                <ItemRow
                  key={group.id}
                  title={group.title}
                  isVisible={group.isVisible}
                  selected={group.id === selectedGroup?.id}
                  isFirst={index === 0}
                  isLast={index === groups.length - 1}
                  onSelect={() => setSelectedGroupId(group.id)}
                  onRename={(title) =>
                    run(updateGroup.mutateAsync({ id: group.id, title }))
                  }
                  onToggleVisible={(isVisible) =>
                    run(updateGroup.mutateAsync({ id: group.id, isVisible }))
                  }
                  onMove={(direction) =>
                    run(
                      reorderGroups.mutateAsync(
                        moveId(groupIds, index, direction),
                      ),
                    )
                  }
                  onDelete={() => handleDeleteGroup(group)}
                />
              ))}
            </ul>
            <AddRow
              placeholder="새 목록 이름 (예: 관심 직무)"
              onAdd={(title) => run(createGroup.mutateAsync({ title }))}
            />
          </section>

          <section>
            <h3 className="mb-2 font-semibold">
              {selectedGroup ? `${selectedGroup.title} 카테고리` : '카테고리'}
            </h3>
            {selectedGroup ? (
              <>
                <ul className="flex flex-col gap-1">
                  {selectedGroup.categoryList.map((category, index) => (
                    <ItemRow
                      key={category.id}
                      title={category.title}
                      caption={`연결 ${category.programCount}`}
                      isVisible={category.isVisible}
                      isFirst={index === 0}
                      isLast={index === selectedGroup.categoryList.length - 1}
                      onRename={(title) =>
                        run(
                          updateCategory.mutateAsync({
                            id: category.id,
                            title,
                          }),
                        )
                      }
                      onToggleVisible={(isVisible) =>
                        run(
                          updateCategory.mutateAsync({
                            id: category.id,
                            isVisible,
                          }),
                        )
                      }
                      onMove={(direction) =>
                        run(
                          reorderCategories.mutateAsync({
                            programCategoryGroupId: selectedGroup.id,
                            programCategoryIdList: moveId(
                              categoryIds,
                              index,
                              direction,
                            ),
                          }),
                        )
                      }
                      onDelete={() => handleDeleteCategory(category)}
                    />
                  ))}
                </ul>
                <AddRow
                  placeholder="새 카테고리 이름 (예: 마케팅)"
                  onAdd={(title) =>
                    run(
                      createCategory.mutateAsync({
                        programCategoryGroupId: selectedGroup.id,
                        title,
                      }),
                    )
                  }
                />
              </>
            ) : (
              <p className="text-xsmall14 text-neutral-40">
                먼저 왼쪽에서 목록을 추가하세요.
              </p>
            )}
          </section>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramCategorySettingDialog;
