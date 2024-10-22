import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import isDeprecatedProgram from '@/lib/isDeprecatedProgram';
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

  // 프로그램이 옛 버전일 경우 옛 링크로 이동
  useEffect(() => {
    if (
      programId &&
      programType &&
      program &&
      program.query.data &&
      isDeprecatedProgram({ desc: program.query.data.desc })
    ) {
      navigate(`/program/${programType}/old/${programId}`);
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
      <div className="mx-auto max-w-5xl">
        <Header programTitle={programTitle} />
        <div className="flex min-h-screen flex-col">
          {/* 프로그램 상세 */}
          <section className="flex items-start gap-10 md:mt-8">
            <TabSection programId={programId} programType={programType} />
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
                {isInstagramAlertOpen && (
                  <div className="flex w-full items-start gap-x-2 bg-[#FEFFC8] p-4">
                    <img
                      src="/icons/warning.svg"
                      alt="warning"
                      className="h-6 w-6"
                    />
                    <div className="flex w-full flex-col text-xsmall14 text-neutral-0">
                      <p className="font-bold">
                        [결제오류 방지] 외부 브라우저로 접속해주세요
                      </p>
                      <p>
                        상단 더보기 버튼 혹은 하단 공유 버튼을 누르면 외부
                        브라우저로 이동할 수 있어요.
                      </p>
                    </div>
                  </div>
                )}
                {loading ? (
                  <FilledButton
                    onClick={() => {}}
                    caption={'로딩 중 ...'}
                    isAlreadyApplied={false}
                    className="opacity-0"
                  />
                ) : isOutOfDate ? (
                  <NotiButton text={'출시알림신청'} className="early_button" />
                ) : (
                  <FilledButton
                    onClick={toggleDrawer}
                    caption={isAlreadyApplied ? '신청완료' : '신청하기'}
                    isAlreadyApplied={isAlreadyApplied}
                    className="apply_button"
                  />
                )}
              </div>
            ))}

          {/* 하단 신청하기 CTA */}
          <div className="fixed bottom-4 left-0 right-0 z-10 mx-auto flex max-w-[56rem] items-center justify-between rounded-sm bg-white p-4 shadow-04">
            <div>
              <span>
                {programDate?.deadline?.format('M월 D일 (dd) A h시')}까지 모집
              </span>
              <div>
                <span>모집 마감</span>{' '}
                <span>
                  {programDate?.deadline
                    ? dayjs
                        .duration(programDate.deadline.diff(dayjs()))
                        .format('DD:HH:mm:ss')
                    : '00:00:00:00'}
                </span>
              </div>
            </div>
            <button
              className="w-2/6 rounded-full bg-slate-600 py-3 text-static-100"
              disabled={isAlreadyApplied}
              onClick={() => {
                if (!isLoggedIn) {
                  navigate(`/login?redirect=${window.location.pathname}`);
                  return;
                }
                // 결제 페이지로 이동
              }}
            >
              {isAlreadyApplied ? '신청완료' : '신청하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailLegacy;
