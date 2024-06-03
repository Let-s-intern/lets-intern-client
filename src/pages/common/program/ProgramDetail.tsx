import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Header from '../../../components/common/program/program-detail/header/Header';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import axios from '../../../utils/axios';
import { useState } from 'react';

export type ProgramType = 'challenge' | 'live';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();

  const [programTitle, setProgramTitle] = useState<string>('');

  const programId = Number(params.programId);

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
        <div className="flex min-h-screen items-start gap-10">
          <TabSection programId={programId} programType={programType} />
          <ApplySection
            programType={programType}
            programId={programId}
            programTitle={programTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
