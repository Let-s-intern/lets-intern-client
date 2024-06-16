import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';

import Header from '../../../components/common/program/program-detail/header/Header';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import axios from '../../../utils/axios';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';

export type ProgramType = 'challenge' | 'live';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();
  const [programTitle, setProgramTitle] = useState<string>('');
  const programId = Number(params.programId);
  const matches = useMediaQuery('(min-width: 991px)');
  const [open, setOpen] = useState(false);

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
          {/* 썸네일 */}
          <div className="max-h-60 w-full overflow-hidden rounded-xs">
            <img
              className="max-h-60 w-full object-cover"
              src="https://help.miricanvas.com/hc/article_attachments/900001052086/___________.png"
              alt="프로그램 상세 썸네일"
            />
          </div>
          {/* 프로그램 상세 */}
          <section className="flex items-start gap-10 md:mt-8">
            <TabSection programId={programId} programType={programType} />
            {matches && (
              <ApplySection
                programType={programType}
                programId={programId}
                programTitle={programTitle}
              />
            )}
          </section>
          {/* 모바일 신청 세션 */}
          {!matches && (
            <div className="fixed bottom-0 left-0 right-0 flex w-screen flex-col items-center rounded-t-lg bg-static-100 px-5 py-3 shadow-05">
              <div
                onClick={() => setOpen(!open)}
                className="mb-3 h-[5px] w-[70px] rounded-full bg-neutral-80"
              />
              {open ? (
                <MobileApplySection
                  programType={programType}
                  programId={programId}
                />
              ) : (
                <button
                  onClick={() => {
                    setOpen(true);
                  }}
                  className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100 disabled:border-neutral-70 disabled:bg-neutral-70"
                >
                  신청하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
