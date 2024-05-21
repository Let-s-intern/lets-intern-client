import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Table from '../../../components/admin/ui/table/regacy/Table';
import TableHead from '../../../components/admin/program/programs/table-content/TableHead';
import TableBody from '../../../components/admin/program/programs/table-content/TableBody';

import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import axios from '../../../utils/axios';
import classes from './Programs.module.scss';
import { useQuery } from '@tanstack/react-query';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programList, setProgramList] = useState([]);
  const [error, setError] = useState<unknown>(null);
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;
  const currentPage = searchParams.get('page') || 1;

  const getProgramList = useQuery({
    queryKey: ['program'],
    queryFn: async () => {
      try {
        const params = {
          size: sizePerPage,
          page: currentPage,
          sort: 'title',
        };
        const res = await axios.get('/program', { params });
        return res.data;
      } catch (error) {
        setError(error);
        return null;
      }
    },
  });

  useEffect(() => {
    if (getProgramList.data) {
      setProgramList(getProgramList.data.programList);
      setMaxPage(getProgramList.data.pageInfo.totalPages);
    }
  }, [getProgramList]);

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

  const loading = !getProgramList.isLoading;

  if (loading) {
    return <div className="p-8"></div>;
  }

  if (error) {
    return <div className="p-8">에러 발생</div>;
  }

  return (
    <div className="p-8">
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
    </div>
  );
};

export default Programs;
