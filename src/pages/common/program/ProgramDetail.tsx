import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mui/material';
import { useReducer, useState } from 'react';

import Header from '../../../components/common/program/program-detail/header/Header';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import axios from '../../../utils/axios';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';
import drawerReducer from '../../../reducers/drawerReducer';
import ApplyModal from '../../../components/common/program/program-detail/apply/modal/ApplyModal';
import applyReducer from '../../../reducers/applyReducer';
import FilledButton from '../../../components/common/program/program-detail/button/FilledButton';

export type ProgramType = 'challenge' | 'live';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();
  const [programTitle, setProgramTitle] = useState<string>('');
  const programId = Number(params.programId);
  const matches = useMediaQuery('(min-width: 991px)');
  const [isOpen, drawerDispatch] = useReducer(drawerReducer, false);
  const [isComplete, applyDispatch] = useReducer(applyReducer, false);

  const toggleApplyModal = () => {
    applyDispatch({ type: 'toggle' });
  };
  const toggleDrawer = () => {
    drawerDispatch({ type: 'toggle' });
  };

  useQuery({
    queryKey: [programType, programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      setProgramTitle(res.data.data.title);
      return res.data;
    },
  });

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
            <div className="fixed bottom-0 left-0 right-0 flex w-screen flex-col items-center max-h-[25rem] z-30 scrollbar-hide rounded-t-lg bg-static-100 px-5 py-3 shadow-05 overflow-y-auto">
              <div
                onClick={() => drawerDispatch({ type: 'toggle' })}
                className="mb-3 h-[5px] w-[70px] cursor-pointer rounded-full bg-neutral-80"
              />
              {isOpen ? (
                <MobileApplySection
                  programType={programType}
                  programId={programId}
                  toggleApplyModal={toggleApplyModal}
                  toggleDrawer={toggleDrawer}
                />
              ) : (
                // 모집 전이면 사전알림신청 버튼 표시
                <FilledButton onClick={toggleDrawer} caption="신청하기" />
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
