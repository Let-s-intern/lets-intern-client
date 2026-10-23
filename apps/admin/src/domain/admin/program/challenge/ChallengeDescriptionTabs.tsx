import { ChallengeVersionDraft } from '@/domain/admin/program/challenge/ChallengeVersionSection';
import ChallengeVersionContentEditor from '@/domain/admin/program/challenge/ChallengeVersionContentEditor';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ChallengeType } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { Tab, Tabs, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

interface Props {
  versions: ChallengeVersionDraft[];
  onChangeVersionDescription: (index: number, description: string) => void;
  /** 아직 설명을 쓰지 않은 버전의 시작값. 서버도 버전 설명이 비면 이 챌린지 본문을 보여준다 */
  challengeContent: ChallengeContent;
  challengeType?: ChallengeType;
  /** 버전이 없을 때 그리는 챌린지 본문 편집부 */
  children: ReactNode;
}

export const versionTabLabel = (
  version: ChallengeVersionDraft,
  index: number,
) =>
  `${version.title.trim() || `${index + 1}번 버전`}${version.description === null ? ' (작성 전)' : ''}`;

/**
 * 버전이 있으면 프로그램 소개를 버전별 탭으로만 쓴다 (LC-3505).
 * 버전마다 상세 페이지가 따로라 챌린지 공통 본문은 편집하지 않는다.
 * 버전이 없으면 챌린지 본문 편집부를 그대로 보여준다.
 */
function ChallengeDescriptionTabs({
  versions,
  onChangeVersionDescription,
  challengeContent,
  challengeType,
  children,
}: Props) {
  const [selected, setSelected] = useState(0);

  if (versions.length === 0) return <>{children}</>;

  // 선택한 버전이 지워지면 첫 버전으로 돌아간다
  const index = selected < versions.length ? selected : 0;
  const version = versions[index];

  return (
    <>
      <Heading2>프로그램 소개</Heading2>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        className="mb-3"
      >
        버전이 있으면 상세 페이지는 버전마다 따로 보입니다. 버전별로 설명을
        작성하세요. 작성 전인 버전은 기존 챌린지 설명으로 시작하고, 고치지
        않으면 그 설명이 그대로 보입니다.
      </Typography>
      <Tabs
        value={index}
        onChange={(_, value: number) => setSelected(value)}
        variant="scrollable"
        className="border-neutral-80 mb-4 border-b"
      >
        {versions.map((v, i) => (
          <Tab key={i} label={versionTabLabel(v, i)} />
        ))}
      </Tabs>
      <ChallengeVersionContentEditor
        key={index}
        description={version.description ?? JSON.stringify(challengeContent)}
        challengeType={challengeType}
        onChange={(description) =>
          onChangeVersionDescription(index, description)
        }
      />
    </>
  );
}

export default ChallengeDescriptionTabs;
