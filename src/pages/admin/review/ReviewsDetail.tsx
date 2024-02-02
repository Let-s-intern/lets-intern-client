import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import Table from '../../../components/admin/ui/table/Table';
import TableHead from '../../../components/admin/review/review-detail/table-content/TableHead';
import TableBody from '../../../components/admin/review/review-detail/table-content/TableBody';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';

import classes from './ReviewsDetail.module.scss';

const ReviewsDetail = () => {
  const params = useParams();
  const [searchParams, _] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [reviewList, setReviewList] = useState<any>([]);
  const [program, setProgram] = useState<any>({});
  const [maxPage, setMaxPage] = useState(1);

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
        setMaxPage(res.data.pageInfo.totalPages);
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
      <header className={classes.header}>
        <Heading>후기 목록 - {program.title}</Heading>
      </header>
      <main className={classes.main}>
        <Table>
          <TableHead />
          <TableBody
            program={program}
            reviewList={reviewList}
            handleVisibleChanged={handleVisibleChanged}
          />
        </Table>
        {reviewList.length > 0 && (
          <div className={classes.pagination}>
            <AdminPagination maxPage={maxPage} />
          </div>
        )}
      </main>
    </>
  );
};

export default ReviewsDetail;
