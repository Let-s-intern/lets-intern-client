import clsx from 'clsx';

interface Props {
  value: string;
  isEditing: boolean;
  isLinkChecked: boolean;
  review: string;
  attendanceLink?: string;
  handleMissionReviewChanged: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  cancelMisiionLinkChange: () => void;
  setIsEditing: (v: boolean) => void;
  setIsLinkChecked: (v: boolean) => void;
}

const DailyMissionReviewSection = ({
  value,
  isEditing,
  isLinkChecked,
  review,
  attendanceLink,
  handleMissionReviewChanged,
  cancelMisiionLinkChange,
  setIsEditing,
  setIsLinkChecked,
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
      <div className="mt-6 flex gap-x-6">
        {attendanceLink && (
          <button
            type="button"
            className="h-12 flex-1 rounded-md border border-gray-50 bg-white px-6 py-3 text-center text-small18 font-medium disabled:bg-gray-50 disabled:text-gray-600"
            onClick={() => {
              if (isEditing) {
                cancelMisiionLinkChange();
              } else {
                setIsEditing(true);
                setIsLinkChecked(false);
              }
            }}
          >
            {isEditing ? '취소' : '수정하기'}
          </button>
        )}
        <button
          type="submit"
          className="h-12 flex-1 rounded-md bg-primary px-6 py-3 text-center text-small18 font-medium text-white disabled:bg-neutral-70 disabled:text-white"
          disabled={!isEditing || !value || !review || !isLinkChecked}
        >
          {isEditing ? '미션 제출' : '제출 완료'}
        </button>
      </div>
    </>
  );
};

export default DailyMissionReviewSection;
