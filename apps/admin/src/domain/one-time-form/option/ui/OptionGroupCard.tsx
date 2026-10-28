import { FormControlLabel, Switch, TextField } from '@mui/material';

import type { OneTimeFormOptionSelectType } from '@/api/one-time-form/oneTimeFormSchema';

import { OPTION_SELECT_TYPE_LABELS } from '../constants/optionLimits';
import type {
  OptionDraft,
  OptionGroupDraft,
  OptionGroupListErrors,
} from '../types/optionGroupDraft';
import type { OptionGroupListAction } from '../utils/optionGroupListReducer';
import OptionTable from './OptionTable';

interface OptionGroupCardProps {
  group: OptionGroupDraft;
  index: number;
  total: number;
  errors: OptionGroupListErrors;
  edit: (action: OptionGroupListAction) => void;
  onDeleteGroup: () => void;
  onDeleteOption: (option: OptionDraft) => void;
}

const SELECT_TYPES = Object.keys(
  OPTION_SELECT_TYPE_LABELS,
) as OneTimeFormOptionSelectType[];

/** 옵션 그룹 하나(시안 7절 `옵션 그룹 N`) */
const OptionGroupCard = ({
  group,
  index,
  total,
  errors,
  edit,
  onDeleteGroup,
  onDeleteOption,
}: OptionGroupCardProps) => {
  const groupKey = group.key;
  const groupErrors = errors[groupKey];
  const name = `옵션 그룹 ${index + 1}`;

  return (
    <li className="border-neutral-80 flex flex-col gap-4 rounded-md border p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-xsmall16 text-neutral-0 font-bold">{name}</h4>
        <div className="text-xxsmall12 text-neutral-40 flex gap-2">
          <button
            type="button"
            aria-label={`${name} 위로`}
            disabled={index === 0}
            onClick={() =>
              edit({ type: 'moveGroup', from: index, to: index - 1 })
            }
          >
            위로
          </button>
          <button
            type="button"
            aria-label={`${name} 아래로`}
            disabled={index === total - 1}
            onClick={() =>
              edit({ type: 'moveGroup', from: index, to: index + 1 })
            }
          >
            아래로
          </button>
          <button
            type="button"
            aria-label={`${name} 삭제`}
            onClick={onDeleteGroup}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <TextField
          className="flex-[2]"
          label="그룹 제목"
          required
          value={group.title}
          onChange={(e) =>
            edit({
              type: 'updateGroup',
              groupKey,
              patch: { title: e.target.value },
            })
          }
          error={!!groupErrors?.title}
          helperText={groupErrors?.title}
        />
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xxsmall12 text-neutral-40">선택 방식</span>
          <div
            role="group"
            aria-label={`${name} 선택 방식`}
            className="border-neutral-80 flex self-start overflow-hidden rounded-md border"
          >
            {SELECT_TYPES.map((selectType) => {
              const isOn = group.selectType === selectType;
              return (
                <button
                  key={selectType}
                  type="button"
                  aria-pressed={isOn}
                  className={`text-xsmall14 px-4 py-2 ${
                    isOn
                      ? 'bg-primary-10 text-primary font-semibold'
                      : 'text-neutral-40'
                  }`}
                  onClick={() =>
                    edit({
                      type: 'updateGroup',
                      groupKey,
                      patch: { selectType },
                    })
                  }
                >
                  {OPTION_SELECT_TYPE_LABELS[selectType]}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xxsmall12 text-neutral-40">필수</span>
          <FormControlLabel
            label={group.isRequired ? '필수 선택' : '선택 사항'}
            control={
              <Switch
                checked={group.isRequired}
                onChange={(e) =>
                  edit({
                    type: 'updateGroup',
                    groupKey,
                    patch: { isRequired: e.target.checked },
                  })
                }
                inputProps={{ 'aria-label': `${name} 필수` }}
              />
            }
          />
        </div>
      </div>

      <TextField
        label="그룹 설명"
        value={group.description}
        onChange={(e) =>
          edit({
            type: 'updateGroup',
            groupKey,
            patch: { description: e.target.value },
          })
        }
        error={!!groupErrors?.description}
        helperText={groupErrors?.description}
      />

      <OptionTable
        groupKey={groupKey}
        options={group.options}
        errors={errors}
        edit={edit}
        onDelete={onDeleteOption}
      />

      <button
        type="button"
        className="text-xsmall14 border-neutral-80 text-neutral-0 self-start rounded-md border border-dashed px-4 py-2"
        onClick={() => edit({ type: 'addOption', groupKey })}
      >
        옵션 추가
      </button>
    </li>
  );
};

export default OptionGroupCard;
