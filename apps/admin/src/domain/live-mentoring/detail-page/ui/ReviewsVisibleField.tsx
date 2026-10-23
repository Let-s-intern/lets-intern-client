import { Checkbox, FormControlLabel } from '@mui/material';

import type { AdminLiveMentoringDetailPageUpdate } from '@/api/live-mentoring/liveMentoringDetailPageSchema';

type Reviews = AdminLiveMentoringDetailPageUpdate['reviews'];

interface Props {
  value: Reviews;
  onChange: (next: Reviews) => void;
}

/** 후기 섹션 노출. 어떤 후기를 어떤 순서로 보일지는 멘토 상세의 「후기 노출」 에서 정한다 */
export default function ReviewsVisibleField({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <FormControlLabel
        control={
          <Checkbox
            checked={value.visible}
            onChange={(e) => onChange({ ...value, visible: e.target.checked })}
          />
        }
        label="상세페이지에 후기 섹션 표시"
      />
      <p className="text-xsmall14 text-neutral-40">
        개별 후기의 노출과 순서는 멘토 상세 화면의 후기 노출에서 관리합니다.
      </p>
    </div>
  );
}
