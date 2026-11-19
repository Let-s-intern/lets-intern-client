import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';
import { useSavePlacements } from '../hooks/useSavePlacements';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import PageAddressField from '../ui/PageAddressField';
import { draftsAppended, isDraftInvalid } from '../utils/placementUtils';

/** 노출 목록 하나를 새 주소의 랜딩 페이지로 붙인다. 목록의 카테고리가 섹션이 된다 */
const AddLandingDialog = ({
  groups,
  onClose,
}: {
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const { save, isPending } = useSavePlacements();
  const [groupId, setGroupId] = useState<number | ''>('');
  const [slug, setSlug] = useState('');
  // 오류는 추가를 누른 뒤에 보인다
  const [submitted, setSubmitted] = useState(false);
  const group = groups.find((g) => g.id === groupId);
  const draft = {
    placementType: 'LANDING' as const,
    slug,
    mergeChallenges: true,
    matchMode: 'ANY' as const,
  };

  const add = async () => {
    setSubmitted(true);
    if (!group || isDraftInvalid(draft)) return;
    if (await save(group.id, draftsAppended(group, draft))) onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>랜딩 페이지 추가</DialogTitle>
      <DialogContent className="flex flex-col gap-4 !pt-2">
        <FormControl size="small" error={submitted && !group}>
          <Select
            displayEmpty
            value={groupId}
            onChange={(e) => setGroupId(e.target.value as number | '')}
          >
            <MenuItem value="" disabled>
              섹션으로 쓸 노출 목록
            </MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.title} (카테고리 {g.categoryList.length}개)
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {submitted && !group
              ? '노출 목록을 고르세요'
              : '목록의 카테고리가 섹션이 됩니다. 새 목록은 고급 설정에서 만듭니다.'}
          </FormHelperText>
        </FormControl>
        <PageAddressField
          value={slug}
          onChange={setSlug}
          required
          showErrors={submitted}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={isPending} onClick={add}>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLandingDialog;
