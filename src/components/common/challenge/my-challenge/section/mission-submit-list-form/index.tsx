import { If } from '@/components/common/If';
import { ExperienceData } from '@components/common/DataTable';
import { useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { ExperienceList } from './components/ExperienceList';
import { ExperienceSelectModal } from './components/ExperienceSelectModal';
import { dummyExperiences } from './data';

interface MissionSubmitListFormProps {
  experienceCount?: number;
  experiences?: ExperienceData[];
}

export const MissionSubmitListForm = ({
  experienceCount = 0,
}: MissionSubmitListFormProps) => {
  // 테스트용으로 experienceCount를 4로 설정
  experienceCount = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectComplete = () => {
    // TODO: 선택된 경험 ID를 실제 경험 데이터로 변환
    // 선택된 경험들을 처리하는 로직 추가 예정
    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6">
      {/* 미션 제출 안내사항 */}
      <section>
        <h3 className="mb-3 text-small18 font-semibold text-neutral-0">
          미션 제출 안내사항
        </h3>
        <div className="rounded-xxs bg-neutral-95 p-3">
          <ul className="text-xsmall14 text-neutral-10">
            <li className="flex items-start">
              <span className="mr-2 text-neutral-10">-</span>
              <span>
                미션 시작일 이후 작성하거나 수정한 경험만 제출할 수 있어요.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-neutral-10">-</span>
              <span>
                아직 경험을 작성하지 않았거나 삭제, 수정이 필요하다면,{' '}
                <a
                  href="/career/experience"
                  className="text-primary underline hover:text-primary/80"
                >
                  [커리어 관리 &gt; 경험 정리]
                </a>
                에서 진행해주세요.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-neutral-10">-</span>
              <span>
                제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 제출할 경험 목록 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-small18 font-semibold text-neutral-0">
            제출할 경험 목록
          </h3>
          <button
            type="button"
            onClick={handleOpenModal}
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
        <div className="flex min-h-[200px] items-center justify-center rounded-xxs border border-neutral-80 bg-white p-6">
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
              <ExperienceList experiences={dummyExperiences} />
            </If>
          </div>
        </div>
      </section>

      {/* 경험 선택 모달 */}
      <ExperienceSelectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectComplete={handleSelectComplete}
      />
    </div>
  );
};
