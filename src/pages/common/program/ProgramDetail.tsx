import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useProgramApplicationQuery } from '../../../api/application';
import { useProgramQuery } from '../../../api/program';
import FilledButton from '../../../components/common/program/program-detail/button/FilledButton';
import NotiButton from '../../../components/common/program/program-detail/button/NotiButton';
import Header from '../../../components/common/program/program-detail/header/Header';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import drawerReducer from '../../../reducers/drawerReducer';
import useAuthStore from '../../../store/useAuthStore';
import { ProgramType } from '../../../types/common';
import axios from '../../../utils/axios';

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
  const isDesktop = useMediaQuery('(min-width: 991px)');
  const [isDrawerOpen, dispatchIsDrawerOpen] = useReducer(drawerReducer, false);

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
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    dispatchIsDrawerOpen({ type: 'toggle' });
  };

  const openApplyDrawer = () => {
    if (isAlreadyApplied || isOutOfDate) {
      return;
    }

    dispatchIsDrawerOpen({
      type: 'open',
    });
  };

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl">
        <Header programTitle={programTitle} />
        {/* Thumbnail */}
        <div className="flex justify-center">
          <img
            src={program.query.data?.thumbnail ?? '#'}
            alt="thumbnail"
            className="h-[20rem] w-full rounded-sm object-cover"
          />
        </div>
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
                  'fixed bottom-0 left-0 right-0 z-30 w-screen rounded-t-lg bg-static-100 px-5 pb-3 shadow-05',
                )}
              >
                <div className="flex w-full justify-center bg-static-100 py-3">
                  <div
                    onClick={() =>
                      dispatchIsDrawerOpen({
                        type: 'close',
                      })
                    }
                    className="h-[5px] w-[70px] shrink-0 cursor-pointer rounded-full bg-neutral-80"
                  />
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
