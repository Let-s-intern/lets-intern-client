import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from './interface';
import MemberTypeContent from './components/MemberTypeContent';
import MemberInfoInputContent from './components/MemberInfoInputContent';
import CautionContent from './components/CautionContent';
import ResultContent from './components/ResultContent';

const useProgramApply = () => {
  const navigate = useNavigate();

  const [cautionChecked, setCautionChecked] = useState(false);

  const handleCautionChecked = () => {
    setCautionChecked(!cautionChecked);
  };

  const [pageIndex, setPageIndex] = useState(0);
  const [pages, setPages] = useState<Pages[]>([
    { position: 'bottom', content: <MemberTypeContent /> },
    { position: 'bottom', content: <MemberInfoInputContent /> },
    {
      position: 'center',
      content: (
        <CautionContent
          cautionChecked={cautionChecked}
          onCautionChecked={handleCautionChecked}
        />
      ),
      nextButtonText: '신청하기',
    },
    {
      position: 'center',
      content: <ResultContent />,
      nextButtonText: '닫기',
    },
  ]);

  const handleNextButtonClick = () => {
    if (pageIndex === pages.length - 1) {
      navigate(-1);
    } else {
      setPageIndex(pageIndex + 1);
    }
  };

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
  }, [cautionChecked]);

  return { navigate, pageIndex, pages, handleNextButtonClick, cautionChecked };
};

export default useProgramApply;
