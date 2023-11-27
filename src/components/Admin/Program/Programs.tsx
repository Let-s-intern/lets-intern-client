import ListHeader from '../ListHeader';
import Table from '../Table';
import TableHead from './TableHead';
import TableBody from './TableBody';
import Header from '../Header';
import Heading from '../Heading';
import ActionButton from '../ActionButton';

interface ProgramsProps {
  loading: boolean;
  error: any;
  programList: any;
  fetchDelete: (programId: number) => void;
  fetchEditProgramVisible: (programId: number, visible: boolean) => void;
  fetchEditProgramStatus: (programId: number, newStatus: string) => void;
}

const Programs = ({
  loading,
  error,
  programList,
  fetchDelete,
  fetchEditProgramVisible,
  fetchEditProgramStatus,
}: ProgramsProps) => {
  if (loading) {
    return (
      <>
        <ListHeader>프로그램 등록</ListHeader>
        <div>로딩 중...</div>
      </>
    );
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      <Header>
        <Heading>프로그램 관리</Heading>
        <ActionButton to="/admin/programs/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <Table>
        <TableHead />
        <TableBody
          programList={programList}
          fetchDelete={fetchDelete}
          fetchEditProgramVisible={fetchEditProgramVisible}
          fetchEditProgramStatus={fetchEditProgramStatus}
        />
      </Table>
    </>
  );
};

export default Programs;
