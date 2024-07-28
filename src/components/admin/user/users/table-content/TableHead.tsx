import TH from '../../../ui/table/regacy/TH';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <TH>이름</TH>
        <TH>이메일</TH>
        <TH>소통용 이메일</TH>
        <TH>휴대폰 번호</TH>
        {/* <TH>참여 프로그램</TH> */}
        <TH>가입일자</TH>
        <TH>참여 프로그램</TH>
        <TH>마케팅 동의 여부</TH>
        <TH>관리</TH>
      </tr>
    </thead>
  );
};

export default TableHead;
