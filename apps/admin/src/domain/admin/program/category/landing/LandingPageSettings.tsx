import { Button, Checkbox, FormControlLabel } from '@mui/material';
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

/** 랜딩 페이지 주소와 챌린지 묶기. 노출 위치 저장 API 로 이 자리만 바꿔 보낸다 */
const LandingPageSettings = ({ page }: { page: LandingPage }) => {
  const { save, isPending } = useSavePlacements();
  const [slug, setSlug] = useState(page.slug);
  const [mergeChallenges, setMergeChallenges] = useState(page.mergeChallenges);
  const changed =
    slug !== page.slug || mergeChallenges !== page.mergeChallenges;
  const otherPlacements = (page.group.placements ?? []).length - 1;

  const remove = () => {
    if (
      !window.confirm(
        `/category/${page.slug} 랜딩 페이지를 내립니다. 섹션과 상품 연결은 그대로 남습니다. 내릴까요?`,
      )
    )
      return;
    save(page.group.id, draftsWithout(page.group, page.placementIndex));
  };

  return (
    <div className="flex flex-col gap-3 rounded-xs bg-neutral-95 p-3">
      <PageAddressField
        value={slug}
        onChange={setSlug}
        required
        helperText="사이트에서 이 주소로 열립니다. 바꾸면 예전 주소는 열리지 않습니다."
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
      <div className="flex gap-2">
        <Button
          variant="contained"
          size="small"
          disabled={
            !changed ||
            isPending ||
            isDraftInvalid({
              placementType: 'LANDING',
              slug,
              mergeChallenges,
              matchMode: 'ANY',
            })
          }
          onClick={() =>
            save(
              page.group.id,
              draftsWith(page.group, page.placementIndex, {
                slug,
                mergeChallenges,
              }),
            )
          }
        >
          페이지 설정 저장
        </Button>
      </div>
      <AdvancedArea>
        <p className="text-xxsmall12 text-neutral-40">
          이 페이지의 섹션은 &quot;{page.group.title}&quot; 노출 목록의
          카테고리입니다.
          {otherPlacements > 0 &&
            ` 이 노출 목록은 다른 곳 ${otherPlacements}군데에도 보입니다. 섹션을 고치면 그곳도 함께 바뀝니다.`}
        </p>
        <div>
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={isPending}
            onClick={remove}
          >
            이 랜딩 페이지 내리기
          </Button>
        </div>
      </AdvancedArea>
    </div>
  );
};

export default LandingPageSettings;
