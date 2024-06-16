const CONTENT = {
  TITLE: '제출이 완료되었습니다!',
  BUTTON_CAPTION: '신청 내역 확인하기',
};

interface ApplyModalProps {
  toggle: () => void;
}

const ApplyModal = ({ toggle }: ApplyModalProps) => {
  const onClick = () => {
    toggle();
    window.location.href = '/mypage/application';
  };
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-0/50 px-8">
      <div className="flex h-40 w-[20rem] flex-col items-center justify-center gap-7 rounded-xl bg-static-100 px-4">
        <p className="text-1.125-bold">{CONTENT.TITLE}</p>
        <button
          onClick={onClick}
          className="text-1-medium w-full rounded-sm bg-primary py-2 text-neutral-100"
        >
          {CONTENT.BUTTON_CAPTION}
        </button>
      </div>
    </div>
  );
};

export default ApplyModal;
