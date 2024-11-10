import { isNewProgram } from '@/lib/isDeprecatedProgram';
import { twMerge } from '@/lib/twMerge';
import FloatingNotification from '@components/common/FloatingNotification';
import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgramApplicationQuery } from '../../../api/application';
import { useProgramQuery } from '../../../api/program';
import FilledButton from '../../../components/common/program/program-detail/button/FilledButton';
import NotiButton from '../../../components/common/program/program-detail/button/NotiButton';
import Header from '../../../components/common/program/program-detail/header/Header';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import useRunOnce from '../../../hooks/useRunOnce';
import drawerReducer from '../../../reducers/drawerReducer';
import useAuthStore from '../../../store/useAuthStore';
import { ProgramType } from '../../../types/common';
import axios from '../../../utils/axios';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetailLegacy = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [isNew, setIsNew] = useState(true);

  const [programTitle, setProgramTitle] = useState('');
  const [isInstagramAlertOpen, setIsInstagramAlertOpen] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 991px)');
  const [isDrawerOpen, dispatchIsDrawerOpen] = useReducer(drawerReducer, false);

  const programId = Number(params.programId);
  const isInstagram = navigator.userAgent.includes('Instagram');

  const { isLoggedIn } = useAuthStore();

  useRunOnce(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('contentIndex')) {
      dispatchIsDrawerOpen({
        type: 'open',
      });
    }
  });

  const { data: application } = useProgramApplicationQuery(
    programType,
    programId,
  );

  const isAlreadyApplied = application?.applied ?? false;

  // 프로그램 제목 가져오기
  useQuery({
    queryKey: [programType, programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      setProgramTitle(res.data.data.title);
      return res.data;
    },
  });

  const program = useProgramQuery({ programId, type: programType });

  // 프로그램이 새로운 버전일 경우 기존 링크로 이동
  useEffect(() => {
    if (programType && program?.query.data) {
      if (isNewProgram({ desc: program.query.data.desc })) {
        navigate(`/program/${programType}/${programId}`, { replace: true });
      } else {
        setIsNew(false);
      }
    }
  }, [navigate, program.query.data, programId, programType]);

  const programDate =
    program && program.query.data
      ? {
          beginning: program.query.data.beginning,
          deadline: program.query.data.deadline,
          startDate: program.query.data.startDate,
          endDate: program.query.data.endDate,
        }
      : null;

  const loading = program.query.isLoading;

  const isOutOfDate =
    programDate?.beginning && programDate.deadline
      ? dayjs().isBefore(programDate.beginning) ||
        dayjs().isAfter(programDate.deadline)
      : false;

  const toggleDrawer = () => {
    if (isInstagram && !isInstagramAlertOpen) {
      setIsInstagramAlertOpen(true);
      return;
    }

    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      const params = new URLSearchParams();
      params.set('redirect', window.location.pathname);
      navigate(`/login?${params.toString()}`);
      return;
    }
    dispatchIsDrawerOpen({ type: 'toggle' });
  };

  const programTypeKor =
    programType === 'challenge'
      ? '챌린지'
      : programType === 'live'
        ? 'LIVE 클래스'
        : '프로그램';
  const title = `${programTitle ?? programTypeKor} | ${programTypeKor} - 렛츠커리어`;
  const url = `${window.location.origin}/program/${programType}/${programId}`;
  const description = program?.query?.data?.shortDesc ?? '';

  return (
    <div className="px-5">
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        {description ? <meta name="description" content={description} /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />

        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={url} />
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
      </Helmet>
      {isNew ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin h-32 w-32 rounded-full border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          <Header programTitle={programTitle} />
          <div className="flex min-h-screen flex-col">
            {/* 프로그램 상세 */}
            <section className="flex items-start gap-10 md:mt-8">
              <TabSection
                programId={programId}
                programType={programType}
                isNewProgram={isNew}
              />
              {isDesktop && (
                <ApplySection
                  programType={programType}
                  programId={programId}
                  programTitle={programTitle}
                />
              )}
            </section>

            {/* 모바일 신청 세션 */}
            {!isDesktop &&
              (isDrawerOpen ? (
                <MobileApplySection
                  programTitle={programTitle}
                  programType={programType}
                  programId={programId}
                  toggleDrawer={toggleDrawer}
                  dispatchDrawerIsOpen={dispatchIsDrawerOpen}
                />
              ) : (
                <div
                  className={twMerge(
                    'fixed bottom-0 left-0 right-0 z-30 flex w-screen flex-col gap-y-2.5 rounded-t-lg bg-static-100 px-5 pb-2.5 pt-3 shadow-05',
                  )}
                >
                  <div className="flex w-full justify-center bg-static-100">
                    <div
                      onClick={() =>
                        dispatchIsDrawerOpen({
                          type: 'close',
                        })
                      }
                      className="h-[5px] w-[70px] shrink-0 cursor-pointer rounded-full bg-neutral-80"
                    />
                  </div>
                  {isInstagramAlertOpen && <FloatingNotification />}
                  {loading ? (
                    <FilledButton
                      caption={'로딩 중 ...'}
                      disabled={false}
                      className="opacity-0"
                    />
                  ) : isOutOfDate ? (
                    <NotiButton
                      text={'출시알림신청'}
                      className="early_button"
                    />
                  ) : (
                    <FilledButton
                      onClick={toggleDrawer}
                      caption={isAlreadyApplied ? '신청완료' : '신청하기'}
                      disabled={isAlreadyApplied}
                      className="apply_button"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramDetailLegacy;
