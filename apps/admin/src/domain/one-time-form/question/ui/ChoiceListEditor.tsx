import { FormHelperText, TextField } from '@mui/material';

import { QUESTION_LIMITS } from '../constants/questionTypes';
import { useDragReorder } from '../hooks/useDragReorder';

interface ChoiceListEditorProps {
  choices: string[];
  error?: string;
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

/** 라디오·드롭다운·체크박스의 선택지. `::` 를 끌어 순서를 바꾼다(시안 7절 옵션 행) */
const ChoiceListEditor = ({
  choices,
  error,
  onAdd,
  onChange,
  onRemove,
  onMove,
}: ChoiceListEditorProps) => {
  const { getHandleProps, getDropProps } = useDragReorder(onMove);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xxsmall12 text-neutral-40 font-medium">선택지</p>
      <ul className="flex flex-col gap-2">
        {choices.map((choice, index) => (
          // 선택지는 문자열뿐이라 고유 키가 없다. 값은 상태에서 받으므로 위치 키로 충분하다
          <li
            key={index}
            className="flex items-center gap-2"
            {...getDropProps(index)}
          >
            <span
              className="text-neutral-40 cursor-grab select-none px-1"
              aria-label={`선택지 ${index + 1} 끌어서 순서 바꾸기`}
              {...getHandleProps(index)}
            >
              ::
            </span>
            <TextField
              className="flex-1"
              size="small"
              placeholder={`선택지 ${index + 1}`}
              value={choice}
              onChange={(e) => onChange(index, e.target.value)}
              slotProps={{
                htmlInput: { 'aria-label': `선택지 ${index + 1}` },
              }}
            />
            <button
              type="button"
              className="text-xxsmall12 text-neutral-40 px-2"
              aria-label={`선택지 ${index + 1} 삭제`}
              onClick={() => onRemove(index)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      {error && <FormHelperText error>{error}</FormHelperText>}
      {choices.length < QUESTION_LIMITS.choiceCount && (
        <button
          type="button"
          className="text-xsmall14 border-neutral-80 text-neutral-0 self-start rounded-md border border-dashed px-4 py-2"
          onClick={onAdd}
        >
          선택지 추가
        </button>
      )}
    </div>
  );
};

export default ChoiceListEditor;
