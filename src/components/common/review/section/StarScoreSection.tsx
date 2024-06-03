import StarScore from '../score/StarScore';

interface StarScoreSectionProps {
  starScore: number;
  setStarScore: (starScore: number) => void;
}

const StarScoreSection = ({
  starScore,
  setStarScore,
}: StarScoreSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">(프로그램이름)은 어떠셨나요?</h1>
      <p>참여한 프로그램의 만족도를 평가해주세요!</p>
      <StarScore starScore={starScore} setStarScore={setStarScore} />
    </div>
  );
};

export default StarScoreSection;
