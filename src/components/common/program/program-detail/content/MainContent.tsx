import { useState } from 'react';
import styled from 'styled-components';

import TabBar from '../tab/tab-bar/TabBar';
import DetailTab from '../tab/content/DetailTab';
import ReviewTab from '../tab/content/ReviewTab';
import FAQTab from '../tab/content/FAQTab';

interface MainContentProps {
  program: any;
  reviewList: any;
  faqList: any;
}

const MainContent = ({ program, reviewList, faqList }: MainContentProps) => {
  const [tab, setTab] = useState<string>('DETAIL');
  const [toggleOpenList, setToggleOpenList] = useState<number[]>([]);

  const handleToggleOpenList = (faqId: number) => {
    const isOpen = toggleOpenList.includes(faqId);
    if (isOpen) {
      const newToggleOpenList = toggleOpenList.filter(
        (id: any) => id !== faqId,
      );
      setToggleOpenList(newToggleOpenList);
    } else {
      setToggleOpenList([...toggleOpenList, faqId]);
    }
  };

  const getToggleOpened = (faqId: number) => {
    return toggleOpenList.includes(faqId);
  };

  return (
    <>
      <TabBar tab={tab} onTabChange={setTab} />
      <TabContent>
        {tab === 'DETAIL' ? (
          <DetailTab content={program.contents} />
        ) : tab === 'REVIEW' ? (
          <ReviewTab reviewList={reviewList} />
        ) : tab === 'FAQ' ? (
          <FAQTab
            faqList={faqList}
            toggleOpenList={toggleOpenList}
            onToggleOpenList={handleToggleOpenList}
            getToggleOpened={getToggleOpened}
          />
        ) : (
          ''
        )}
      </TabContent>
    </>
  );
};

export default MainContent;

const TabContent = styled.div`
  min-height: 100vh;
`;
