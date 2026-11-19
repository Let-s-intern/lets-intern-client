import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import {
  MERGE_CHALLENGES_HELP,
  MERGE_CHALLENGES_LABEL,
} from '../constants/wording';
import { useSavePlacements } from '../hooks/useSavePlacements';
import AdvancedArea from '../ui/AdvancedArea';
import PageAddressField from '../ui/PageAddressField';
import {
  draftsWith,
  draftsWithout,
  isDraftInvalid,
  type LandingPage,
} from '../utils/placementUtils';

/** 랜딩 페이지 주소·챌린지 묶기·내리기. 노출 위치 저장 API 로 이 자리만 바꿔 보낸다 */
const LandingSettingsDialog = ({
  page,
  onClose,
}: {
  page: LandingPage;
  onClose: () => void;
}) => {
  const { save, isPending } = useSavePlacements();
  const [slug, setSlug] = useState(page.slug);
  const [mergeChallenges, setMergeChallenges] = useState(page.mergeChallenges);
  const [submitted, setSubmitted] = useState(false);
  const otherPlacements = (page.group.placements ?? []).length - 1;

  const submit = async () => {
    setSubmitted(true);
    const invalid = isDraftInvalid({
      placementType: 'LANDING',
      slug,
      mergeChallenges,
      matchMode: 'ANY',
    });
    if (invalid) return;
    const ok = await save(
      page.group.id,
      draftsWith(page.group, page.placementIndex, { slug, mergeChallenges }),
    );
    if (ok) onClose();
  };

  const remove = async () => {
    if (
      !window.confirm(
        `/category/${page.slug} 랜딩 페이지를 내립니다. 섹션과 상품 연결은 그대로 남습니다. 내릴까요?`,
      )
    )
      return;
    if (
      await save(page.group.id, draftsWithout(page.group, page.placementIndex))
    )
      onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>페이지 설정</DialogTitle>
      <DialogContent className="flex flex-col gap-4 !pt-2">
        <PageAddressField
          value={slug}
          onChange={setSlug}
          required
          showErrors={submitted}
          helperText="바꾸면 예전 주소는 열리지 않습니다."
        />
        <div>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={mergeChallenges}
                onChange={(e) => setMergeChallenges(e.target.checked)}
              />
            }
            label={
              <span className="text-xsmall14">{MERGE_CHALLENGES_LABEL}</span>
            }
          />
          <p className="ml-8 text-xxsmall12 text-neutral-40">
            {MERGE_CHALLENGES_HELP}
          </p>
        </div>
        <AdvancedArea>
          <p className="text-xxsmall12 text-neutral-40">
            섹션은 &quot;{page.group.title}&quot; 노출 목록의 카테고리입니다.
            {otherPlacements > 0 &&
              ` 이 목록은 다른 곳 ${otherPlacements}군데에도 보여, 섹션을 고치면 함께 바뀝니다.`}
          </p>
          <div>
            <Button
              size="small"
              color="error"
              disabled={isPending}
              onClick={remove}
            >
              이 랜딩 페이지 내리기
            </Button>
          </div>
        </AdvancedArea>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={isPending} onClick={submit}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LandingSettingsDialog;
