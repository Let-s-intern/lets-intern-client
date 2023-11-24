import TH from '../TH';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <TH>상태</TH>
        <TH>이름</TH>
        <TH>기수</TH>
        <TH>유형</TH>
        <TH>시작기한</TH>
        <TH>마감기한</TH>
        <TH>액션</TH>
        <TH>공개</TH>
      </tr>
    </thead>
  );
};

export default TableHead;
