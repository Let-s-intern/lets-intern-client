import clsx from 'clsx';

interface YesNoScoreProps {
  hasRecommendationExperience: boolean | null;
  setHasRecommendationExperience: (
    hasRecommendationExperience: boolean | null,
  ) => void;
}

const YesNoScore = ({
  hasRecommendationExperience,
  setHasRecommendationExperience,
}: YesNoScoreProps) => {
  const handleYesOrNoClick = (isYesValue: boolean) => {
    if (hasRecommendationExperience === isYesValue) {
      setHasRecommendationExperience(null);
    } else {
      setHasRecommendationExperience(isYesValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={clsx(
          'w-full rounded-md border-2 px-5 py-2 font-medium hover:border-primary hover:bg-primary hover:text-neutral-100',
          {
            'border-primary bg-primary text-neutral-100':
              hasRecommendationExperience === true,
            'border-primary-xlight bg-white text-primary-dark':
              hasRecommendationExperience === false ||
              hasRecommendationExperience === null,
          },
        )}
        onClick={() => handleYesOrNoClick(true)}
      >
        네
      </button>
      <button
        className={clsx(
          'w-full rounded-md border-2 px-5 py-2 font-medium hover:border-primary hover:bg-primary hover:text-neutral-100',
          {
            'border-primary bg-primary text-neutral-100':
              hasRecommendationExperience === false,
            'border-primary-xlight bg-white text-primary-dark':
              hasRecommendationExperience === true ||
              hasRecommendationExperience === null,
          },
        )}
        onClick={() => handleYesOrNoClick(false)}
      >
        아니요
      </button>
    </div>
  );
};

export default YesNoScore;
