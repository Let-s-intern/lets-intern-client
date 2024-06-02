import { useParams } from 'react-router-dom';

import Header from '../../../components/common/program/program-detail/header/Header';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';

export type ProgramType = 'challenge' | 'live';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();

  const programId = Number(params.programId);

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl">
        <Header />
        <div className="flex min-h-screen items-start gap-10">
          <TabSection programId={programId} programType={programType} />
          <ApplySection programType={programType} programId={programId} />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
