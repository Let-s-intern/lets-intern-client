import TableBodyRow from '../../../components/admin/challenge/submit-check/table/table-body/TableBodyRow';
import TableHead from '../../../components/admin/challenge/submit-check/table/table-head/TableHead';
import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import TableBodyBox from '../../../components/admin/challenge/ui/table/table-body/TableBodyBox';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';

const ChallengeSubmitCheck = () => {
  return (
    <div className="px-12">
      <Heading>미션 제출</Heading>
      <Table>
        <TableHead />
        <TableBodyBox>
          {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
            <TableBodyRow
              key={th}
              th="1일차"
              name="n일차. 미션이름"
              releaseDate="2024.01.26"
              dueDate="2024.01.27 8:00 "
              isRefunded={true}
              connectedContents="경험정리"
              submitCount={93}
              totalCount={100}
              checkStatus="DONE"
              refundStatus="DONE"
            />
          ))}
        </TableBodyBox>
      </Table>
    </div>
  );
};

export default ChallengeSubmitCheck;
