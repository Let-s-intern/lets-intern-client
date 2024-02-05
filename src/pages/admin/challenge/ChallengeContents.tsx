import TableBodyRow from '../../../components/admin/challenge/mission/mission-contents/table/table-body/TableBodyRow';
import TableHead from '../../../components/admin/challenge/mission/mission-contents/table/table-head/TableHead';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import TableBodyBox from '../../../components/admin/challenge/ui/table/table-body/TableBodyBox';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeContents = () => {
  return (
    <>
      <Heading>학습 콘텐츠</Heading>
      <Table>
        <TableHead />
        <TableBodyBox>
          {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
            <TableBodyRow
              key={th}
              isRequired={true}
              name="경험정리 콘텐츠"
              releaseDate="2024.01.26"
              mission="1일차, 2일차"
              isVisible={true}
            />
          ))}
        </TableBodyBox>
      </Table>
    </>
  );
};

export default ChallengeContents;
