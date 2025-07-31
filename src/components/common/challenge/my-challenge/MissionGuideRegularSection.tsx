import dayjs from '@/lib/dayjs';
import { clsx } from 'clsx';
import MissionHeaderSection from './MissionHeaderSection';

interface MissionGuideRegularSectionProps {
  className?: string;
  todayTh: number;
  missionData?: any; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
}

const MissionGuideRegularSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
}: MissionGuideRegularSectionProps) => {
  // endDate를 월일 시간 형식으로 변환
  const formatDeadline = (endDate: string) => {
    if (!endDate) return '04.04 11:59';
    const date = dayjs(endDate);
    return date.format('MM.DD HH:mm');
  };

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {/* 제목 및 마감일 섹션 */}
      <MissionHeaderSection
        todayTh={selectedMissionTh || todayTh}
        missionType={missionData?.missionInfo?.title || '직무 탐색'}
        deadline={formatDeadline(missionData?.missionInfo?.endDate)}
      />

      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 미션 목록 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="whitespace-pre-wrap text-xsmall16 font-medium text-neutral-0">
                {missionData?.missionInfo?.description ||
                  `1. 대시보드 사용법 및 미션 인증 방식꼭 확인! \n2.마케팅 관심 직무 1개 이상 선정하기 \n3. 각각 인터뷰 3개 이상 정리하기 \n4. 각각 채용공고 5개 이상 정리 \n📸 [링크] 제출하기 & [인증샷]과 [소감] 업로드하기 \n\n추가 콘텐츠에서 160+명의 취업 성공 노하우를 확인해보세요 🎁`}
              </span>
            </div>
          </div>
        </section>

        {/* 분리선 섹션 */}
        {/* <div className="h-px bg-neutral-80" /> */}

        {/* 미션 가이드 섹션
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-10">
            미션 가이드
          </h3>
          <p className="whitespace-pre-wrap text-xsmall16 font-medium text-neutral-10">
            {missionData?.missionInfo?.guide ||
              `내가 막연히 꿈꾸던 마케팅, 정말 잘 알고 있었나 점검해봐요. \n콘텐츠를 따라 직무 인터뷰를 정독하며 여러분이 이해한 방식대로 정리합시다 😊`}
          </p>
        </section>
*/}
        {/* 미션 자료 모음 섹션 */}
        {/* <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xsmall16 font-semibold text-neutral-0">
              미션 자료 모음
            </h3>
            <p className="text-xsmall16 text-neutral-10">
              자료를 확인하고 미션을 진행해 주세요.
            </p>
          </div>

          {/* 자료 링크들 */}
        {/*
          <div className="flex flex-col gap-2">
            {/* 필수 콘텐츠 */}
        {/*
            {missionData?.missionInfo?.essentialContentsList?.map(
              (content: any, index: number) => (
                <MissionFileLink
                  key={content.id || index}
                  title="필수 콘텐츠"
                  fileName={content.title}
                  disabled={false}
                />
              ),
            )}

            {/* 추가 콘텐츠 */}
        {/*
            <div className="flex flex-col gap-2">
              {missionData?.missionInfo?.additionalContentsList?.map(
                (content: any, index: number) => (
                  <MissionFileLink
                    key={content.id || index}
                    title={index === 0 ? '추가 콘텐츠' : ''}
                    fileName={content.title}
                    disabled={false}
                  />
                ),
              )}
            </div>
          </div>
        </section>
        */}
      </section>
    </div>
  );
};

export default MissionGuideRegularSection;
