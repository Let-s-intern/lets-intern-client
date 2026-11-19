import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSavePlacements } from '../hooks/useSavePlacements';
import {
  useAdminProgramCategoryGroupsQuery,
  useCreateProgramCategoryGroup,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import PageAddressField from '../ui/PageAddressField';
import {
  draftsAppended,
  EMPTY_LANDING_MENU,
  findCreatedGroup,
  isDraftInvalid,
  landingPagesOf,
  type LandingMenuDraft,
} from '../utils/placementUtils';
import LandingMenuFields from './LandingMenuFields';

type Source = 'new' | 'existing';

/**
 * 랜딩 페이지 추가. 새 이름으로 노출 목록을 만들거나 있는 목록을 골라, 주소를 붙인다.
 * 목록 생성 API 가 새 id 를 주지 않아 목록을 다시 받아 같은 이름 중 가장 큰 id 를 쓴다
 */
const AddLandingDialog = ({
  groups,
  onClose,
}: {
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const { save, isPending } = useSavePlacements();
  const createGroup = useCreateProgramCategoryGroup();
  const { refetch } = useAdminProgramCategoryGroupsQuery();
  const [source, setSource] = useState<Source>('new');
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState<number | ''>('');
  const [slug, setSlug] = useState('');
  const [menu, setMenu] = useState<LandingMenuDraft>(EMPTY_LANDING_MENU);
  // 오류는 추가를 누른 뒤에 보인다
  const [submitted, setSubmitted] = useState(false);
  const group = groups.find((g) => g.id === groupId);
  const draft = {
    placementType: 'LANDING' as const,
    slug,
    mergeChallenges: true,
    matchMode: 'ANY' as const,
    ...menu,
  };
  // 이미 쓰는 주소면 목록을 만들기 전에 막는다. 빈 목록만 남는 것을 피한다
  const slugTaken = landingPagesOf(groups).some((p) => p.slug === slug);
  const trimmedTitle = title.trim();
  const busy = isPending || createGroup.isPending;

  const add = async () => {
    setSubmitted(true);
    if (isDraftInvalid(draft) || slugTaken) return;
    if (source === 'existing') {
      if (!group) return;
      if (await save(group.id, draftsAppended(group, draft))) onClose();
      return;
    }
    if (!trimmedTitle) return;
    try {
      await createGroup.mutateAsync({ title: trimmedTitle });
    } catch {
      snackbar('노출 목록을 만들지 못했습니다.');
      return;
    }
    const { data: fresh = [] } = await refetch();
    const created = findCreatedGroup(groups, fresh, trimmedTitle);
    if (!created) {
      snackbar(
        '목록은 만들었지만 찾지 못했습니다. 고급 설정 탭에서 확인하세요.',
      );
      onClose();
      return;
    }
    if (await save(created.id, draftsAppended(created, draft))) {
      onClose();
      return;
    }
    // 목록은 생겼고 주소만 실패했다. 그 목록을 고른 채로 다시 시도하게 한다
    setSource('existing');
    setGroupId(created.id);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>랜딩 페이지 추가</DialogTitle>
      <DialogContent className="flex flex-col gap-3 !pt-1">
        <RadioGroup
          row
          value={source}
          onChange={(e) => setSource(e.target.value as Source)}
        >
          <FormControlLabel
            value="new"
            control={<Radio size="small" />}
            label={<span className="text-xsmall14">새로 만들기</span>}
          />
          <FormControlLabel
            value="existing"
            control={<Radio size="small" />}
            label={<span className="text-xsmall14">있는 목록 쓰기</span>}
          />
        </RadioGroup>
        {source === 'new' ? (
          <TextField
            size="small"
            label="페이지 이름"
            placeholder="예: 이력서"
            value={title}
            inputProps={{ maxLength: 30 }}
            onChange={(e) => setTitle(e.target.value)}
            error={submitted && !trimmedTitle}
            helperText={
              submitted && !trimmedTitle
                ? '이름을 넣어 주세요'
                : '같은 이름의 노출 목록이 새로 생기고, 섹션은 그 안에 만듭니다.'
            }
          />
        ) : (
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
                : '목록의 카테고리가 섹션이 됩니다.'}
            </FormHelperText>
          </FormControl>
        )}
        <PageAddressField
          value={slug}
          onChange={setSlug}
          required
          showErrors={submitted}
          externalError={slugTaken ? '이미 쓰고 있는 주소예요' : undefined}
        />
        <div className="border-t border-neutral-90 pt-3">
          <LandingMenuFields
            value={menu}
            onChange={setMenu}
            groups={groups}
            defaultLabel={
              source === 'new' ? trimmedTitle : (group?.title ?? '')
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={busy} onClick={add}>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLandingDialog;
