import { josa } from 'es-hangul';
import { useEffect } from 'react';
import ReviewInstruction from '../ReviewInstruction';
import ReviewTextarea from '../ReviewTextarea';
import TenScore from '../score/TenScore';
import YesNoScore from '../score/YesNoScore';

interface TenScoreSectionProps {
  programTitle?: string | null;
  tenScore: number | null;
  setTenScore: (tenScore: number | null) => void;
  hasRecommendationExperience: boolean | null;
  setHasRecommendationExperience: (
    hasRecommendationExperience: boolean | null,
  ) => void;
  npsAns: string;
  setNpsAns: (npsAns: string) => void;
}

const getMode = (
  tenScore: number | null,
  hasRecommendationExperience: boolean | null,
) => {
  if (tenScore === null) {
    return null;
  }
  if (tenScore <= 6) {
    return 'nps_low';
  }
  if (hasRecommendationExperience === null) {
    return null;
  }

  return hasRecommendationExperience
    ? 'nps_yes_recommendation'
    : 'nps_no_recommendation';
};

const RecommendReviewField = ({
  programTitle,
  tenScore,
  setTenScore,
  hasRecommendationExperience,
  setHasRecommendationExperience,
  npsAns,
  setNpsAns,
}: TenScoreSectionProps) => {
  useEffect(() => {
    if (tenScore !== null && tenScore <= 6) {
      setHasRecommendationExperience(null);
    }
  }, [tenScore, setHasRecommendationExperience, setNpsAns]);

  return (
    <div className="flex flex-col gap-6">
      <TenScore
        tenScore={tenScore}
        setTenScore={(value) => {
          const prevMode = getMode(tenScore, hasRecommendationExperience);
          const nextMode = getMode(value, hasRecommendationExperience);
          if (prevMode !== nextMode) {
            setNpsAns('');
          }
          setTenScore(value);
        }}
      />

      {tenScore !== null &&
        (tenScore > 6 ? (
          <>
            <div className="flex flex-col gap-3">
              <ReviewInstruction required>
                실제로 {josa(programTitle ?? '', '을/를')} 친구/지인에게
                추천해보신 경험이 있으신가요?
              </ReviewInstruction>
              <YesNoScore
                hasRecommendationExperience={hasRecommendationExperience}
                setHasRecommendationExperience={(value) => {
                  setNpsAns('');
                  setHasRecommendationExperience(value);
                }}
              />
            </div>

            {hasRecommendationExperience !== null &&
              (hasRecommendationExperience ? (
                <div className="flex flex-col gap-2">
                  <ReviewInstruction required>
                    친구/지인에게 어떤 부분을 이야기 하면서 추천하셨나요?
                  </ReviewInstruction>
                  <ReviewTextarea
                    placeholder="친구/지인에게 이야기한다고 생각하며 편하게 작성해주세요!"
                    value={npsAns}
                    onChange={(e) => setNpsAns(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <ReviewInstruction required>
                    만약 {josa(programTitle ?? '', '을/를')} 친구/지인에게
                    추천한다면 어떤 부분을 이야기 하면서 추천하실 것 같나요?
                  </ReviewInstruction>
                  <ReviewTextarea
                    placeholder="친구/지인에게 이야기한다고 생각하며 편하게 작성해주세요!"
                    value={npsAns}
                    onChange={(e) => setNpsAns(e.target.value)}
                  />
                </div>
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <ReviewInstruction required>
              해당 점수를 선택한 이유는 무엇인가요?
            </ReviewInstruction>
            <ReviewTextarea
              placeholder="이유를 자세히 설명해주세요"
              value={npsAns}
              onChange={(e) => setNpsAns(e.target.value)}
            />
          </div>
        ))}
    </div>
  );
};

export default RecommendReviewField;
