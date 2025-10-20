import { useRouter } from 'next/navigation';

const CONTENT = {
  TITLE: '제출이 완료되었습니다!',
  BUTTON_CAPTION: '신청 내역 확인하기',
};

interface ApplyModalProps {
  toggle: () => void;
}

const ApplyModal = ({ toggle }: ApplyModalProps) => {
  const router = useRouter();

  const onClick = () => {
    toggle();
    router.push('/mypage/application');
  };
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-0/50 px-8">
      <div className="flex w-full flex-col items-center justify-center gap-7 rounded-xl bg-static-100 px-4 pb-4 pt-9 md:w-[31rem] md:gap-8 md:px-6 md:pb-6 lg:w-[37.5rem] lg:gap-12 lg:pt-14">
        <p className="text-1.125-bold">{CONTENT.TITLE}</p>
        <p className="text-0.875 text-center text-neutral-50">
          신청 내역에서 결제 정보를 확인해주세요!
        </p>
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
