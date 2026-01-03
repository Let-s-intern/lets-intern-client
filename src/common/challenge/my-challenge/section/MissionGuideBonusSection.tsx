import { CurrentChallenge } from '@/context/CurrentChallengeProvider';
import { useNavB2CChallenges } from '@/hooks/useFirstB2CChallenge';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { UserChallengeMissionWithAttendance } from '@/schema';
import { getRewardAmount } from '@/utils/getRewardAmount';
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

interface MissionGuideBonusSectionProps {
  className?: string;
  todayTh: number;
  missionData?: UserChallengeMissionWithAttendance; // API 응답 데이터
  selectedMissionTh?: number; // 선택된 미션의 회차
  isLoading?: boolean; // 로딩 상태 추가
  currentChallenge?: CurrentChallenge | null;
}

const MissionGuideBonusSection = ({
  className,
  todayTh,
  missionData,
  selectedMissionTh,
  isLoading = false,
  currentChallenge,
}: MissionGuideBonusSectionProps) => {
  // 챌린지별 latest utm
  const {
    experienceSummary,
    resume,
    personalStatement,
    personalStatementLargeCorp,
    portfolio,
    marketing,
  } = useNavB2CChallenges();

  // 챌린지 타입에 따라 매칭되는 챌린지 객체를 반환하는 함수
  const getMatchedChallenge = () => {
    if (!currentChallenge?.challengeType) return null;

    const challengeTypeMap: Record<string, any> = {
      EXPERIENCE_SUMMARY: experienceSummary,
      RESUME: resume,
      PERSONAL_STATEMENT: personalStatement,
      PERSONAL_STATEMENT_LARGE_CORP: personalStatementLargeCorp,
      PORTFOLIO: portfolio,
      MARKETING: marketing,
    };

    return challengeTypeMap[currentChallenge.challengeType] || null;
  };

  // 챌린지 링크를 반환하는 함수
  const getChallengeLink = (): string => {
    const challenge = getMatchedChallenge();
    if (challenge?.href) return `${window.location.origin}${challenge.href}`;

    return `${window.location.origin}/program/challenge`;
  };

  // 챌린지 타입 이름을 반환하는 함수
  const getChallengeTypeName = (): string => {
    const challenge = getMatchedChallenge();
    return challenge?.title || '렛츠커리어 챌린지';
  };

  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !missionData) {
    return <MissionGuideSkeleton variant="bonus" />;
  }

  // endDate를 월일 시간 형식으로 변환
  const formatDeadline = (endDate?: Dayjs | null) => {
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
          missionType="블로그 후기 작성하고 현금 리워드 받기!"
          deadline={formatDeadline(missionData?.missionInfo?.endDate)}
          missionStartDate={missionData.missionInfo.startDate}
        />

        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
          {/* 인트로 섹션 */}
          <section>
            <Heading3>
              안녕하세요, 커리어의 첫걸음을 함께하는 렛츠커리어입니다!
            </Heading3>
            <p className="whitespace-pre-wrap text-xsmall14 text-neutral-0 md:text-xsmall16">
              렛츠커리어의 챌린지 프로그램을 믿고 따라와주셔서 감사드리며,{' '}
              <br />
              {getRewardAmount(currentChallenge)}을 100% 지급해드리는 후기
              이벤트를 안내드립니다!
            </p>
          </section>

          {/* 참여 방법 섹션 */}
          <section className="flex flex-col gap-3">
            <Heading3>1️⃣ 블로그 후기 이벤트 참여방법</Heading3>
            <div className="flex flex-col gap-2 rounded-xxs bg-neutral-95 p-3">
              <div className="flex items-start gap-2">
                <ol className="list-inside list-decimal whitespace-pre-wrap text-xsmall14 font-medium text-neutral-0 md:text-xsmall16">
                  <li>
                    이번 챌린지를 통해 배운 점, 성장한 점 등을 바탕으로 네이버
                    블로그, 티스토리, 미디엄 등 택하여 후기를 작성해주세요.
                  </li>
                  <li>
                    작성한 후기 링크를 챌린지 대시보드 &gt; 보너스 미션 제출란에
                    업로드!
                  </li>
                  <li>
                    챌린지 운영 매니저가 확인 후 현금 리워드를 지급해드립니다.
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* 분리선 섹션 */}
          <div className="h-px bg-neutral-80" />

          {/* 후기 작성 가이드라인 섹션 */}
          <section className="flex flex-col gap-4">
            <Heading3>2️⃣ 블로그 후기 가이드라인을 안내드려요</Heading3>
            <div className="flex flex-col gap-2 rounded-xxs bg-primary-5 p-3">
              <div className="flex items-start gap-2">
                <ol className="list-inside list-decimal text-xsmall14 font-medium leading-8 text-neutral-0 md:text-xsmall16">
                  <li className="mb-4">
                    <b>이미지</b> <br />- 활동 인증 이미지 3장 이상 필수 첨부
                  </li>
                  <li className="mb-4">
                    <b>필수 키워드</b> <br />- 블로그 본문 내 필수 키워드 포함:
                    렛츠커리어, 취준, 프로그램명
                  </li>
                  <li className="mb-4">
                    <b>필수 링크</b> <br />- 블로그 본문 내 필수 링크 포함:{' '}
                    <a
                      href={getChallengeLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {getChallengeTypeName()}
                    </a>
                  </li>
                  <li className="mb-4">
                    <b>작성기준</b>: 위의 키워드 중 제목, 본문, #태그에 아래와
                    같이 키워드를 기재해 주세요. <br />
                    - 제목: 필수 키워드 3개를 포함하여 자유롭게 작성 <br />-
                    본문: ‘렛츠커리어’, ‘취준’ 키워드를 본문에 3회 이상 언급{' '}
                    <br />- #해시태그: 제시된 키워드 모두 기재해
                    주세요.(*키워드가 지켜지지 않으면 수정요청이 있을 수
                    있어요.)
                    <br />- [추천·보증 등에 관한 표시·광고 심사지침]에 따라 후기
                    내에 &quot;후기 작성의 대가로 현금 리워드를
                    받았습니다&quot;와 같은 문구를 표시해야 합니다!
                    <br />- 후기는 제 3자의 저작권, 초상권 및 기타 권리를
                    침해하지 않도록 작성해주세요.
                  </li>
                  <li className="mb-4">
                    <b>공개설정</b> <br />- 최소 1년 간 전체 공개 (해당 기간
                    내에 삭제 시 리워드가 환수될 수 있습니다)
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* 후기 섹션 */}
          <section className="flex flex-col gap-3 font-medium">
            <Heading3>
              3️⃣ 후기 작성 예시가 궁금하다면? 👉 아래 링크 참고
            </Heading3>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.letscareer.co.kr/review/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-xsmall14 text-primary hover:underline md:text-xsmall16"
              >
                후기 모음 보기: https://www.letscareer.co.kr/review/blog
              </a>
            </div>
          </section>

          {/* 문의 */}
          <section className="flex flex-col gap-3 font-medium">
            <Heading3>4️⃣ 문의</Heading3>
            <div className="flex flex-col text-xsmall14 md:text-xsmall16">
              문의는 챌린지 오픈 채팅방으로 부탁드립니다!
            </div>
          </section>

          <p className="text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
            챌린지 이후 좋은 소식들만 가득하세요! 솔직하고 생생한 후기
            기대하겠습니다
          </p>
        </section>
      </div>
    </>
  );
};

export default MissionGuideBonusSection;
