import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Table from '../../../components/admin/table/Table';
import TableHead from '../../../components/admin/table/table-content/programs/TableHead';
import TableBody from '../../../components/admin/table/table-content/programs/TableBody';

import Header from '../../../components/admin/header/Header';
import Heading from '../../../components/admin/heading/Heading';
import ActionButton from '../../../components/admin/button/ActionButton';
import AdminPagination from '../../../components/admin/pagination/AdminPagination';
import axios from '../../../utils/axios';
import classes from './Programs.module.scss';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [maxPage, setMaxPage] = useState(1);

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
        setMaxPage(res.data.pageInfo.totalPages);
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
      <main className={classes.main}>
        <Table>
          <TableHead />
          <TableBody
            programList={programList}
            fetchDelete={fetchDelete}
            fetchEditProgramVisible={fetchEditProgramVisible}
          />
        </Table>
        {programList.length > 0 && (
          <div className={classes.pagination}>
            <AdminPagination maxPage={maxPage} />
          </div>
        )}
      </main>
    </>
  );
};

export default Programs;
