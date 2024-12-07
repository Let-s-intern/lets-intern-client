import { josa } from 'es-hangul';
import StarScore from '../score/StarScore';

interface StarScoreSectionProps {
  starScore: number;
  setStarScore: (starScore: number) => void;
  title?: string | null;
}

const StarScoreSection = ({
  starScore,
  setStarScore,
  title,
}: StarScoreSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">
        {josa(title ?? '', '은/는')} 어떠셨나요?
        <span className="text-requirement ml-1">*</span>
      </h1>
      <p>참여한 프로그램의 만족도를 평가해주세요!</p>
      <StarScore starScore={starScore} setStarScore={setStarScore} />
    </div>
  );
};

export default StarScoreSection;
