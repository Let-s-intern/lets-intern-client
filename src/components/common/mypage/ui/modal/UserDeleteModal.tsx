const UserDeleteModal = ({toggle}:{toggle:() => void}) => {
  const onClick = () => {
    toggle();
    window.location.href = '/mypage/application';
  };
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-0/50 px-8">
      <div className="flex w-full flex-col items-center justify-center gap-7 rounded-xl bg-static-100 px-4 pb-4 pt-1 md:w-[31rem] md:gap-8 md:px-6 md:pb-6 lg:w-[37.5rem] lg:gap-12 lg:pt-14">
        <p className="text-1.125-bold">회원 탈퇴하시겠습니까?</p>
        <p className="text-0.875 text-neutral-50 text-center">탈퇴 시 계정 정보를 복구할 수 없습니다.</p>
        <button
          onClick={onClick}
          className="text-1-medium w-full rounded-sm bg-primary py-2 text-neutral-100"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default UserDeleteModal;
