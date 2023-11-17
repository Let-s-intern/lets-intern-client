import Modal from './components/Modal';
import useProgramApply from './hook';

const ProgramApply = () => {
  const { navigate, pageIndex, pages, handleNextButtonClick } =
    useProgramApply();

  return (
    <div
      className={`fixed left-0 top-0 z-[100] flex h-screen w-screen cursor-pointer bg-black bg-opacity-50${
        pages[pageIndex].position === 'bottom'
          ? ' items-end'
          : ' items-center justify-center'
      }`}
      onClick={() => navigate(-1)}
    >
      <Modal
        nextButtonText={pages[pageIndex].nextButtonText}
        position={pages[pageIndex].position}
        onNextButtonClick={handleNextButtonClick}
      >
        {pages[pageIndex].content}
      </Modal>
    </div>
  );
};

export default ProgramApply;
