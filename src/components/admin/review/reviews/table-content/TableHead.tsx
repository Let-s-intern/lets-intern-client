import TH from '../../../ui/table/regacy/TH';

const ReviewsTableHead = () => {
  return (
    <thead>
      <tr>
        <TH>작성 일자</TH>
        <TH>프로그램 명</TH>
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
