import dayjs from '@/lib/dayjs';
import { clsx } from 'clsx';
import MissionFileLink from './MissionFileLink';
import MissionHeaderSection from './MissionHeaderSection';

interface MissionGuideZeroSectionProps {
  className?: string;
  todayTh: number;
  missionData?: any; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
}

const MissionGuideZeroSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
}: MissionGuideZeroSectionProps) => {
  // endDate를 월일 시간 형식으로 변환
  const formatDeadline = (endDate: string) => {
    if (!endDate) return '04.04 11:59';
    const date = dayjs(endDate);
    return date.format('MM.DD HH:mm');
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
        todayTh={selectedMissionTh || todayTh}
        missionType={missionData?.missionInfo?.title || 'OT 시청'}
        deadline={formatDeadline(missionData?.missionInfo?.endDate)}
      />
      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 환영 섹션 */}
        <section className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap text-xsmall16 text-neutral-0">
            {missionData?.missionInfo?.description ||
              `환영합니다! \n챌린지가 시작하기 전에, \n전체적인 챌린지 흐름과 일정, 미션 제출 방법 등을 미리 알아보는 시간이에요. \n\n이번 0회차에서는 아래 3가지를 먼저 확인해주세요!`}
          </p>
        </section>
        {/* 분리선 섹션 */}
        <div className="h-px bg-neutral-80" />
        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-10">
            미션 가이드
          </h3>
          <p className="whitespace-pre-wrap text-xsmall16 text-neutral-10">
            {missionData?.missionInfo?.guide ||
              `이번 가이드는 앞으로의 챌린지를 어렵게 않게 이야기하기 위한 작은 준비 운동 같은 거예요. \n콘텐츠를 따라 직무 인터뷰를 정독하며 여러분이 이해한 방식대로 정리합시다 😀`}
          </p>
        </section>

        {/* 미션 자료 모음 섹션 */}
        <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xsmall16 font-semibold text-neutral-0">
              미션 자료 모음
            </h3>
            <p className="text-xsmall16 text-neutral-10">
              자료를 확인하고 미션을 진행해 주세요.
            </p>
          </div>
          {/* 필수 콘텐츠 + 추가 콘텐츠 섹션 */}
          <div className="flex flex-col gap-2">
            {/* 필수 콘텐츠 */}
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

        {/* OT 영상 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-neutral-0">OT 영상</h3>
          {missionData?.missionInfo?.vodLink &&
          convertToEmbedUrl(missionData.missionInfo.vodLink) ? (
            <div className="relative flex aspect-video items-center justify-center rounded-sm bg-neutral-95">
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
            <div className="relative flex aspect-video cursor-pointer items-center justify-center rounded-sm bg-neutral-95 transition-colors hover:bg-neutral-90">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white shadow-lg">
                <div className="ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-neutral-0 border-t-transparent" />
              </div>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default MissionGuideZeroSection;
