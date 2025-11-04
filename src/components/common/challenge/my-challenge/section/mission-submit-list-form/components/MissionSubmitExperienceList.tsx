import { If } from '@/components/common/If';
import { ExperienceData } from '../data';
import { EmptyState } from './EmptyState';
import { ExperienceList } from './ExperienceList';

interface MissionSubmitExperienceListProps {
  experienceCount: number;
  selectedExperiences: ExperienceData[];
  onOpenModal: () => void;
}

export const MissionSubmitExperienceList = ({
  experienceCount,
  selectedExperiences,
  onOpenModal,
}: MissionSubmitExperienceListProps) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-small18 font-semibold text-neutral-0">
          제출할 경험 목록
        </h3>
        <button
          type="button"
          onClick={onOpenModal}
          disabled={experienceCount < 3}
          className={`rounded-xxs border border-neutral-80 bg-white px-3 py-2 text-xsmall14 font-medium hover:bg-neutral-95 disabled:cursor-not-allowed disabled:bg-neutral-95 ${
            experienceCount >= 3
              ? 'text-primary'
              : 'text-neutral-50 disabled:text-neutral-30'
          }`}
        >
          작성한 경험 불러오기
        </button>
      </div>

      {/* 작성된 경험 불러오는 컴포넌트 */}
      <div className="flex min-h-[200px] items-center justify-center rounded-xxs border border-neutral-80 bg-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <If condition={experienceCount === 0}>
            <EmptyState
              text="작성된 경험이 없습니다."
              buttonText="경험 작성하러 가기"
            />
          </If>

          <If condition={experienceCount > 0 && experienceCount < 3}>
            <EmptyState
              text={`제출 가능한 경험이 3개 미만입니다.
미션을 제출하려면 최소 3개의 경험이 필요해요.`}
              buttonText="경험 작성하러 가기"
            />
          </If>

          <If condition={experienceCount >= 3}>
            <ExperienceList experiences={selectedExperiences} />
          </If>
        </div>
      </div>
    </section>
  );
};
