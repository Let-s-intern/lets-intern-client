import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CautionContent from './components/CautionContent';
import Modal from './components/Modal';
import ResultContent from './components/ResultContent';
import MemberTypeContent from './components/MemberTypeContent';
import MemberInfoInputContent from './components/MemberInfoInputContent';
import { Pages } from './interface';

const ProgramApply = () => {
  const navigate = useNavigate();
  const [cautionChecked, setCautionChecked] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pages, setPages] = useState<Pages[]>([
    { position: 'bottom', content: <MemberTypeContent /> },
    { position: 'bottom', content: <MemberInfoInputContent /> },
    {
      position: 'center',
      content: <div />,
      nextButtonText: '신청하기',
    },
    {
      position: 'center',
      content: <ResultContent />,
      nextButtonText: '닫기',
    },
  ]);

  const handleCautionChecked = () => {
    setCautionChecked(!cautionChecked);
  };

  const handleNextButtonClick = () => {
    if (pageIndex === pages.length - 1) {
      navigate(-1);
    } else {
      setPageIndex(pageIndex + 1);
    }
  };

  useEffect(() => {
    const newPages = [...pages];
    newPages[2].content = (
      <CautionContent
        cautionChecked={cautionChecked}
        onCautionChecked={handleCautionChecked}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageIndex !== 2) return;
    const newPages = [...pages];
    newPages[2].content = (
      <CautionContent
        cautionChecked={cautionChecked}
        onCautionChecked={handleCautionChecked}
      />
    );
    setPages(newPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cautionChecked]);

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
