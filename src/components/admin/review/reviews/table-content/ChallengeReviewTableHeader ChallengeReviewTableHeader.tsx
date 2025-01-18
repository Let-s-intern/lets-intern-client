import TH, { THProps } from '../../../ui/table/regacy/TH';

export interface ReviewTableHeaderProps {
  filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  };
  setFilter: (filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  }) => void;
}

const ChallengeReviewTableHeader = ({
  filter,
  setFilter,
}: ReviewTableHeaderProps) => {
  const handleProgramTitleHeadClick = () => {
    if (filter.programTitle === 'ASCENDING') {
      setFilter({ ...filter, programTitle: 'DESCENDING' });
    } else if (filter.programTitle === 'DESCENDING') {
      setFilter({ ...filter, programTitle: null });
    } else if (filter.programTitle === null) {
      setFilter({ ...filter, programTitle: 'ASCENDING' });
    }
  };

  const handleCreatedDateHeadClick = () => {
    if (filter.createdDate === 'ASCENDING') {
      setFilter({ ...filter, createdDate: 'DESCENDING' });
    } else if (filter.createdDate === 'DESCENDING') {
      setFilter({ ...filter, createdDate: null });
    } else if (filter.createdDate === null) {
      setFilter({ ...filter, createdDate: 'ASCENDING' });
    }
  };

  return (
    <thead>
      <tr>
        <TH inOrder={filter.createdDate} onClick={handleCreatedDateHeadClick}>
          작성 일자
        </TH>
        {/* TODO: 필터 추가 */}
        <TH>챌린지 구분</TH>
        <TH inOrder={filter.programTitle} onClick={handleProgramTitleHeadClick}>
          프로그램 명
        </TH>
        <TH>이름</TH>
        <TH>만족도 점수</TH>
        <TH>NPS 점수</TH>
        <TH>목표</TH>
        <TH>목표 달성 여부</TH>
        <TH>좋았었던 점</TH>
        <TH>아쉬웠던 점</TH>
        <TH>노출여부</TH>
      </tr>
    </thead>
  );
};

export default ChallengeReviewTableHeader;
