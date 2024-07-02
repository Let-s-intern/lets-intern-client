import TH, { THProps } from '../../../ui/table/regacy/TH';

export interface UserTableHeadProps {
  program: any;
  filter: {
    name: THProps['inOrder'];
    isFeeConfirmed: THProps['inBoolFilter'];
  };
  setFilter: (filter: {
    name: THProps['inOrder'];
    isFeeConfirmed: THProps['inBoolFilter'];
  }) => void;
  programType: string;
}

const TableHead = ({
  program,
  filter,
  setFilter,
  programType,
}: UserTableHeadProps) => {
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
        <TH>입금예정금액</TH>
        <TH
          inBoolFilter={filter.isFeeConfirmed}
          onClick={handleIsFeeConfirmedHeadClick}
        >
          입금여부
        </TH>
        <TH>신청일자</TH>
      </tr>
    </thead>
  );
};

export default TableHead;
