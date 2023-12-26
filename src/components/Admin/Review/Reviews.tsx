import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../libs/axios';
import TableHead from './TableHead';
import TableBody from './TableBody';
import Table from '../Table';
import AdminPagination from '../AdminPagination';

import './Reviews.scss';

const Reviews = () => {
  const [searchParams, _] = useSearchParams();
  const [programList, setProgramList] = useState([]);
  const [maxPage, setMaxPage] = useState(1);

  const sizePerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const currentPage = searchParams.get('page');
      const params = {
        size: sizePerPage,
        page: currentPage,
      };
      try {
        const res = await axios.get('/program/admin', { params });
        setProgramList(res.data.programList);
        setMaxPage(res.data.pageInfo.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [searchParams]);

  const copyReviewCreateLink = (programId: number) => {
    const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/program/${programId}/review/create`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('복사에 실패했습니다:', err);
      });
  };

  return (
    <>
      <Header>
        <Heading>후기 관리</Heading>
      </Header>
      <main className="reviews-main">
        <Table minWidth={1000}>
          <TableHead />
          <TableBody
            programList={programList}
            copyReviewCreateLink={copyReviewCreateLink}
          />
        </Table>
        {programList.length > 0 && <AdminPagination maxPage={maxPage} />}
      </main>
    </>
  );
};

export default Reviews;

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;
