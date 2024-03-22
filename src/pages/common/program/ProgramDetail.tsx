import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import Header from '../../../components/common/program/program-detail/ui/Header';
import MainContent from '../../../components/common/program/program-detail/content/MainContent';
import ApplySection from '../../../components/common/program/program-detail/apply/mobile/main/ApplySection';
import ApplyAside from '../../../components/common/program/program-detail/apply/desktop/main/ApplyAside';

import styles from './ProgramDetail.module.scss';

const ProgramDetail = () => {
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [program, setProgram] = useState<any>(null);
  const [participated, setParticipated] = useState<boolean>(false);
  const [reviewList, setReviewList] = useState<any>(null);
  const [faqList, setFaqList] = useState<any>(null);
  const [wishJobList, setWishJobList] = useState<any>();
  const [loading, setLoading] = useState(true);

  const { isError } = useQuery({
    queryKey: ['program', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/program/${queryKey[1]}`);
      const {
        programDetailVo,
        participated,
        reviewList,
        faqList,
        wishJobList,
      } = res.data;
      setProgram(programDetailVo);
      setParticipated(participated);
      setReviewList(reviewList);
      setFaqList(faqList);
      setWishJobList(wishJobList);
      setLoading(false);
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      setLoading(false);
    }
  }, [isError]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');

    setIsLoggedIn(accessToken && refreshToken ? true : false);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className="program-detail" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <main className="program-detail">에러 발생</main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <main>
          <article>
            <Header title={program.title} />
            <MainContent
              program={program}
              reviewList={reviewList}
              faqList={faqList}
            />
          </article>
          <ApplyAside
            program={program}
            participated={participated}
            wishJobList={wishJobList}
          />
        </main>
        <ApplySection
          program={program}
          participated={participated}
          isLoggedIn={isLoggedIn}
          wishJobList={wishJobList}
          setParticipated={setParticipated}
        />
      </div>
    </div>
  );
};

export default ProgramDetail;
