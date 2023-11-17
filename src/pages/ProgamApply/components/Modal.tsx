import { ModalProps } from '../interface';
import ScrollBox from './Scrollbox';

const Modal = ({
  position,
  nextButtonText = '다음',
  onNextButtonClick,
  children,
}: ModalProps) => {
  return (
    <div
      className={`flex w-full cursor-auto justify-center${
        position === 'bottom' ? ' fixed bottom-0' : ''
      }`}
    >
      <div
        className={`w-full bg-white shadow${
          position === 'bottom'
            ? ' fixed bottom-0 max-w-2xl rounded-tl-2xl rounded-tr-2xl'
            : ' mx-5 max-w-md rounded sm:mx-0'
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ScrollBox className="max-h-[400px] overflow-y-scroll px-6 py-8">
          {children}
        </ScrollBox>
        <button
          type="submit"
          className={`w-full bg-primary py-3 font-medium text-white`}
          onClick={onNextButtonClick}
        >
          {nextButtonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
