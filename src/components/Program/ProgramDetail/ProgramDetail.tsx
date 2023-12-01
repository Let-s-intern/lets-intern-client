import styled from 'styled-components';

import '../../../styles/github-markdown-light.css';
import Header from './Header';
import ApplySection from './ApplySection';
import TabBar from './TabBar';
import DetailTab from './DetailTab';
import ReviewTab from './ReviewTab';
import FAQTab from './FAQTab';
import ProgramApply from '../../../pages/ProgamApply';

interface ProgramDetailProps {
  loading: boolean;
  error: unknown;
  tab: string;
  program: any;
  faqList: any;
  reviewList: any;
  toggleOpenList: number[];
  isApplyModalOpen: boolean;
  applyPageIndex: number;
  user: any;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  isNextButtonDisabled: boolean;
  participated: boolean;
  cautionChecked: boolean;
  handleTabChange: (tab: string) => void;
  handleToggleOpenList: (id: number) => void;
  getToggleOpened: (faqId: number) => boolean;
  handleApplyButtonClick: () => void;
  handleApplyModalClose: () => void;
  handleApplyNextButton: () => void;
  handleApplyInput: (e: any) => void;
  handleCautionChecked: () => void;
}

const ProgramDetail = ({
  loading,
  error,
  tab,
  program,
  faqList,
  reviewList,
  toggleOpenList,
  isApplyModalOpen,
  applyPageIndex,
  user,
  hasDetailInfo,
  isLoggedIn,
  isNextButtonDisabled,
  participated,
  cautionChecked,
  handleTabChange,
  handleToggleOpenList,
  getToggleOpened,
  handleApplyButtonClick,
  handleApplyModalClose,
  handleApplyNextButton,
  handleApplyInput,
  handleCautionChecked,
}: ProgramDetailProps) => {
  if (loading) {
    return <ProgramDetailBlock />;
  }

  if (error) {
    return <ProgramDetailBlock>에러 발생</ProgramDetailBlock>;
  }

  return (
    <ProgramDetailBlock>
      <Header title={program.title} />
      <TabBar tab={tab} onTabChange={handleTabChange} />
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
      <ApplySection
        handleApplyButtonClick={handleApplyButtonClick}
        participated={participated}
      />
      {isApplyModalOpen && (
        <ProgramApply
          applyPageIndex={applyPageIndex}
          user={user}
          hasDetailInfo={hasDetailInfo}
          isLoggedIn={isLoggedIn}
          isNextButtonDisabled={isNextButtonDisabled}
          cautionChecked={cautionChecked}
          notice={program.notice}
          handleApplyModalClose={handleApplyModalClose}
          handleApplyNextButton={handleApplyNextButton}
          handleApplyInput={handleApplyInput}
          handleCautionChecked={handleCautionChecked}
        />
      )}
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

const TabContent = styled.div``;
