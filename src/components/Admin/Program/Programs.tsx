import ListHeader from '../ListHeader';
import Table from '../Table';
import TableHead from './TableHead';
import TableBody from './TableBody';

interface ProgramsProps {
  loading: boolean;
  error: any;
  programList: any;
  fetchDelete: (programId: number) => void;
  fetchEditProgramVisible: (programId: number, visible: boolean) => void;
}

const Programs = ({
  loading,
  error,
  programList,
  fetchDelete,
  fetchEditProgramVisible,
}: ProgramsProps) => {
  if (error) {
    return <div>에러 발생</div>;
  }

  if (loading) {
    return (
      <>
        <ListHeader>프로그램 등록</ListHeader>
        <div>로딩 중...</div>
      </>
    );
  }

  return (
    <>
      <ListHeader>프로그램 등록</ListHeader>
      <Table>
        <TableHead />
        <TableBody
          programList={programList}
          fetchDelete={fetchDelete}
          fetchEditProgramVisible={fetchEditProgramVisible}
        />
      </Table>
    </>
  );
};

export default Programs;
