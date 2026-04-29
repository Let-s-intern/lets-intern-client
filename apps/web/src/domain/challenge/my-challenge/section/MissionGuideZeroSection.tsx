import { UserChallengeMissionWithAttendance } from '@/schema';
import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';
import MissionFileLink from '../mission/MissionFileLink';
import MissionGuideSkeleton from './MissionGuideSkeleton';
import MissionHeaderSection from './MissionHeaderSection';

interface MissionGuideZeroSectionProps {
  className?: string;
  missionData?: UserChallengeMissionWithAttendance; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
  isLoading?: boolean; // 로딩 상태 추가
}

const MissionGuideZeroSection = ({
  className,
  missionData,
  selectedMissionTh,
  isLoading = false,
}: MissionGuideZeroSectionProps) => {
  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !missionData) {
    return <MissionGuideSkeleton variant="zero" />;
  }

  // endDate를 월일 시간 형식으로 변환
  const formatDeadline = (endDate?: Dayjs | null) => {
    if (!endDate) return '99.99 99:99';

    return endDate.format('MM.DD HH:mm');
  };

  // YouTube 링크를 임베드 링크로 변환
  const convertToEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube 링크 패턴들
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return null;
  };

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {/* 제목 및 마감일 섹션 */}
      <MissionHeaderSection
        selectedMissionTh={selectedMissionTh ?? 0}
        missionType={missionData?.missionInfo?.title || 'OT 시청'}
        deadline={formatDeadline(missionData?.missionInfo?.endDate)}
        missionStartDate={missionData.missionInfo.startDate}
      />
      {/* 미션 가이드 섹션 */}
      <section className="rounded-xs border-neutral-80 flex flex-col gap-5 border px-4 py-4">
        {/* 환영 섹션 */}
        <section className="flex flex-col gap-4">
          <p className="text-xsmall14 text-neutral-0 md:text-xsmall16 whitespace-pre-wrap">
            {missionData?.missionInfo?.description ||
              `환영합니다! \n챌린지가 시작하기 전에, \n전체적인 챌린지 흐름과 일정, 미션 제출 방법 등을 미리 알아보는 시간이에요. \n\n이번 0회차에서는 아래 3가지를 먼저 확인해주세요!`}
          </p>
        </section>
        {/* 분리선 섹션 */}
        <div className="bg-neutral-80 h-px" />
        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 text-neutral-10 font-semibold">
            미션 가이드
          </h3>
          <p className="text-xsmall14 text-neutral-10 md:text-xsmall16 whitespace-pre-wrap">
            {missionData?.missionInfo?.guide ||
              `이번 가이드는 앞으로의 챌린지를 어렵게 않게 이야기하기 위한 작은 준비 운동 같은 거예요. \n콘텐츠를 따라 직무 인터뷰를 정독하며 여러분이 이해한 방식대로 정리합시다 😀`}
          </p>
        </section>

        {/* 미션 자료 모음 섹션 */}
        <section className="rounded-xxs bg-neutral-95 flex flex-col gap-4 p-3 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xsmall16 text-neutral-0 font-semibold">
              미션 자료 모음
            </h3>
            <p className="text-xsmall14 text-neutral-10">
              자료를 확인하고 미션을 진행해 주세요.
            </p>
          </div>
          {/* 필수 콘텐츠 + 추가 콘텐츠 섹션 */}
          <div className="flex flex-col gap-2">
            {/* 필수 콘텐츠 */}
            <div className="flex flex-col gap-2">
              {missionData?.missionInfo?.essentialContentsList?.map(
                (content, index) => (
                  <MissionFileLink
                    key={content.id || index}
                    fileName={content.title || ''}
                    title={index === 0 ? '필수 콘텐츠' : ''}
                    disabled={false}
                    onClick={() => {
                      if (content?.link) {
                        window.open(content?.link, '_blank');
                      }
                    }}
                  />
                ),
              )}
            </div>
            {/* 추가 콘텐츠 */}
            <div className="flex flex-col gap-2">
              {missionData?.missionInfo?.additionalContentsList?.map(
                (content, index) => (
                  <MissionFileLink
                    key={content.id || index}
                    fileName={content.title || ''}
                    title={index === 0 ? '추가 콘텐츠' : ''}
                    disabled={false}
                    onClick={() => {
                      if (content?.link) {
                        window.open(content?.link, '_blank');
                      }
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        {/* OT 영상 섹션 */}
        {missionData?.missionInfo?.vodLink && (
          <section className="flex flex-col gap-3">
            <h3 className="text-neutral-0 text-lg font-semibold">OT 영상</h3>
            {convertToEmbedUrl(missionData.missionInfo.vodLink) ? (
              <div className="bg-neutral-95 relative flex aspect-video items-center justify-center rounded-sm">
                <iframe
                  src={convertToEmbedUrl(missionData.missionInfo.vodLink)!}
                  className="h-full w-full rounded-sm"
                  allowFullScreen
                  title="OT 영상"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className="bg-neutral-95 hover:bg-neutral-90 relative flex aspect-video cursor-pointer items-center justify-center rounded-sm transition-colors">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white shadow-lg">
                  <div className="border-l-neutral-0 ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-t-transparent" />
                </div>
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default MissionGuideZeroSection;
