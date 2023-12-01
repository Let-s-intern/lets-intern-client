import { useNavigate, useParams } from 'react-router-dom';
import ProgramDetail from '../components/Program/ProgramDetail/ProgramDetail';
import { useEffect, useState } from 'react';
import axios from '../libs/axios';
import { isValidEmail, isValidPhoneNumber } from '../libs/valid';

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
  const [announcementDate, setAnnouncementDate] = useState<string>('');
  const [memberChecked, setMemberChecked] = useState<'USER' | 'GUEST' | ''>('');
  const [programType, setProgramType] = useState<string>('');
  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const token = localStorage.getItem('access-token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      try {
        const res = await axios.get(`/program/${params.programId}`, {
          headers: {
            Authorization: token
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        });
        setParticipated(res.data.participated);
        setProgram(res.data.programDetailVo);
        setProgramType(res.data.programDetailVo.type);
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
    if (!isFirstOpen) {
      setIsApplyModalOpen(true);
      return;
    }
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
        setMemberChecked('USER');
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
        setMemberChecked('');
      }
      setIsApplyModalOpen(true);
      if (isLoggedIn) {
        setApplyPageIndex(1);
      }
      setIsFirstOpen(false);
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
    if (applyPageIndex === 3) {
      setApplyPageIndex(0);
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
      setParticipated(true);
      setIsApplyModalOpen(false);
    } else {
      setIsApplyModalOpen(false);
    }
  };

  const handleApplyNextButton = () => {
    if (applyPageIndex === 1) {
      if (!isValidEmail(user.email)) {
        alert('이메일 형식이 올바르지 않습니다.');
        return;
      } else if (!isValidPhoneNumber(user.phoneNum)) {
        alert('휴대폰 번호 형식이 올바르지 않습니다.');
        return;
      }
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
      setAnnouncementDate(res.data.announcementDate);
      setApplyPageIndex(applyPageIndex + 1);
    } catch (error) {
      if ((error as any).response.status === 400) {
        alert((error as any).response.data.reason);
      }
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
      announcementDate={announcementDate}
      programType={programType}
      isFirstOpen={isFirstOpen}
      handleTabChange={handleTabChange}
      handleToggleOpenList={handleToggleOpenList}
      getToggleOpened={getToggleOpened}
      handleApplyButtonClick={handleApplyButtonClick}
      handleApplyModalClose={handleApplyModalClose}
      handleApplyNextButton={handleApplyNextButton}
      handleApplyInput={handleApplyInput}
      handleCautionChecked={handleCautionChecked}
      memberChecked={memberChecked}
      setMemberChecked={setMemberChecked}
    />
  );
};

export default ProgramDetailContainer;
