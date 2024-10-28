import { ChallengeIdSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import Header from '@components/common/program/program-detail/header/Header';
import { useMemo } from 'react';
import ChallengePointView from './challenge-view/ChallengePointView';

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
    <div>
      <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>
      <div className="px-5 lg:px-10 xl:px-52">
        <Header programTitle={challenge.title ?? ''} />
        <div>네비게이션 바</div>
        <ChallengePointView point={receivedContent.challengePoint} />
        <div>특별 챌린지</div>
        <div>합격자 후기</div>
        <div>프로그램 소개 평균 10초</div>
        <div>평균 서류 합격률 28%</div>
        <div>취업 준비 현황 체크리스트</div>
        <div>
          이 모든 고민을 한번에 해결! 서류 합격률을 300% 높일 수 있는 렛츠커리어
          챌린지
        </div>
        <div>커리큘럼</div>
        <div>차별점</div>
        <div>여기서 끝이 아니죠 챌린지 참여자만을 위한 트리플 혜택!</div>
        <div>누적 참여자 1,900+명 참여 만족도 4.9점</div>
        <div>후기</div>
        <div>블로그 후기</div>
        <div>faq</div>
        <div>모집 개요</div>
      </div>
    </div>
  );
};

export default ChallengeView;
