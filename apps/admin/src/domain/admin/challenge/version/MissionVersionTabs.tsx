import { ChallengeVersion } from '@/schema';
import { Tab, Tabs, Typography } from '@mui/material';

interface Props {
  versions: Pick<ChallengeVersion, 'challengeVersionId' | 'title'>[];
  /** null 은 전체 */
  value: number | null;
  onChange: (versionId: number | null) => void;
}

/**
 * 미션 등록·제출확인의 전체/버전별 보기 탭 (LC-3505). 버전이 없는 챌린지에서는 그리지 않는다.
 * 버전 탭은 그 버전 참여자가 받는 미션(공통 + 그 버전 미션)을 보여준다.
 */
function MissionVersionTabs({ versions, value, onChange }: Props) {
  if (versions.length === 0) return null;

  const selected = versions.find((v) => v.challengeVersionId === value);

  return (
    <div className="mb-3">
      <Tabs
        value={selected ? selected.challengeVersionId : 'all'}
        onChange={(_, next: number | 'all') =>
          onChange(next === 'all' ? null : next)
        }
        variant="scrollable"
        className="border-b border-gray-200"
      >
        <Tab label="전체" value="all" />
        {versions.map((version) => (
          <Tab
            key={version.challengeVersionId}
            label={version.title}
            value={version.challengeVersionId}
          />
        ))}
      </Tabs>
      {selected && (
        <Typography
          variant="caption"
          color="text.secondary"
          component="p"
          className="mt-1"
        >
          {selected.title} 참여자가 받는 미션입니다. 공통 미션과{' '}
          {selected.title} 전용 미션을 함께 보여줍니다.
        </Typography>
      )}
    </div>
  );
}

export default MissionVersionTabs;
