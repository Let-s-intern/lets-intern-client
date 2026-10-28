import { Button } from '@mui/material';
import { useState } from 'react';

import type { OptionGroupEditor } from '../hooks/useOptionGroupEditor';
import type { OptionDraft, OptionGroupDraft } from '../types/optionGroupDraft';
import DeleteOptionDialog, {
  type PendingOptionDelete,
} from './DeleteOptionDialog';
import OptionGroupCard from './OptionGroupCard';

interface OptionGroupSectionProps {
  /** 미리보기와 상태를 함께 쓰려고 편집기 화면이 만든 것을 받는다 */
  editor: OptionGroupEditor;
  /** 0 보다 크면 저장된 그룹·옵션을 지울 때 한 번 묻는다 */
  applicationCount: number;
}

/** 옵션 그룹 편집. 그룹·옵션 전체를 A7 로 한 번에 저장한다 */
const OptionGroupSection = ({
  editor,
  applicationCount,
}: OptionGroupSectionProps) => {
  const { groups, isDirty, errors, edit, save, isSaving } = editor;
  const [pendingDelete, setPendingDelete] =
    useState<PendingOptionDelete | null>(null);
  const hasApplications = applicationCount > 0;

  const remove = (target: PendingOptionDelete) =>
    edit(
      target.kind === 'group'
        ? { type: 'removeGroup', groupKey: target.groupKey }
        : {
            type: 'removeOption',
            groupKey: target.groupKey,
            optionKey: target.optionKey,
          },
    );

  // 저장 안 된 것은 받은 신청과 무관하니 바로 지운다
  const requestDelete = (target: PendingOptionDelete, isSaved: boolean) => {
    if (hasApplications && isSaved) setPendingDelete(target);
    else remove(target);
  };

  const deleteGroup = (group: OptionGroupDraft) =>
    requestDelete(
      { kind: 'group', groupKey: group.key, label: group.title },
      group.optionGroupId !== null,
    );

  const deleteOption = (group: OptionGroupDraft, option: OptionDraft) =>
    requestDelete(
      {
        kind: 'option',
        groupKey: group.key,
        optionKey: option.key,
        label: option.name,
      },
      option.optionId !== null,
    );

  const confirmDelete = () => {
    if (pendingDelete) remove(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <section className="border-neutral-80 flex flex-col gap-5 rounded-md border p-6">
      <h3 className="text-small18 text-neutral-0 font-bold">옵션</h3>

      {groups.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40">
          아직 옵션 그룹이 없습니다. 옵션 그룹 추가로 만드세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {groups.map((group, index) => (
            <OptionGroupCard
              key={group.key}
              group={group}
              index={index}
              total={groups.length}
              errors={errors}
              edit={edit}
              onDeleteGroup={() => deleteGroup(group)}
              onDeleteOption={(option) => deleteOption(group, option)}
            />
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outlined" onClick={() => edit({ type: 'addGroup' })}>
          옵션 그룹 추가
        </Button>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xxsmall12 text-neutral-40">
              저장하지 않은 변경이 있습니다.
            </span>
          )}
          <Button
            variant="contained"
            disabled={!isDirty || isSaving}
            onClick={save}
          >
            옵션 저장
          </Button>
        </div>
      </div>

      <DeleteOptionDialog
        target={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default OptionGroupSection;
