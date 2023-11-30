import { useNavigate, useParams } from 'react-router-dom';
import ProgramDetail from '../components/Program/ProgramDetail/ProgramDetail';
import { useEffect, useState } from 'react';
import axios from '../libs/axios';

const ProgramDetailContainer = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [participated, setParticipated] = useState<boolean>(false);
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
  const [hasDetailInfo, setHasDetailInfo] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);
  const [cautionChecked, setCautionChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('access-token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/program/${params.programId}`, {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        });
        setParticipated(res.data.participated);
        setProgram(res.data.programDetailVo);
        setReviewList(res.data.reviewList);
        setFaqList(res.data.faqList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
    fetchProgram();
  }, []);

  useEffect(() => {
    if (applyPageIndex !== 1) {
      return;
    }
    setIsNextButtonDisabled(true);
    if (
      user.grade &&
      user.wishCompany &&
      user.wishJob &&
      user.applyMotive &&
      user.name &&
      user.email &&
      user.phoneNum &&
      user.major &&
      user.university &&
      user.inflowPath
    ) {
      setIsNextButtonDisabled(false);
    }
  }, [applyPageIndex, user]);

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
      if (isLoggedIn) {
        const { data: hasDetailInfoData } =
          await axios.get('/user/detail-info');
        const res = await axios.get(`/user`);
        setUser({
          ...res.data,
          major: hasDetailInfoData ? res.data.major : '',
          university: hasDetailInfoData ? res.data.university : '',
          grade: '',
          wishCompany: '',
          wishJob: '',
          applyMotive: '',
          preQuestions: '',
        });
        setHasDetailInfo(hasDetailInfoData);
      } else {
        setUser({
          name: '',
          email: '',
          phoneNum: '',
          major: '',
          university: '',
          grade: '',
          wishCompany: '',
          wishJob: '',
          applyMotive: '',
          preQuestions: '',
        });
      }
      setIsApplyModalOpen(true);
      if (isLoggedIn) {
        setApplyPageIndex(1);
      }
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
    setIsNextButtonDisabled(false);
    setIsApplyModalOpen(false);
  };

  const handleApplyNextButton = () => {
    if (applyPageIndex === 1) {
      setApplyPageIndex(applyPageIndex + 1);
      setCautionChecked(false);
      setIsNextButtonDisabled(true);
    } else if (applyPageIndex === 2) {
      handleApplySubmit();
    } else if (applyPageIndex === 3) {
      if (isLoggedIn) {
        navigate('/mypage/application');
      } else {
        handleApplyModalClose();
      }
    } else {
      setApplyPageIndex(applyPageIndex + 1);
    }
  };

  const handleApplySubmit = async () => {
    try {
      let newUser = { ...user, grade: Number(user.grade) };
      if (!isLoggedIn) {
        delete newUser.name;
        delete newUser.email;
        delete newUser.phoneNum;
        newUser = {
          ...newUser,
          guestName: user.name,
          guestEmail: user.email,
          guestPhoneNum: user.phoneNum,
        };
      }
      const res = await axios.post(
        `/application/${params.programId}`,
        newUser,
        {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        },
      );
      console.log(res);
      setApplyPageIndex(applyPageIndex + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCautionChecked = () => {
    setIsNextButtonDisabled(cautionChecked);
    setCautionChecked(!cautionChecked);
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
      hasDetailInfo={hasDetailInfo}
      isLoggedIn={isLoggedIn}
      isNextButtonDisabled={isNextButtonDisabled}
      participated={participated}
      cautionChecked={cautionChecked}
      handleBackButtonClick={handleBackButtonClick}
      handleTabChange={handleTabChange}
      handleToggleOpenList={handleToggleOpenList}
      getToggleOpened={getToggleOpened}
      handleApplyButtonClick={handleApplyButtonClick}
      handleApplyModalClose={handleApplyModalClose}
      handleApplyNextButton={handleApplyNextButton}
      handleApplyInput={handleApplyInput}
      handleCautionChecked={handleCautionChecked}
    />
  );
};

export default ProgramDetailContainer;
