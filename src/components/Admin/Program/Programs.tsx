import { useEffect, useState } from 'react';

import Table from '../Table';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { useSearchParams } from 'react-router-dom';

import Header from '../Header';
import Heading from '../Heading';
import ActionButton from '../ActionButton';
import AdminPagination from '../AdminPagination';
import axios from '../../../libs/axios';

import './Programs.scss';

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const sizePerPage = 10;

  useEffect(() => {
    setLoading(true);
    const currentPage = searchParams.get('page');
    const params = {
      page: currentPage,
      size: sizePerPage,
    };
    axios
      .get('/program/admin', { params })
      .then((res) => {
        setProgramList(res.data.programList);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const fetchEditProgramVisible = (programId: number, visible: boolean) => {
    axios
      .patch(`/program/${programId}`, {
        isVisible: !visible,
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
        setProgramList(newProgramList);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const fetchDelete = (programId: number) => {
    axios
      .delete(`/program/${programId}`)
      .then(() => {
        setProgramList(programList.filter((p: any) => p.id !== programId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) {
    return <>로딩 중...</>;
  }

  if (error) {
    return <>에러 발생</>;
  }

  return (
    <>
      <Header>
        <Heading>프로그램 관리</Heading>
        <ActionButton to="/admin/programs/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <main className="programs-main">
        <Table>
          <TableHead />
          <TableBody
            programList={programList}
            fetchDelete={fetchDelete}
            fetchEditProgramVisible={fetchEditProgramVisible}
          />
        </Table>
        <div className="bottom">
          <AdminPagination maxPage={10} />
        </div>
      </main>
    </>
  );
};

export default Programs;
