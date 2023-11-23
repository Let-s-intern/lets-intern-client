import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';

import Header from '../../components/Admin/Programs/Header';
import TH from '../../components/Admin/Programs/TH';
import TD from '../../components/Admin/Programs/TD';
import ActionButton from '../../components/Admin/Programs/ActionButton';
import axios from '../../libs/axios';

const Programs = () => {
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const fetchEditProgramVisible = (programId: number, visible: boolean) => {
    axios({
      method: 'PATCH',
      url: `/program/${programId}`,
      data: {
        isVisible: !visible,
        isApproved: !visible,
      },
    })
      .then(() => {
        const newProgramList: any = programList.map((program: any) => {
          if (program.id === programId) {
            return {
              ...program,
              isVisible: !visible,
              isApproved: !visible,
            };
          }
          return program;
        });
        console.log(newProgramList);
        setProgramList(newProgramList);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const fetchDelete = (programId: number) => {
    axios({
      method: 'DELETE',
      url: `/program/${programId}`,
    })
      .then((res) => {
        console.log(res);
        setProgramList(programList.filter((p: any) => p.id !== programId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios({
      url: `${process.env.REACT_APP_SERVER_API}/program/admin`,
      method: 'GET',
    })
      .then((res) => {
        const data = res.data.programList;
        setProgramList(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                  onClick={() => fetchDelete(program.id)}
                >
                  삭제
                </ActionButton>
              </TD>
              <TD>
                <Checkbox
                  checked={program.isVisible && program.isApproved}
                  onChange={() => {
                    fetchEditProgramVisible(
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
