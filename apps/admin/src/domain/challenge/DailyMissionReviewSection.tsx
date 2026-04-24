import clsx from 'clsx';

interface Props {
  isEditing: boolean;
  review: string;
  handleMissionReviewChanged: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

const DailyMissionReviewSection = ({
  isEditing,
  review,
  handleMissionReviewChanged,
}: Props) => {
  return (
    <>
      <div className="mt-6 flex w-full flex-col gap-y-5">
        <h3 className="text-xsmall16 font-semibold text-neutral-0">
          미션 소감
        </h3>
        <div
          className={clsx('flex flex-col gap-y-2 rounded-md p-3', {
            'bg-neutral-95': !isEditing,
            'bg-white': isEditing,
          })}
        >
          <textarea
            className={clsx(
              'h-20 flex-1 resize-none text-xsmall14 outline-none disabled:bg-neutral-95',
              {
                'text-neutral-400': !isEditing,
              },
            )}
            placeholder={`오늘의 미션은 어떠셨나요?\n새롭게 배운 점, 어려운 부분, 궁금증 등 떠오르는 생각을 남겨 주세요.`}
            value={review}
            onChange={handleMissionReviewChanged}
            disabled={!isEditing}
            maxLength={500}
          />
          <span className="w-full text-right text-xxsmall12 text-neutral-0/35">
            {review.length}/500
          </span>
        </div>
      </div>
    </>
  );
};

export default DailyMissionReviewSection;
