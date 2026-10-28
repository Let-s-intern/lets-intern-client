import { Switch, TextField } from '@mui/material';

import { useDragReorder } from '../../hooks/useDragReorder';
import PriceTextField from '../../ui/PriceTextField';
import type {
  OptionDraft,
  OptionGroupListErrors,
} from '../types/optionGroupDraft';
import type {
  OptionGroupListAction,
  OptionPatch,
} from '../utils/optionGroupListReducer';

interface OptionTableProps {
  groupKey: string;
  options: OptionDraft[];
  errors: OptionGroupListErrors;
  edit: (action: OptionGroupListAction) => void;
  onDelete: (option: OptionDraft) => void;
}

const HEAD_CELL =
  'text-xxsmall12 text-neutral-40 px-2 py-2 text-left font-medium';
const CELL = 'px-2 py-2 align-top';

/** 그룹 안 옵션 표(시안 7절). `::` 를 끌어 순서를 바꾼다 */
const OptionTable = ({
  groupKey,
  options,
  errors,
  edit,
  onDelete,
}: OptionTableProps) => {
  const { getHandleProps, getDropProps } = useDragReorder((from, to) =>
    edit({ type: 'moveOption', groupKey, from, to }),
  );

  const update = (option: OptionDraft, patch: OptionPatch) =>
    edit({ type: 'updateOption', groupKey, optionKey: option.key, patch });

  if (options.length === 0) {
    return (
      <p className="text-xsmall14 text-neutral-40">
        옵션이 없습니다. 옵션 추가로 만드세요.
      </p>
    );
  }

  return (
    <table className="w-full table-fixed">
      <thead className="bg-neutral-95">
        <tr>
          <th className="w-8" aria-label="순서" />
          <th className={HEAD_CELL}>옵션 이름</th>
          <th className={HEAD_CELL}>설명</th>
          <th className={`${HEAD_CELL} w-32`}>추가 금액</th>
          <th className={`${HEAD_CELL} w-24`}>배지</th>
          <th className={`${HEAD_CELL} w-16`}>노출</th>
          <th className="w-12" aria-label="삭제" />
        </tr>
      </thead>
      <tbody>
        {options.map((option, index) => {
          const optionErrors = errors[option.key];
          const label = `옵션 ${index + 1}`;
          return (
            <tr
              key={option.key}
              className="border-neutral-80 border-b"
              {...getDropProps(index)}
            >
              <td className={CELL}>
                <span
                  className="text-neutral-40 cursor-grab select-none px-1 leading-10"
                  aria-label={`${label} 끌어서 순서 바꾸기`}
                  {...getHandleProps(index)}
                >
                  ::
                </span>
              </td>
              <td className={CELL}>
                <TextField
                  fullWidth
                  size="small"
                  value={option.name}
                  onChange={(e) => update(option, { name: e.target.value })}
                  error={!!optionErrors?.name}
                  helperText={optionErrors?.name}
                  slotProps={{ htmlInput: { 'aria-label': `${label} 이름` } }}
                />
              </td>
              <td className={CELL}>
                <TextField
                  fullWidth
                  size="small"
                  value={option.description}
                  onChange={(e) =>
                    update(option, { description: e.target.value })
                  }
                  error={!!optionErrors?.description}
                  helperText={optionErrors?.description}
                  slotProps={{ htmlInput: { 'aria-label': `${label} 설명` } }}
                />
              </td>
              <td className={CELL}>
                <PriceTextField
                  fullWidth
                  size="small"
                  inputLabel={`${label} 추가 금액`}
                  value={option.additionalPrice}
                  onChange={(price) =>
                    update(option, { additionalPrice: price })
                  }
                  error={!!optionErrors?.additionalPrice}
                  helperText={optionErrors?.additionalPrice}
                />
              </td>
              <td className={CELL}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="없음"
                  value={option.badge}
                  onChange={(e) => update(option, { badge: e.target.value })}
                  error={!!optionErrors?.badge}
                  helperText={optionErrors?.badge}
                  slotProps={{ htmlInput: { 'aria-label': `${label} 배지` } }}
                />
              </td>
              <td className={CELL}>
                <Switch
                  checked={option.isVisible}
                  onChange={(e) =>
                    update(option, { isVisible: e.target.checked })
                  }
                  inputProps={{ 'aria-label': `${label} 노출` }}
                />
              </td>
              <td className={CELL}>
                <button
                  type="button"
                  className="text-xxsmall12 text-neutral-40 leading-10"
                  aria-label={`${label} 삭제`}
                  onClick={() => onDelete(option)}
                >
                  삭제
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OptionTable;
