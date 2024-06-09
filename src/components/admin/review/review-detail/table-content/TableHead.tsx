import TH from '../../../ui/table/regacy/TH';

const DetailTableHead = () => {
  return (
    <thead>
      <tr>
        <TH>이름</TH>
        <TH>NPS 점수</TH>
        <TH>NPS 이유</TH>
        <TH>추천 경험</TH>
        <TH>만족도</TH>
        <TH>후기</TH>
        <TH>작성일자</TH>
      </tr>
    </thead>
  );
};

export default DetailTableHead;
