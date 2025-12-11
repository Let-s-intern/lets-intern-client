const CreditCancelModal = ({
  onConfirm,
  onCancel,
  title,
  text,
  confirmText = '확인',
  cancelText = '취소',
}: {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-neutral-0/50 px-8">
      <div className="relative flex max-w-full flex-col items-center justify-center gap-y-8 break-keep rounded-xl bg-static-100 px-4 pb-4 pt-9 shadow-05 md:px-14 md:pb-6 md:pt-11">
        <img
          src="/icons/menu_close_md.svg"
          alt="close"
          onClick={onCancel}
          className="absolute right-6 top-6 h-3 w-3 cursor-pointer md:h-6 md:w-6"
        />
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <div className="w-full text-center text-lg font-bold text-neutral-0">
            {title}
          </div>
          <div className="whitespace-pre-line break-keep text-center font-medium text-neutral-0 text-opacity-[52%]">
            {text}
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-x-3">
          <button
            className="grow rounded-sm border-2 border-primary bg-neutral-100 px-5 py-2.5 font-medium text-primary-dark"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="grow rounded-sm border-2 border-primary bg-primary px-5 py-2.5 font-medium text-neutral-100"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCancelModal;
