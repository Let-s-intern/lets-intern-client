import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import ChannelService from '../ChannelService';
import axios from '../libs/axios';
import Header from '../components/Program/ProgramDetail/Header';
import MainContent from '../components/Program/ProgramDetail/MainContent';
import ApplySection from '../components/Program/ProgramDetail/ApplySection';

import styles from './ProgramDetail.module.scss';
import '../styles/github-markdown-light.css';
import ApplyAside from './ProgamApply/ApplyAside/ApplyAside';

const ProgramDetail = () => {
  const params = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [program, setProgram] = useState<any>(null);
  const [participated, setParticipated] = useState<boolean>(false);
  const [reviewList, setReviewList] = useState<any>(null);
  const [faqList, setFaqList] = useState<any>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    ChannelService.hideChannelButton();
  }, []);

  const { isLoading, isError } = useQuery({
    queryKey: ['program', params.programId],
    queryFn: async ({ queryKey }) => {
      const token = localStorage.getItem('access-token');
      setIsLoggedIn(token ? true : false);

      const response = await axios.get(`/program/${queryKey[1]}`, {
        headers: {
          Authorization: token
            ? `Bearer ${localStorage.getItem('access-token')}`
            : '',
        },
      });

      return response;
    },
    onSuccess: ({ data }) => {
      setProgram(data.programDetailVo);
      setParticipated(data.participated);
      setReviewList(data.reviewList);
      setFaqList(data.faqList);

      setIsDataLoaded(true);
    },
  });

  if (isLoading || !isDataLoaded) {
    return <ProgramDetailBlock />;
  }

  if (isError) {
    return <ProgramDetailBlock>에러 발생</ProgramDetailBlock>;
  }

  return (
    <ProgramDetailBlock>
      <main className={styles.main}>
        <article>
          <Header title={program.title} />
          <MainContent
            program={program}
            reviewList={reviewList}
            faqList={faqList}
          />
        </article>
        <ApplyAside program={program} />
      </main>
      <ApplySection
        program={program}
        participated={participated}
        isLoggedIn={isLoggedIn}
        setParticipated={setParticipated}
      />
    </ProgramDetailBlock>
  );
};

export default ProgramDetail;

const ProgramDetailBlock = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 1080px) {
    max-width: 1080px;
  }
`;
