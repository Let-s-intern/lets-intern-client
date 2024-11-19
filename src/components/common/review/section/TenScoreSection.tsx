import { josa } from 'es-hangul';
import { useEffect } from 'react';
import TextArea from '../../ui/input/TextArea';
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

const TenScoreSection = ({
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">
            {josa(programTitle ?? '', '을/를')} 주변에 얼마나 추천하고
            싶으신가요?
          </h1>
          <p>0~10점 사이로 선택해주세요.</p>
        </div>
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
      </div>
      {tenScore !== null &&
        (tenScore > 6 ? (
          <>
            <div className="flex flex-col gap-3">
              <p>
                실제로 {josa(programTitle ?? '', '을/를')} 친구/지인에게
                추천해보신 경험이 있으신가요?
              </p>
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
                  <p className="px-2.5">
                    친구/지인에게 어떤 부분을 이야기 하면서 추천하셨나요?
                  </p>
                  <TextArea
                    rows={3}
                    placeholder="친구/지인에게 이야기한다고 생각하며 편하게 작성해주세요!"
                    value={npsAns}
                    onChange={(e) => setNpsAns(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="px-2.5">
                    만약 {josa(programTitle ?? '', '을/를')} 친구/지인에게
                    추천한다면 어떤 부분을 이야기 하면서 추천하실 것 같나요?
                  </p>
                  <TextArea
                    rows={3}
                    placeholder="친구/지인에게 이야기한다고 생각하며 편하게 작성해주세요!"
                    value={npsAns}
                    onChange={(e) => setNpsAns(e.target.value)}
                  />
                </div>
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="px-2.5">해당 점수를 선택한 이유는 무엇인가요?</p>
            <TextArea
              rows={3}
              placeholder="이유를 자세히 설명해주세요"
              value={npsAns}
              onChange={(e) => setNpsAns(e.target.value)}
            />
          </div>
        ))}
    </div>
  );
};

export default TenScoreSection;
