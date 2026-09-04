import type { LiveMentoringEntryRole } from '@/api/live-mentoring/liveMentoringSchema';

interface Props {
  myRole?: LiveMentoringEntryRole | null;
  /** 제출물이 이미 있는지. 라벨을 "제출"과 "수정"으로 가른다. */
  hasSubmission: boolean;
  /** 지금 내거나 고칠 수 있는지. 서버 판정(`questionEditable`)을 그대로 받는다. */
  editable: boolean;
  isLoading?: boolean;
  onOpen: () => void;
}

/**
 * 라벨을 정한다. 버튼을 아예 두지 않을 때는 null 을 준다.
 *
 * 마감이 지나도 버튼은 남는다. 멘티가 자기가 무엇을 냈는지 다시 볼 방법이
 * 이 화면에서 사라지기 때문이다 — 고칠 수 없다는 것과 볼 수 없다는 것은 다르다.
 * 잠겼다는 사실은 라벨이 `확인` 으로 바뀌는 것과 요약 카드의 `수정 기간 종료` 가 알려준다.
 */
function resolveLabel(
  myRole: LiveMentoringEntryRole | null | undefined,
  hasSubmission: boolean,
  editable: boolean,
): string | null {
  /*
    멘토는 열람만 한다. 마감과 무관하게 볼 수 있어야 하고, 제출물이 없어도
    버튼을 남긴다 — 없다는 사실도 멘토가 알아야 하는 정보다(모달이 알려준다).
  */
  if (myRole === 'MENTOR') return '멘티 제출물 보기';

  if (!editable) return '제출물 확인하기';

  return hasSubmission ? '제출물 수정하기' : '제출물 제출하기';
}

/**
 * 입장 화면의 제출물 버튼 — 사전 질문과 첨부를 내거나 고친다.
 *
 * 입장 버튼과 별개로 위에 둔다. 제출물은 세션 며칠 전에 내는 것이라
 * 입장이 열리기 한참 전부터 눌러야 하기 때문이다.
 */
const SubmissionButton = ({
  myRole,
  hasSubmission,
  editable,
  isLoading,
  onOpen,
}: Props) => {
  const label = resolveLabel(myRole, hasSubmission, editable);
  if (label === null) return null;

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onOpen}
      className="text-small16 border-primary text-primary disabled:border-neutral-85 disabled:text-neutral-45 disabled:bg-neutral-95 flex min-h-[52px] w-full items-center justify-center rounded-md border bg-white px-4 py-3 font-semibold disabled:cursor-not-allowed"
    >
      {isLoading ? '불러오는 중...' : label}
    </button>
  );
};

export default SubmissionButton;
