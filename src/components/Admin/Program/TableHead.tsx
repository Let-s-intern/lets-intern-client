import TH from '../TH';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <TH>분류</TH>
        <TH>기수</TH>
        <TH>이름</TH>
        <TH>시작일자</TH>
        <TH>상태</TH>
        <TH>신청인</TH>
        <TH>등록일자</TH>
        <TH>관리</TH>
        <TH>노출여부</TH>
      </tr>
    </thead>
  );
};

export default TableHead;
