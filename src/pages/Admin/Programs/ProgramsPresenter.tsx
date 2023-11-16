import { Checkbox } from '@mui/material';
import ActionButton from './components/ActionButton';
import Header from './components/Header';
import TD from './components/TD';
import TH from './components/TH';

interface ProgramsPresenterProps {
  programList: any;
  handleDelete?: any;
  handleEditProgramVisible?: any;
  loading: boolean;
  error: any;
}

const ProgramsPresenter = ({
  programList,
  handleDelete,
  handleEditProgramVisible,
  loading,
  error,
}: ProgramsPresenterProps) => {
  if (error) {
    return <div>에러 발생</div>;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div>로딩 중...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <table className="w-full table-auto border border-slate-300">
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
        <tbody>
          {programList.map((program: any) => (
            <tr key={program.id}>
              <TD>{program.status}</TD>
              <TD>{program.title}</TD>
              <TD>{program.th}</TD>
              <TD>{program.type}</TD>
              <TD>{program.startDate}</TD>
              <TD>{program.dueDate}</TD>
              <TD className="flex gap-2">
                <ActionButton
                  style="edit"
                  to={`/admin/programs/${program.id}/edit`}
                >
                  수정
                </ActionButton>
                <ActionButton
                  style="delete"
                  onClick={() => handleDelete(program.id)}
                >
                  삭제
                </ActionButton>
              </TD>
              <TD>
                <Checkbox
                  checked={program.isVisible && program.isApproved}
                  onChange={() => {
                    handleEditProgramVisible(
                      program.id,
                      program.isVisible && program.isApproved,
                    );
                  }}
                />
              </TD>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default ProgramsPresenter;
