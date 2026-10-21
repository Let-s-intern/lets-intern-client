import { useAdminUserDetailQuery } from '@/api/user/user';

interface Props {
  mentorId: number;
  onChangeMentor: () => void;
}

/**
 * 후기 탭 위에 어느 멘토의 후기를 보고 있는지 알린다.
 * 참여자 탭의 멘토 필터 표시와 같은 모양이다.
 */
export default function ReviewMentorBar({ mentorId, onChangeMentor }: Props) {
  const { data } = useAdminUserDetailQuery(mentorId);
  const userInfo = data?.userInfo;
  // 불러오기 전이나 실패하면 번호로 적는다
  const mentorLabel = !userInfo
    ? `멘토 #${mentorId}`
    : userInfo.nickname
      ? `${userInfo.nickname} (${userInfo.name})`
      : userInfo.name;

  return (
    <div
      role="group"
      aria-label="멘토 필터"
      className="border-neutral-80 bg-neutral-95 text-xsmall14 mb-4 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3"
    >
      {userInfo?.profileImgUrl ? (
        <img
          src={userInfo.profileImgUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <span className="text-neutral-10">
        <strong className="font-semibold">{mentorLabel}</strong> 멘토의 후기를
        보고 있습니다.
      </span>
      <button
        type="button"
        onClick={onChangeMentor}
        className="border-neutral-80 text-neutral-40 rounded-md border bg-white px-3 py-1"
      >
        다른 멘토 고르기
      </button>
    </div>
  );
}
