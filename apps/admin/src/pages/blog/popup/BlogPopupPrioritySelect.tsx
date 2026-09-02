import { useGetAdminBlogPopupList } from '@/api/blog/blogPopup';
import { IPageable } from '@/types/interface';
import { MenuItem, TextField } from '@mui/material';
import { useMemo } from 'react';
import { PRIORITY_NONE_LABEL, PRIORITY_OPTIONS } from './blogPopupForm';

/**
 * 우선순위는 팝업 전체에서 겹치면 안 되므로 목록을 한 번에 받아 이미 쓰인 숫자를 가린다.
 * 페이지를 나눠 받으면 다른 페이지의 숫자를 모른 채 고르게 된다.
 */
const POPUP_LIST_PAGEABLE: IPageable = { page: 1, size: 500 };

/**
 * 선택 없음을 나타내는 select 값. 빈 문자열을 쓰면 MUI 가 값이 없는 것으로 보아
 * 라벨이 겹치고 "없음" 이 화면에 뜨지 않는다.
 */
const NONE_VALUE = 'NONE';

const PRIORITY_HELPER_TEXT =
  '숫자가 작을수록 먼저 노출됩니다. 없음으로 두면 숫자가 지정된 팝업보다 뒤로 밀립니다.';

interface BlogPopupPrioritySelectProps {
  value: number | null;
  onChange: (priority: number | null) => void;
  /** 수정 화면의 자기 자신. 자기가 이미 쓰는 숫자는 막지 않는다. */
  excludeBlogPopupId?: number;
}

export default function BlogPopupPrioritySelect({
  value,
  onChange,
  excludeBlogPopupId,
}: BlogPopupPrioritySelectProps) {
  const { data } = useGetAdminBlogPopupList(POPUP_LIST_PAGEABLE);

  /** 이미 쓰인 숫자 -> 그 숫자를 쓰는 팝업 제목. 없음은 여럿이 함께 쓸 수 있어 담지 않는다. */
  const takenBy = useMemo(() => {
    const taken = new Map<number, string>();

    for (const popup of data?.blogPopupList ?? []) {
      if (popup.priority == null) continue;
      if (popup.blogPopupId === excludeBlogPopupId) continue;
      taken.set(popup.priority, popup.title ?? '제목 없음');
    }

    return taken;
  }, [data, excludeBlogPopupId]);

  const options = useMemo(
    () =>
      PRIORITY_OPTIONS.map((priority) => {
        const takenTitle = takenBy.get(priority);

        return (
          <MenuItem key={priority} value={priority} disabled={!!takenTitle}>
            {takenTitle ? `${priority} (사용 중: ${takenTitle})` : priority}
          </MenuItem>
        );
      }),
    [takenBy],
  );

  return (
    <TextField
      select
      className="w-full"
      variant="outlined"
      name="priority"
      label="노출 우선순위"
      helperText={PRIORITY_HELPER_TEXT}
      value={value ?? NONE_VALUE}
      onChange={(e) =>
        onChange(e.target.value === NONE_VALUE ? null : Number(e.target.value))
      }
    >
      <MenuItem value={NONE_VALUE}>{PRIORITY_NONE_LABEL}</MenuItem>
      {options}
    </TextField>
  );
}
