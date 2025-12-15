import { ProgramTypeEnum, ProgramTypeUpperCase } from '@/schema';
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
  programType: ProgramTypeUpperCase;
}

const TableHead = ({ filter, setFilter, programType }: UserTableHeadProps) => {
  const handleNameHeadClick = () => {
    if (filter.name === 'ASCENDING') {
      setFilter({ ...filter, name: 'DESCENDING' });
    } else if (filter.name === 'DESCENDING') {
      setFilter({ ...filter, name: null });
    } else if (filter.name === null) {
      setFilter({ ...filter, name: 'ASCENDING' });
    }
  };

  return (
    <thead>
      <tr>
        <TH>주문번호</TH>
        <TH inOrder={filter.name} onClick={handleNameHeadClick}>
          이름
        </TH>
        <TH>소통용 이메일</TH>
        <TH>휴대폰 번호</TH>
        {(programType === 'LIVE' || programType === 'VOD') && (
          <>
            <TH>학교</TH>
            <TH>학년</TH>
            <TH>전공</TH>
            <TH>지원동기</TH>
            <TH>사전질문</TH>
          </>
        )}
        <TH>쿠폰명</TH>
        {programType === ProgramTypeEnum.enum.CHALLENGE && <TH>결제 상품</TH>}
        <TH>결제금액</TH>
        <TH>환불여부</TH>
        <TH>신청일자</TH>
      </tr>
    </thead>
  );
};

export default TableHead;
