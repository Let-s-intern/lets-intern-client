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
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyPageIndex, setApplyPageIndex] = useState<number>(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/program/${params.programId}`);
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

  const handleApplyButtonClick = async () => {
    try {
      const { data: hasDetailInfo } = await axios.get('/user/detail-info');
      const res = await axios.get(`/user`);
      setUser({
        ...res.data,
        major: hasDetailInfo ? res.data.major : '',
        school: hasDetailInfo ? res.data.school : '',
        university: hasDetailInfo ? res.data.university : '',
        grade: '',
        wishCompany: '',
        wishJob: '',
        applyMotive: '',
        preQuestions: '',
      });
      setIsApplyModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyInput = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleApplyModalClose = () => {
    setApplyPageIndex(0);
    setIsApplyModalOpen(false);
  };

  const handleApplyNextButton = () => {
    if (applyPageIndex === 3) {
      setIsApplyModalOpen(false);
      setApplyPageIndex(0);
    } else {
      setApplyPageIndex(applyPageIndex + 1);
    }
  };

  return (
    <ProgramDetail
      loading={loading}
      error={error}
      tab={tab}
      program={program}
      reviewList={reviewList}
      faqList={faqList}
      toggleOpenList={toggleOpenList}
      isApplyModalOpen={isApplyModalOpen}
      applyPageIndex={applyPageIndex}
      user={user}
      handleBackButtonClick={handleBackButtonClick}
      handleTabChange={handleTabChange}
      handleToggleOpenList={handleToggleOpenList}
      getToggleOpened={getToggleOpened}
      handleApplyButtonClick={handleApplyButtonClick}
      handleApplyModalClose={handleApplyModalClose}
      handleApplyNextButton={handleApplyNextButton}
      handleApplyInput={handleApplyInput}
    />
  );
};

export default ProgramDetailContainer;
