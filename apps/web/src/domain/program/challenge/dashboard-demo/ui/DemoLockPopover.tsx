import { useOpenChallengeApply } from '../../hooks/useOpenChallengeApply';

interface Props {
  onClose: () => void;
}

/** 잠긴 곳을 누르면 체험 창 안에만 뜨는 안내 */
const DemoLockPopover = ({ onClose }: Props) => {
  const openApply = useOpenChallengeApply();

  const handleApply = () => {
    onClose();
    openApply();
  };

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-static-0/40 px-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="챌린지 신청 안내"
        className="w-full max-w-[320px] rounded-sm bg-white p-6 text-center shadow-05"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-small18 font-semibold text-neutral-0">
          챌린지 신청하고 이어서 해 보세요
        </p>
        <p className="mt-2 text-xsmall14 text-neutral-30">
          체험에서는 0회차 미션만 둘러볼 수 있어요.
        </p>
        <button
          type="button"
          onClick={handleApply}
          className="mt-5 w-full rounded-xs bg-primary py-3 text-xsmall16 font-semibold text-white"
        >
          챌린지 신청하기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-xsmall14 text-neutral-40"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default DemoLockPopover;
