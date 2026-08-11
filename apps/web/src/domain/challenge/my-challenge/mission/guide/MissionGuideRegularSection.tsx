import { Content } from '@/domain/challenge/api/attendanceSchema';
import { logMissionContentAccess } from '@/domain/challenge/api/missionContentAccessLog';
import MissionFileLink from '@/domain/challenge/my-challenge/mission/guide/MissionFileLink';
import MissionHeaderSection from '@/domain/challenge/my-challenge/mission/guide/MissionHeaderSection';
import dayjs from '@/lib/dayjs';
import { UserChallengeMissionWithAttendance } from '@/schema';
import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';
import { useParams } from 'next/navigation';
import MissionGuideSkeleton from './MissionGuideSkeleton';

interface MissionGuideRegularSectionProps {
  className?: string;
  todayTh: number | null;
  missionData?: UserChallengeMissionWithAttendance; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
  isLoading?: boolean; // 로딩 상태 추가
}

// endDate를 월일 시간 형식으로 변환
const formatDeadline = (endDate?: Dayjs | null) => {
  if (!endDate) return '99.99 99:99';
  const date = dayjs(endDate);
  return date.format('MM.DD HH:mm');
};

const MissionGuideRegularSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
  isLoading = false,
}: MissionGuideRegularSectionProps) => {
  // 자료 열람 기록에 쓸 챌린지 id. 라우트가 /challenge/[applicationId]/[programId]/me 라
  // programId 가 곧 challengeId 다. 부모에서 prop 으로 내려받지 않아도 여기서 읽을 수 있다.
  const params = useParams<{ programId: string }>();
  const challengeId = Number(params?.programId) || null;

  // 현재 시간이 startDate 이상인지 확인하는 함수
  const isMissionStarted = () => {
    if (!missionData?.missionInfo?.startDate) return false;
    const startDate = dayjs(missionData.missionInfo.startDate);
    const now = dayjs();
    return now.isAfter(startDate) || now.isSame(startDate);
  };

  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !missionData) {
    return <MissionGuideSkeleton variant="regular" />;
  }

  const missionId = missionData.missionInfo.id;

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {/* 제목 및 마감일 섹션 */}
      <MissionHeaderSection
        selectedMissionTh={selectedMissionTh || todayTh}
        missionType={missionData?.missionInfo?.title || '직무 탐색'}
        deadline={formatDeadline(missionData?.missionInfo?.endDate)}
        missionStartDate={missionData.missionInfo.startDate}
      />

      {/* 미션 가이드 섹션 */}
      <section className="rounded-xs border-neutral-80 flex flex-col gap-5 border px-4 py-4">
        {/* 미션 목록 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-xsmall14 text-neutral-0 md:text-xsmall16 whitespace-pre-wrap font-medium">
                {missionData?.missionInfo?.description ||
                  '미션 설명이 없습니다.'}
              </span>
            </div>
          </div>
        </section>

        <div className="bg-neutral-80 h-px" />

        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 text-neutral-10 font-semibold">
            미션 가이드
          </h3>
          <p className="text-xsmall14 text-neutral-10 md:text-xsmall16 whitespace-pre-wrap font-medium">
            {missionData?.missionInfo?.guide || '미션 가이드가 없습니다.'}
          </p>
        </section>

        {/* 미션 자료 모음 섹션 - startDate 이후에만 노출 */}
        {isMissionStarted() && (
          <section className="rounded-xxs bg-neutral-95 flex flex-col gap-4 p-3 pb-5">
            <div className="flex flex-col">
              <h3 className="text-xsmall16 text-neutral-0 font-semibold">
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
                    const templateLink =
                      missionData?.missionInfo?.templateLink || '';
                    // window.open 을 먼저, 동기적으로 호출한다.
                    // 기록 요청을 await 한 뒤로 밀면 사용자 제스처 컨텍스트를 잃어
                    // 브라우저가 팝업을 차단한다.
                    window.open(templateLink, '_blank');
                    // 열지 않은 자료를 이용한 것으로 남기면 안 되므로 링크가 있을 때만 기록한다.
                    if (templateLink) {
                      // 템플릿은 콘텐츠 엔티티가 아니라 미션의 단일 필드라
                      // contentId 가 없다. 바디에서도 생략된다.
                      logMissionContentAccess({
                        challengeId,
                        missionId,
                        contentType: 'TEMPLATE',
                        // 자료 이름이 무엇을 열었는지 말해 주는 유일한 수단이다.
                        contentTitle: '미션 템플릿',
                      });
                    }
                  }}
                />
              )}
              {/* 필수 콘텐츠 */}
              {missionData?.missionInfo?.essentialContentsList?.map(
                (content: Content, index: number) => (
                  <MissionFileLink
                    key={content.id || index}
                    title="필수 콘텐츠"
                    fileName={content.title || '필수 콘텐츠'}
                    disabled={false}
                    onClick={() => {
                      // window.open 을 먼저, 동기적으로 호출한다. 기록 요청 뒤로 밀면
                      // 사용자 제스처 컨텍스트를 잃어 팝업이 차단된다.
                      window.open(content.link || '#', '_blank');
                      // 링크가 없으면 자료를 연 것이 아니므로 기록하지 않는다.
                      if (content.link) {
                        logMissionContentAccess({
                          challengeId,
                          missionId,
                          // 서버 배포 전에는 missionContentsId 가 없다. 그때는 자료 번호로 남겨
                          // 기록이 비는 구간을 만들지 않는다. 두 번호가 섞이는 건 배포 직후
                          // 로그를 비우면서 정리된다(LC-3201).
                          contentId: content.missionContentsId ?? content.id,
                          contentType: 'ESSENTIAL',
                          contentTitle: content.title,
                        });
                      }
                    }}
                  />
                ),
              )}

              {/* 추가 콘텐츠 */}
              <div className="flex flex-col gap-2">
                {missionData?.missionInfo?.additionalContentsList?.map(
                  (content: Content, index: number) => (
                    <MissionFileLink
                      key={content.id || index}
                      title={index === 0 ? '추가 콘텐츠' : ''}
                      fileName={content.title ?? '추가 콘텐츠'}
                      disabled={false}
                      onClick={() => {
                        // window.open 을 먼저, 동기적으로 호출한다. 기록 요청 뒤로 밀면
                        // 사용자 제스처 컨텍스트를 잃어 팝업이 차단된다.
                        window.open(content.link || '#', '_blank');
                        // 링크가 없으면 자료를 연 것이 아니므로 기록하지 않는다.
                        if (content.link) {
                          logMissionContentAccess({
                            challengeId,
                            missionId,
                            // 서버 배포 전에는 missionContentsId 가 없다. 그때는 자료 번호로 남겨
                            // 기록이 비는 구간을 만들지 않는다. 두 번호가 섞이는 건 배포 직후
                            // 로그를 비우면서 정리된다(LC-3201).
                            contentId: content.missionContentsId ?? content.id,
                            contentType: 'ADDITIONAL',
                            contentTitle: content.title,
                          });
                        }
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
