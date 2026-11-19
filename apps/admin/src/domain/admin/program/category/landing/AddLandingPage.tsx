import { Button, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useSavePlacements } from '../hooks/useSavePlacements';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import PageAddressField from '../ui/PageAddressField';
import { draftsAppended, isDraftInvalid } from '../utils/placementUtils';

/** 노출 목록 하나를 새 주소의 랜딩 페이지로 붙인다. 목록의 카테고리가 섹션이 된다 */
const AddLandingPage = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const { save, isPending } = useSavePlacements();
  const [groupId, setGroupId] = useState<number | ''>('');
  const [slug, setSlug] = useState('');
  const group = groups.find((g) => g.id === groupId);
  const draft = {
    placementType: 'LANDING' as const,
    slug,
    mergeChallenges: true,
    matchMode: 'ANY' as const,
  };

  const add = async () => {
    if (!group) return;
    if (await save(group.id, draftsAppended(group, draft))) {
      setGroupId('');
      setSlug('');
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xs border border-dashed border-neutral-80 p-3">
      <p className="text-xsmall14 font-semibold text-neutral-10">
        랜딩 페이지 추가
      </p>
      <p className="text-xxsmall12 text-neutral-40">
        노출 목록을 고르면 그 안의 카테고리가 이 페이지의 섹션이 됩니다. 새
        목록은 &quot;고급 설정&quot; 탭에서 만듭니다.
      </p>
      <Select
        size="small"
        displayEmpty
        value={groupId}
        onChange={(e) => setGroupId(e.target.value as number | '')}
      >
        <MenuItem value="" disabled>
          노출 목록 고르기
        </MenuItem>
        {groups.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.title} (카테고리 {g.categoryList.length}개)
          </MenuItem>
        ))}
      </Select>
      <PageAddressField
        value={slug}
        onChange={setSlug}
        required
        helperText="사이트에서 이 주소로 열립니다."
      />
      <div>
        <Button
          variant="outlined"
          size="small"
          disabled={!group || isDraftInvalid(draft) || isPending}
          onClick={add}
        >
          추가
        </Button>
      </div>
    </div>
  );
};

export default AddLandingPage;
