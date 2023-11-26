import styled from 'styled-components';

import '../../../styles/github-markdown-light.css';
import Header from './Header';
import ApplySection from './ApplySection';
import TabBar from './TabBar';
import DetailTab from './DetailTab';
import ReviewTab from './ReviewTab';
import FAQTab from './FAQTab';

interface ProgramDetailProps {
  loading: boolean;
  error: unknown;
  handleBackButtonClick: () => void;
  tab: string;
  handleTabChange: (tab: string) => void;
  program: any;
  faqList: any;
  reviewList: any;
  toggleOpenList: number[];
  programId: number;
  handleToggleOpenList: (id: number) => void;
  getToggleOpened: (faqId: number) => boolean;
}

const ProgramDetail = ({
  loading,
  error,
  handleBackButtonClick,
  tab,
  handleTabChange,
  program,
  faqList,
  reviewList,
  toggleOpenList,
  programId,
  handleToggleOpenList,
  getToggleOpened,
}: ProgramDetailProps) => {
  if (loading) {
    return <ProgramDetailBlock>로딩 중...</ProgramDetailBlock>;
  }

  if (error) {
    return <ProgramDetailBlock>에러 발생</ProgramDetailBlock>;
  }

  return (
    <ProgramDetailBlock>
      <Header title={program.title} onBackButtonClick={handleBackButtonClick} />
      <TabBar program={undefined} tab={tab} onTabChange={handleTabChange} />
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
      <ApplySection programId={programId} />
    </ProgramDetailBlock>
  );
};

export default ProgramDetail;

const ProgramDetailBlock = styled.div`
  width: 100%;
  padding: 1rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 768px;
  }
`;

const TabContent = styled.div`
  padding: 1rem;
`;
