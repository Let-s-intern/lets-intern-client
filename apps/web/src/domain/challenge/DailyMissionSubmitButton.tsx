interface Props {
  value: string;
  isEditing: boolean;
  isLinkChecked: boolean;
  review: string;
  attendanceLink?: string;
  cancelMisiionLinkChange: () => void;
  setIsEditing: (v: boolean) => void;
  setIsLinkChecked: (v: boolean) => void;
}

function DailyMissionSubmitButton({
  value,
  isEditing,
  isLinkChecked,
  review,
  attendanceLink,
  cancelMisiionLinkChange,
  setIsEditing,
  setIsLinkChecked,
}: Props) {
  return (
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
  );
}

export default DailyMissionSubmitButton;
