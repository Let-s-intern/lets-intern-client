import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../libs/axios';
import Table from '../Table';
import DetailTableHead from './DetailTableHead';
import DetailTableBody from './DetailTableBody';
import Heading from '../Heading';

import './ReviewsDetail.scss';
import AdminPagination from '../AdminPagination';

const ReviewsDetail = () => {
  const params = useParams();
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [reviewList, setReviewList] = useState<any>([]);
  const [program, setProgram] = useState<any>({});

  const sizePerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      const currentPage = searchParams.get('page');
      const pageParams = {
        page: currentPage,
        size: sizePerPage,
      };
      try {
        let res;
        res = await axios.get(`/review/admin/${params.programId}`, {
          params: pageParams,
        });
        setReviewList(res.data.reviewList);
        res = await axios.get(`/program/admin`);
        const foundedProgram = res.data.programList.find(
          (program: any) => program.id === Number(params.programId),
        );
        setProgram(foundedProgram);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [searchParams]);

  const handleVisibleChanged = async (reviewId: number, status: string) => {
    try {
      await axios.patch(`/review/${reviewId}`, { status });
      const newReviewList = reviewList.map((review: any) => {
        if (review.id === reviewId) {
          return {
            ...review,
            status,
          };
        }
        return review;
      });
      setReviewList(newReviewList);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <></>;
  }

  if (error) {
    return <>에러 발생</>;
  }

  return (
    <>
      <Header>
        <Heading>후기 목록 - {program.title}</Heading>
      </Header>
      <main className="reviews-detail-main">
        <Table>
          <DetailTableHead />
          <DetailTableBody
            program={program}
            reviewList={reviewList}
            handleVisibleChanged={handleVisibleChanged}
          />
        </Table>
        <AdminPagination maxPage={10} />
      </main>
    </>
  );
};

export default ReviewsDetail;

const Header = styled.header`
  margin-bottom: 1rem;
`;
