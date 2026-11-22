'use client';

import { ChallengeIdPrimitive } from '@/schema';
import { ReactNode } from 'react';
import FollowApplyPanel from './challenge-view/apply-header/FollowApplyPanel';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import { useChallengeDetailView } from './useChallengeDetailView';

interface Props {
  challenge: ChallengeIdPrimitive;
  /** 본문 오른쪽에 따라오는 신청 패널을 둘지. 무료 템플릿 상세는 상단 신청 영역만 둔다 */
  showPanel?: boolean;
  children: ReactNode;
}

/**
 * 직무(HR·마케팅·PM) 챌린지 상세의 공통 틀.
 * 새 상단 신청 영역과, 1025px 이상에서 본문 오른쪽에 따라오는 신청 패널을 ChallengeView 와 똑같이 쓴다.
 * 1024px 까지는 패널 대신 하단 플로팅 신청 바가 나온다.
 */
const ChallengeApplyLayout = ({
  challenge,
  showPanel = true,
  children,
}: Props) => {
  const { id, activeChallengeList, challengeTransformed } =
    useChallengeDetailView(challenge);

  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col px-5 pb-10 pt-6 md:gap-y-5 md:px-10 md:py-[60px] xl:px-0">
        <ChallengeBasicInfo
          challengeId={id}
          challenge={challengeTransformed}
          activeChallengeList={activeChallengeList?.challengeList}
        />
      </div>
      {showPanel ? (
        <div className="mx-auto flex w-full max-w-[1160px] min-[1025px]:gap-8 min-[1025px]:px-10 xl:px-0">
          <div className="min-w-0 flex-1">{children}</div>
          <div className="hidden w-[320px] shrink-0 pt-28 min-[1025px]:block">
            <FollowApplyPanel
              challenge={challengeTransformed}
              challengeId={id}
              activeChallengeList={activeChallengeList?.challengeList}
            />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-hidden">{children}</div>
      )}
    </div>
  );
};

export default ChallengeApplyLayout;
