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
 * 버전이 있으면 프로그램 소개를 기본·버전별 탭으로 나눈다 (LC-3505).
 * 기본 탭은 버전 설명의 원본(폼)으로 쓰고 상세 페이지에는 보이지 않는다.
 * 버전이 없으면 챌린지 본문 편집부를 그대로 보여준다.
 */
function ChallengeDescriptionTabs({
  versions,
  onChangeVersionDescription,
  challengeContent,
  challengeType,
  children,
}: Props) {
  // 0 은 기본, i + 1 은 i 번째 버전
  const [selected, setSelected] = useState(1);

  if (versions.length === 0) return <>{children}</>;

  // 선택한 버전이 지워지면 기본 탭으로 돌아간다
  const tab = selected <= versions.length ? selected : 0;
  const index = tab - 1;
  const version = versions[index];

  return (
    <section className="border-neutral-80 mb-6 rounded-md border p-4">
      <Heading2>버전별 프로그램 소개</Heading2>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        className="mb-3"
      >
        이 상자 안(인트로부터 블로그 후기까지)은 버전마다 따로 씁니다. FAQ 는
        상자 밖에서 모든 버전이 함께 씁니다. 기본 탭은 버전 설명을 쓰기 위한
        원본이고 따로 노출되는 페이지가 없습니다. 작성 전인 버전은 기본 탭
        내용으로 보입니다.
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value: number) => setSelected(value)}
        variant="scrollable"
        className="border-neutral-80 mb-4 border-b"
      >
        <Tab label="기본 (버전 설정 시 비노출)" />
        {versions.map((v, i) => (
          <Tab key={i} label={versionTabLabel(v, i)} />
        ))}
      </Tabs>
      {version ? (
        <ChallengeVersionContentEditor
          key={index}
          description={version.description ?? JSON.stringify(challengeContent)}
          challengeType={challengeType}
          onChange={(description) =>
            onChangeVersionDescription(index, description)
          }
        />
      ) : (
        children
      )}
    </section>
  );
}

export default ChallengeDescriptionTabs;
