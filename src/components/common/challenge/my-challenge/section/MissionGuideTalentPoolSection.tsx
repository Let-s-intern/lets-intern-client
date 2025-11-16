import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { UserChallengeMissionWithAttendance } from '@/schema';
import { clsx } from 'clsx';
import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';
import MissionGuideSkeleton from './MissionGuideSkeleton';
import MissionHeaderSection from './MissionHeaderSection';

const Heading3 = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={twMerge(
        'text-xsmall16 font-semibold text-neutral-0',
        className,
      )}
    >
      {children}
    </h3>
  );
};

interface MissionGuideTalentPoolSectionProps {
  className?: string;
  todayTh: number;
  missionData?: UserChallengeMissionWithAttendance; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
  isLoading?: boolean; // 로딩 상태 추가
}

const MissionGuideTalentPoolSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
  isLoading = false,
}: MissionGuideTalentPoolSectionProps) => {
  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !missionData) {
    return <MissionGuideSkeleton variant="bonus" />;
  }

  // endDate를 월일 시간 형식으로 변환
  const formatDeadline = (endDate?: Dayjs) => {
    if (!endDate) return '99.99 99:99';
    const date = dayjs(endDate);
    return date.format('MM.DD HH:mm');
  };

  return (
    <>
      <div className={clsx('flex flex-col gap-3', className)}>
        {/* 제목 및 마감일 섹션 */}
        <MissionHeaderSection
          selectedMissionTh={selectedMissionTh || todayTh}
          missionType="인재풀 등록하고 채용 제안받기"
          deadline={formatDeadline(missionData?.missionInfo?.endDate)}
          missionStartDate={missionData.missionInfo.startDate}
        />

        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
          {/* 인트로 섹션 */}
          <section>
            <p className="whitespace-pre-wrap text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
              안녕하세요, 렛츠커리어입니다.
              <br />
              챌린지를 끝까지 함께해 주신 여러분께 특별한 기회를 드려요! 🎉
              <br />
              렛츠커리어는 “한 번의 등록으로 여러 기업에게 채용 제안”을 받을 수
              있는 인재풀 서비스를 운영하고 있습니다.
              <br />
              <br />
              챌린지 기간 동안 완성한 이력서 / 포트폴리오/자기소개서를
              제출하시면, 렛츠커리어가 대신 인재풀에 등록해드려요. <br />
              👉 세 가지 서류 모두 제출 가능하며, 이후 수정된 서류도
              마이페이지에서 언제든 업데이트할 수 있어요.
            </p>
          </section>

          {/* 분리선 섹션 */}
          <div className="h-px bg-neutral-80" />

          {/* 참여 방법 섹션 */}
          <section className="flex flex-col gap-3">
            <Heading3>🤔 인재풀이 뭔가요?</Heading3>
            <div className="flex flex-col gap-2 rounded-xxs bg-neutral-95 p-3">
              <div className="flex items-start gap-2">
                <ol className="list-inside list-decimal whitespace-pre-wrap text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
                  <li>
                    렛츠커리어에서 IT 스타트업 채용연계를 위해 관리하는
                    인재풀입니다.
                  </li>
                  <li>
                    등록만 하면, 렛츠커리어 제휴 스타트업 및 주요 기업들로부터
                    채용 제안을 받을 수 있습니다.
                  </li>
                  <li>
                    인턴십뿐 아니라 신입 정규직까지, 적합한 회사와 적극적으로
                    연결해 드려요.
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* 후기 작성 가이드라인 섹션 */}
          <section className="flex flex-col gap-4">
            <Heading3>✨ 참여 혜택</Heading3>
            <div className="flex flex-col gap-2 rounded-xxs bg-primary-5 p-3">
              <div className="flex items-start gap-3">
                <ol className="flex list-inside flex-col gap-2.5 text-xsmall14 font-medium leading-5 text-neutral-0 md:text-xsmall16">
                  <li>
                    1️⃣ 검증된 스타트업 네트워크
                    <div className="ml-5">
                      생활용품 커머스 와이즐리, 뷰티 스타트업 앳홈등
                    </div>
                  </li>
                  <li>
                    2️⃣ 서류 전형 패스
                    <div className="ml-5">
                      인재풀 등록만으로 빠르게 면접/채용 제안 연결
                    </div>
                  </li>
                  <li>
                    3️⃣ 지속적 기회 제공
                    <div className="ml-5">
                      인턴십 이후에도 정규직 등으로 연결
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <p className="text-xsmall14 text-neutral-0 md:text-xsmall16">
            👉 이번 기회에 서류를 제출하고, 여러 기업의 제안을 동시에
            받아보세요!
          </p>
        </section>
      </div>
    </>
  );
};

export default MissionGuideTalentPoolSection;
