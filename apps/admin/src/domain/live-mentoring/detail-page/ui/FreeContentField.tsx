import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import type {
  DetailPageFreeContent,
  FreeContentPosition,
} from '@/api/live-mentoring/liveMentoringDetailPageSchema';
import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';

/** 공개 상세페이지의 섹션 순서. 자유 입력란은 고른 섹션 바로 뒤에 들어간다 */
const SECTIONS: { label: string; position: FreeContentPosition | null }[] = [
  { label: '핵심 소개', position: null },
  { label: '멘토 소개', position: 'AFTER_INTRO' },
  { label: '멘토링 유형', position: 'AFTER_MENTORING_TYPES' },
  { label: '취업 성공 전략', position: 'AFTER_STRATEGY' },
  { label: '소개 영상', position: 'AFTER_VIDEO' },
  { label: '결과 사례', position: 'AFTER_RESULTS' },
  { label: '후기', position: 'AFTER_REVIEWS' },
  { label: '플랜', position: 'AFTER_PLAN' },
  { label: '진행 프로세스 · FAQ', position: null },
];

const POSITION_OPTIONS = SECTIONS.flatMap(({ label, position }) =>
  position ? [{ position, label: `${label} 뒤` }] : [],
);

interface Props {
  value: DetailPageFreeContent;
  onChange: (next: DetailPageFreeContent) => void;
}

/**
 * 자유 입력란 — 운영이 상세페이지에 직접 넣는 글·이미지. 멘토 앱에는 이 탭이 없다.
 *
 * `EditorApp` 은 초기값만 읽는 비제어 컴포넌트라, 값을 되돌릴 때는 부모가 `key` 로 다시 마운트한다.
 * 이미지는 에디터의 이미지 버튼이 `POST /file` 로 올린다.
 */
export default function FreeContentField({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <FormControlLabel
        control={
          <Checkbox
            checked={value.visible}
            onChange={(e) => onChange({ ...value, visible: e.target.checked })}
          />
        }
        label="상세페이지에 표시"
      />

      <FormControl size="small" className="max-w-sm">
        <InputLabel id="free-content-position">배치 위치</InputLabel>
        <Select
          labelId="free-content-position"
          label="배치 위치"
          value={value.position}
          onChange={(e) =>
            onChange({
              ...value,
              position: e.target.value as FreeContentPosition,
            })
          }
        >
          {POSITION_OPTIONS.map((option) => (
            <MenuItem key={option.position} value={option.position}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ol className="text-xsmall14 text-neutral-30 flex flex-col gap-1">
        {SECTIONS.map(({ label, position }) => (
          <li key={label} className="flex flex-col gap-1">
            <span>{label}</span>
            {position === value.position ? (
              <span className="text-primary font-semibold">자유 입력란</span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="text-xxsmall12 text-neutral-40">
        기준 섹션을 꺼도 자리는 그대로입니다.
      </p>

      <div>
        <span className="text-xsmall14 text-neutral-30 mb-1 block font-medium">
          본문
        </span>
        <EditorApp
          initialEditorStateJsonString={value.content || emptyEditorState}
          onChange={(content) => onChange({ ...value, content })}
        />
      </div>
      <p className="text-xxsmall12 text-neutral-40">
        멘토가 멘토 앱에서 상세페이지를 저장해도 자유 입력란은 유지됩니다.
      </p>
    </div>
  );
}
