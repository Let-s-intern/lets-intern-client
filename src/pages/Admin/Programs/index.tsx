import Checkbox from '@mui/material/Checkbox';

import usePrograms from './usePrograms';
import Header from './components/Header';
import TH from './components/TH';
import TD from './components/TD';
import ActionButton from './components/ActionButton';

const Programs = () => {
  const {
    programList,
    handleDelete,
    handleEditProgramVisible,
    loading,
    error,
  } = usePrograms();

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
                  styleType="edit"
                  to={`/admin/programs/${program.id}/edit`}
                >
                  수정
                </ActionButton>
                <ActionButton
                  styleType="delete"
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

export default Programs;
