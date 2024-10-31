import { ChallengeIdSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengeCheckList from '@components/challenge-view/ChallengeCheckList';
import ChallengeCurriculum from '@components/challenge-view/ChallengeCurriculum';
import ChallengeFaq from '@components/challenge-view/ChallengeFaq';
import ChallengeIntro from '@components/challenge-view/ChallengeIntro';
import ChallengeResult from '@components/challenge-view/ChallengeResult';
import Header from '@components/common/program/program-detail/header/Header';
import { useMemo } from 'react';
import ChallengeBasicInfo from './challenge-view/ChallengeBasicInfo';
import ChallengeNavigation, {
  challengeNavigateItems,
} from './challenge-view/ChallengeNavigation';
import ChallengePointView from './challenge-view/ChallengePointView';
import LexicalContent from './common/blog/LexicalContent';

const ChallengeView: React.FC<{ challenge: ChallengeIdSchema }> = ({
  challenge,
}) => {
  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return { initialized: false };
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return { initialized: false };
    }
  }, [challenge.desc]);

  return (
    <div className="flex w-full flex-col">
      <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>
      <div>
        <div className="flex w-full flex-col px-5 lg:px-10 xl:px-52">
          <Header programTitle={challenge.title ?? ''} />
          <ChallengeBasicInfo challenge={challenge} />
        </div>

        <ChallengeNavigation navItems={challengeNavigateItems} />
        <div className="flex w-full flex-col overflow-x-hidden px-5 lg:px-10 xl:px-52">
          <ChallengePointView
            className="mb-14 sm:mb-44"
            point={receivedContent.challengePoint}
          />

          <div>특별 챌린지, 합격자 후기 (TODO: 본 제목 삭제)</div>
          <div>
            {receivedContent.mainDescription?.root ? (
              <LexicalContent node={receivedContent.mainDescription?.root} />
            ) : null}
          </div>

          <section className="lg:py-50 lg:gap-50 flex flex-col gap-20 py-16">
            <ChallengeIntro />
            <ChallengeCheckList />
            <ChallengeResult />
          </section>

          <ChallengeCurriculum
            curriculum={JSON.parse(challenge.desc ?? '{}').curriculum}
          />

          <div>
            <ChallengeFaq />
          </div>

          <div>
            이 모든 고민을 한번에 해결! 서류 합격률을 300% 높일 수 있는
            렛츠커리어 챌린지
          </div>
          <div>차별점</div>
          <div>여기서 끝이 아니죠 챌린지 참여자만을 위한 트리플 혜택!</div>
          <div>누적 참여자 1,900+명 참여 만족도 4.9점</div>
          <div>후기</div>
          <div>블로그 후기</div>
          <div>모집 개요</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
