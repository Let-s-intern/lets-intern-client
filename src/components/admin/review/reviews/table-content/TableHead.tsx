import TH, { THProps } from '../../../ui/table/regacy/TH';

export interface ReviewsTableHeadProps {
  type: string;
  filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  };
  setFilter: (filter: {
    programTitle: THProps['inOrder'];
    createdDate: THProps['inOrder'];
  }) => void;
}

const ReviewsTableHead = ({
  type,
  filter,
  setFilter,
}: ReviewsTableHeadProps) => {
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
          {type === 'REPORT' ? '서류 진단서 명' : '프로그램 명'}
        </TH>
        {type === 'REPORT' && <TH>결제정보</TH>}
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
