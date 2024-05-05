import TH, { THProps } from '../../../ui/table/regacy/TH';

export interface UserTableHeadProps {
  filter: {
    name: THProps['inOrder'];
    isFeeConfirmed: THProps['inBoolFilter'];
  };
  setFilter: (filter: {
    name: THProps['inOrder'];
    isFeeConfirmed: THProps['inBoolFilter'];
  }) => void;
}

const UserTableHead = ({ filter, setFilter }: UserTableHeadProps) => {
  const handleNameHeadClick = () => {
    if (filter.name === 'ASCENDING') {
      setFilter({ ...filter, name: 'DESCENDING' });
    } else if (filter.name === 'DESCENDING') {
      setFilter({ ...filter, name: null });
    } else if (filter.name === null) {
      setFilter({ ...filter, name: 'ASCENDING' });
    }
  };

  const handleIsFeeConfirmedHeadClick = () => {
    if (filter.isFeeConfirmed) {
      setFilter({ ...filter, isFeeConfirmed: false });
    } else if (filter.isFeeConfirmed === false) {
      setFilter({ ...filter, isFeeConfirmed: null });
    } else if (filter.isFeeConfirmed === null) {
      setFilter({ ...filter, isFeeConfirmed: true });
    }
  };
  return (
    <thead>
      <tr>
        <TH>구분</TH>
        <TH>유입경로</TH>
        <TH>이메일 주소</TH>
        <TH inOrder={filter.name} onClick={handleNameHeadClick}>
          이름
        </TH>
        <TH>휴대폰 번호</TH>
        <TH>학교</TH>
        <TH>학년</TH>
        <TH>전공</TH>
        <TH>쿠폰명</TH>
        <TH>입금 예정 금액</TH>
        <TH>환급계좌번호</TH>
        <TH
          inBoolFilter={filter.isFeeConfirmed}
          onClick={handleIsFeeConfirmedHeadClick}
        >
          입금 여부
        </TH>
        <TH>희망직무</TH>
        <TH>희망기업형태</TH>
        <TH>신청자 답변</TH>
        <TH>온/오프라인 여부</TH>
        <TH>참가확정</TH>
        <TH>신청일자</TH>
        <TH>사전질문</TH>
      </tr>
    </thead>
  );
};

export default UserTableHead;
