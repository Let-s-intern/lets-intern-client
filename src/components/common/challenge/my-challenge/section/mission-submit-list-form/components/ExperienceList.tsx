import DataTable from '@/components/common/table/DataTable';
import { getExperienceRowHeight } from '@/utils/experience';
import { ExperienceData, getExperienceHeaders } from '../data';

interface ExperienceListProps {
  experiences?: ExperienceData[];
}

export const ExperienceList = ({ experiences = [] }: ExperienceListProps) => {
  const headers = getExperienceHeaders();

  // 데이터가 없으면 안내 메시지 표시
  if (experiences.length === 0) {
    return (
      <p className="text-center text-xsmall14 text-neutral-20">
        작성한 경험 불러오기 버튼을 통해 <br />
        제출할 경험을 선택해주세요.(최소 3개이상)
      </p>
    );
  }

  // 데이터가 있으면 DataTable 렌더링
  return (
    <div className="h-[400px] w-full overflow-auto rounded-xxs border border-neutral-80 md:w-[852px]">
      <DataTable
        headers={headers}
        data={experiences.map((exp) => ({
          ...exp,
          id: exp.originalId,
        }))}
        getRowHeight={getExperienceRowHeight}
      />
    </div>
  );
};
