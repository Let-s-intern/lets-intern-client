import { useNavigate, useParams } from 'react-router-dom';
import ProgramDetail from '../components/Program/ProgramDetail/ProgramDetail';
import { useEffect, useState } from 'react';
import axios from '../libs/axios';

const ProgramDetailContainer = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [program, setProgram] = useState<any>(null);
  const [reviewList, setReviewList] = useState<any>(null);
  const [faqList, setFaqList] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [tab, setTab] = useState<string>('DETAIL');
  const [toggleOpenList, setToggleOpenList] = useState<number[]>([]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/program/${params.programId}`);
        console.log(res.data);
        setProgram(res.data.programDetailVo);
        setReviewList(res.data.reviewList);
        setFaqList(res.data.faqList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, []);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleTabChange = (tab: string) => {
    setTab(tab);
  };

  const handleToggleOpenList = (faqId: number) => {
    const isOpen = toggleOpenList.includes(faqId);
    if (isOpen) {
      const newToggleOpenList = toggleOpenList.filter(
        (id: any) => id !== faqId,
      );
      setToggleOpenList(newToggleOpenList);
    } else {
      setToggleOpenList([...toggleOpenList, faqId]);
    }
  };

  const getToggleOpened = (faqId: number) => {
    return toggleOpenList.includes(faqId);
  };

  return (
    <ProgramDetail
      loading={loading}
      error={error}
      handleBackButtonClick={handleBackButtonClick}
      tab={tab}
      handleTabChange={handleTabChange}
      program={program}
      reviewList={reviewList}
      faqList={faqList}
      toggleOpenList={toggleOpenList}
      programId={Number(params.programId)}
      handleToggleOpenList={handleToggleOpenList}
      getToggleOpened={getToggleOpened}
    />
  );
};

export default ProgramDetailContainer;
