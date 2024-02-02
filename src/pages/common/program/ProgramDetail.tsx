import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import Header from '../../../components/common/program-detail/ui/Header';
import MainContent from '../../../components/common/program-detail/MainContent';
import ApplySection from '../../../components/common/apply/mobile/ApplySection';
import ApplyAside from '../../../components/common/apply/desktop/ApplyAside';

import styles from './ProgramDetail.module.scss';

const ProgramDetail = () => {
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [program, setProgram] = useState<any>(null);
  const [participated, setParticipated] = useState<boolean>(false);
  const [reviewList, setReviewList] = useState<any>(null);
  const [faqList, setFaqList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isError } = useQuery({
    queryKey: ['program', params.programId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(`/program/${queryKey[1]}`);
      const { programDetailVo, participated, reviewList, faqList } = res.data;
      setProgram(programDetailVo);
      setParticipated(participated);
      setReviewList(reviewList);
      setFaqList(faqList);
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
    return <main className="program-detail" />;
  }

  if (isError) {
    return <main className="program-detail">에러 발생</main>;
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
          <ApplyAside program={program} participated={participated} />
        </main>
        <ApplySection
          program={program}
          participated={participated}
          isLoggedIn={isLoggedIn}
          setParticipated={setParticipated}
        />
      </div>
    </div>
  );
};

export default ProgramDetail;
