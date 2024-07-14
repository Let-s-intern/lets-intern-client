import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplyModal from '../../../components/common/program/program-detail/apply/modal/ApplyModal';
import FilledButton from '../../../components/common/program/program-detail/button/FilledButton';
import NotiButton from '../../../components/common/program/program-detail/button/NotiButton';
import Header from '../../../components/common/program/program-detail/header/Header';
import ApplySection, {
  PayInfo,
  UserInfo,
} from '../../../components/common/program/program-detail/section/ApplySection';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import applyReducer from '../../../reducers/applyReducer';
import drawerReducer from '../../../reducers/drawerReducer';
import useAuthStore from '../../../store/useAuthStore';
import axios from '../../../utils/axios';
import { REMINDER_LINK } from '../../../utils/programConst';

export type ProgramType = 'challenge' | 'live';

interface ProgramDate {
  deadline: string;
  startDate: string;
  endDate: string;
  beginning: string;
}
interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [programTitle, setProgramTitle] = useState('');
  const programId = Number(params.programId);
  const matches = useMediaQuery('(min-width: 991px)');
  const [isOpen, drawerDispatch] = useReducer(drawerReducer, false);
  const [isComplete, applyDispatch] = useReducer(applyReducer, false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [programInfo, setProgramInfo] = useState<ProgramDate>({
    startDate: '',
    endDate: '',
    beginning: '',
    deadline: '',
  });
  const [disabledButton, setDisabledButton] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
  });
  const [payInfo, setPayInfo] = useState<PayInfo>({
    priceId: 0,
    price: 0,
    discount: 0,
    accountNumber: '',
    deadline: '',
    accountType: '',
    livePriceType: '',
    challengePriceType: '',
    couponId: null,
    couponPrice: 0,
  });
  const [criticalNotice, setCriticalNotice] = useState<string>('');
  const [priceId, setPriceId] = useState<number>(0);
  const [isCautionChecked, setIsCautionChecked] = useState<boolean>(false);
  const [contentIndex, setContentIndex] = useState(0);

  useQuery({
    queryKey: [programType, programId, 'application'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/${programType}/${programId}/application`);
        const data = res.data.data;
        setUserInfo({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          contactEmail: data.contactEmail || '',
          question: '',
        });
        setCriticalNotice(data.criticalNotice);
        if (programType === 'challenge') {
          setPriceId(data.priceList[0].priceId);
          setPayInfo({
            priceId: data.priceList[0].priceId,
            couponId: null,
            price: data.priceList[0].price,
            discount: data.priceList[0].discount,
            couponPrice: 0,
            accountNumber: data.priceList[0].accountNumber,
            deadline: data.priceList[0].deadline,
            accountType: data.priceList[0].accountType,
            livePriceType: data.priceList[0].livePriceType,
            challengePriceType: data.priceList[0].challengePriceType,
          });
        } else {
          setIsCautionChecked(true);
          setPriceId(data.price.priceId);
          setPayInfo({
            priceId: data.price.priceId,
            couponId: null,
            price: data.price.price,
            discount: data.price.discount,
            couponPrice: 0,
            accountNumber: data.price.accountNumber,
            deadline: data.price.deadline,
            accountType: data.price.accountType,
            livePriceType: data.price.livePriceType,
            challengePriceType: data.price.challengePriceType,
          });
        }
        // console.log(data);
        setIsAlreadyApplied(data.applied);
        setDisabledButton(!data.applied);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (contentIndex !== 0 && !isResumed) {
      setIsResumed(true);
    }
  }, [contentIndex, isResumed]);

  // 프로그램 제목 가져오기
  useQuery({
    queryKey: [programType, programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      setProgramTitle(res.data.data.title);
      return res.data;
    },
  });

  // 프로그램 일정 가져오기
  useQuery({
    queryKey: [programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}`);
      const { beginning, deadline, startDate, endDate } = res.data.data;
      setProgramInfo({ startDate, endDate, beginning, deadline });
      setDisabledButton(
        new Date() < new Date(beginning) || new Date() > new Date(deadline),
      );
      return res.data;
    },
  });

  const toggleApplyModal = () => {
    applyDispatch({ type: 'toggle' });
  };
  const toggleDrawer = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    drawerDispatch({ type: 'toggle' });
  };
  const handleDrawer = () => {
    if (!isAlreadyApplied && !disabledButton) toggleDrawer();
  };
  const clickNotiButton = () => {
    window.open(REMINDER_LINK, '_blank');
  };

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl">
        <Header programTitle={programTitle} />
        <div className="flex min-h-screen flex-col">
          {/* 프로그램 상세 */}
          <section className="flex items-start gap-10 md:mt-8">
            <TabSection programId={programId} programType={programType} />
            {matches && (
              <ApplySection
                programType={programType}
                programId={programId}
                programTitle={programTitle}
                toggleApplyModal={toggleApplyModal}
              />
            )}
          </section>

          {/* 모바일 신청 세션 */}
          {!matches && (
            <div className="fixed bottom-0 left-0 right-0 z-30 flex max-h-[25rem] w-screen flex-col items-center overflow-hidden rounded-t-lg bg-static-100 px-5 pb-3 shadow-05 scrollbar-hide">
              <div className="sticky top-0 flex w-full justify-center bg-static-100 py-3">
                <div
                  onClick={handleDrawer}
                  className="h-[5px] w-[70px] shrink-0 cursor-pointer rounded-full bg-neutral-80"
                />
              </div>
              {isOpen ? (
                <MobileApplySection
                  programTitle={programTitle}
                  programType={programType}
                  programId={programId}
                  toggleApplyModal={toggleApplyModal}
                  toggleDrawer={toggleDrawer}
                  drawerDispatch={drawerDispatch}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  payInfo={payInfo}
                  setPayInfo={setPayInfo}
                  criticalNotice={criticalNotice}
                  priceId={priceId}
                  programDate={programInfo}
                  isApplied={isAlreadyApplied}
                  setIsApplied={setIsAlreadyApplied}
                  isCautionChecked={isCautionChecked}
                  setIsCautionChecked={setIsCautionChecked}
                  contentIndex={contentIndex}
                  setContentIndex={setContentIndex}
                />
              ) : // 모집 예정 or 모집 종료이면 출시알림신청 버튼 표시
              programInfo.beginning === '' || programInfo.deadline === '' ? (
                <FilledButton
                  onClick={() => {}}
                  caption={'로딩 중 ...'}
                  isAlreadyApplied={false}
                  className="opacity-0"
                />
              ) : new Date() < new Date(programInfo.beginning) ||
                new Date() > new Date(programInfo.deadline) ? (
                <NotiButton
                  onClick={clickNotiButton}
                  caption={'출시알림신청'}
                  className="early_button"
                />
              ) : (
                <FilledButton
                  onClick={toggleDrawer}
                  caption={
                    isAlreadyApplied
                      ? '신청완료'
                      : isResumed
                        ? '이어서 신청하기'
                        : '신청하기'
                  }
                  isAlreadyApplied={isAlreadyApplied}
                  className="apply_button"
                />
              )}
            </div>
          )}
        </div>
      </div>
      {isComplete && <ApplyModal toggle={toggleApplyModal} />}
    </div>
  );
};

export default ProgramDetail;
