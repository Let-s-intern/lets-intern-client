import { AdditionalContent, EssentialContent } from '@/api/attendanceSchema';
import dayjs from '@/lib/dayjs';
import { UserChallengeMissionWithAttendance } from '@/schema';
import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';
import MissionFileLink from '../mission/MissionFileLink';
import MissionHeaderSection from './MissionHeaderSection';

interface MissionGuideRegularSectionProps {
  className?: string;
  todayTh: number;
  missionData?: UserChallengeMissionWithAttendance; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
}

// endDate를 월일 시간 형식으로 변환
const formatDeadline = (endDate?: Dayjs) => {
  if (!endDate) return '99.99 99:99';
  const date = dayjs(endDate);
  return date.format('MM.DD HH:mm');
};

const MissionGuideRegularSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
}: MissionGuideRegularSectionProps) => {
  // 현재 시간이 startDate 이상인지 확인하는 함수
  const isMissionStarted = () => {
    if (!missionData?.missionInfo?.startDate) return false;
    const startDate = dayjs(missionData.missionInfo.startDate);
    const now = dayjs();
    return now.isAfter(startDate) || now.isSame(startDate);
  };

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {/* 제목 및 마감일 섹션 */}
      <MissionHeaderSection
        selectedMissionTh={selectedMissionTh || todayTh}
        missionType={missionData?.missionInfo?.title || '직무 탐색'}
        deadline={formatDeadline(missionData?.missionInfo?.endDate)}
      />

      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 미션 목록 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="whitespace-pre-wrap text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
                {missionData?.missionInfo?.description ||
                  `데이터를 불러오는데 실패했습니다.`}
              </span>
            </div>
          </div>
        </section>

        <div className="h-px bg-neutral-80" />

        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-10">
            미션 가이드
          </h3>
          <p className="whitespace-pre-wrap text-xsmall14 font-medium text-neutral-10 md:text-xsmall16">
            {missionData?.missionInfo?.guide ||
              `미션 가이드를 불러오는데 실패했습니다.`}
          </p>
        </section>

        {/* 미션 자료 모음 섹션 - startDate 이후에만 노출 */}
        {isMissionStarted() && (
          <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
            <div className="flex flex-col">
              <h3 className="text-xsmall16 font-semibold text-neutral-0">
                미션 자료 모음
              </h3>
              <p className="text-xsmall14 text-neutral-10 md:text-xsmall16">
                자료를 확인하고 미션을 진행해 주세요.
              </p>
            </div>

            {/* 자료 링크들 */}
            <div className="flex flex-col gap-2">
              {/* 미션 템플릿 */}
              {missionData?.missionInfo?.templateLink && (
                <MissionFileLink
                  key={missionData?.missionInfo?.templateLink}
                  title="미션 템플릿"
                  fileName={'미션 템플릿'}
                  disabled={false}
                  onClick={() => {
                    window.open(
                      missionData?.missionInfo?.templateLink || '',
                      '_blank',
                    );
                  }}
                />
              )}
              {/* 필수 콘텐츠 */}
              {missionData?.missionInfo?.essentialContentsList?.map(
                (content: EssentialContent, index: number) => (
                  <MissionFileLink
                    key={content.id || index}
                    title="필수 콘텐츠"
                    fileName={content.title || ''}
                    disabled={false}
                    onClick={() => {
                      window.open(content.link || '#', '_blank');
                    }}
                  />
                ),
              )}

              {/* 추가 콘텐츠 */}
              <div className="flex flex-col gap-2">
                {missionData?.missionInfo?.additionalContentsList?.map(
                  (content: AdditionalContent, index: number) => (
                    <MissionFileLink
                      key={content.id || index}
                      title={index === 0 ? '추가 콘텐츠' : ''}
                      fileName={content.title ?? '추가 콘텐츠'}
                      disabled={false}
                      onClick={() => {
                        window.open(content.link || '#', '_blank');
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default MissionGuideRegularSection;
