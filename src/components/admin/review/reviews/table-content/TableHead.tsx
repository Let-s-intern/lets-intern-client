import TH, { THProps } from '../../../ui/table/regacy/TH';

export interface ReviewsTableHeadProps {
  filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  };
  setFilter: (filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  }) => void;
}

const ReviewsTableHead = ({ filter, setFilter }: ReviewsTableHeadProps) => {
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
        <TH inOrder={filter.programTitle} onClick={handleProgramTitleHeadClick}>
          프로그램 명
        </TH>
        <TH>이름</TH>
        <TH>NPS 점수</TH>
        <TH>NPS 이유</TH>
        <TH>추천 경험</TH>
        <TH>만족도</TH>
        <TH>후기</TH>
        <TH>노출여부</TH>
      </tr>
    </thead>
  );
};

export default ReviewsTableHead;
