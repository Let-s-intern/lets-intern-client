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
    hr,
  } = useNavB2CChallenges();

  // 챌린지 타입에 따라 매칭되는 챌린지 객체를 반환하는 함수
  const getMatchedChallenge = () => {
    if (!currentChallenge?.challengeType) return null;

    const challengeTypeMap: Record<string, any> = {
      EXPERIENCE_SUMMARY: experienceSummary,
      RESUME: resume,
      CAREER_START: resume,
      PERSONAL_STATEMENT: personalStatement,
      PERSONAL_STATEMENT_LARGE_CORP: personalStatementLargeCorp,
      PORTFOLIO: portfolio,
      MARKETING: marketing,
      HR: hr,
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
            <Heading3>
              2️⃣ 여러분의 소중한 후기가 리워드 대상에서 제외되지 않도록!
              <br /> 제출 전 아래의 점검 리스트 꼭 확인해주세요!
            </Heading3>
            <div className="flex flex-col gap-2 rounded-xxs bg-primary-5 p-3">
              ✅ 필수 항목 점검 ✅
              <div className="flex items-start gap-2">
                <ol className="list-inside list-decimal text-xsmall14 font-medium leading-8 text-neutral-0 md:text-xsmall16">
                  <li className="mb-4">
                    <b>제목</b> <br />- &quot;렛츠 커리어&quot;,
                    &quot;취준&quot;, &quot;프로그램명&quot; 모두 포함
                  </li>
                  <li className="mb-4">
                    <b>이미지</b> <br />- 활동 인증 이미지 3장 이상 첨부
                  </li>
                  <li className="mb-4">
                    <b>필수 키워드</b> <br />- 본문 내 &quot;렛츠 커리어&quot;,
                    &quot;취준&quot; 3회 이상, 프로그램명 1회 이상.
                  </li>
                  <li className="mb-4">
                    <b>필수 링크</b> <br />-
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
                    <b>해시태그</b> <br />- #렛츠커리어 #취준 #프로그램명
                  </li>
                  <li className="mb-4">
                    <b>리워드에 대한 언급</b>
                    <br />
                    - [추천·보증 등에 관한 표시·광고 심사 지침]에 따른 필수 기재
                    사항. <br />- 예시: &quot;후기 작성의 대가로 현금 리워드를
                    받았습니다.&quot;
                  </li>
                  <li className="mb-4">
                    <b>공개설정</b> <br />- 최소 1년간 전체 공개 (해당 기간 내
                    삭제 시 리워드가 환수될 수 있습니다.)
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
              <ol className="list-inside list-disc space-y-2">
                <li>
                  후기 모음 보기 :
                  <a
                    href="https://www.letscareer.co.kr/review/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-xsmall14 text-primary hover:underline md:text-xsmall16"
                  >
                    https://www.letscareer.co.kr/review/blog
                  </a>
                </li>
                <li>
                  후기 작성 Tip! 👀
                  <div className="ml-5 mt-1 space-y-1">
                    미션 수행 때마다 작성한 여러분만의 미션 소감을 활용해보세요!
                    <br />
                    생생한 소감을 잘 다듬기만 해도 블로그 글 70%가 완성됩니다!
                    <br /> 리워드는 덤이고, 이번 챌린지에서 내가 챙겨가고 싶은
                    것이 무엇인지 정리하는 시간이 되실 거예요!
                  </div>
                </li>
                <li>
                  후기는 제 3자의 저작권, 초상권 및 기타 권리를 침해하지 않도록
                  작성해주세요.
                </li>
              </ol>
            </div>
          </section>

          {/* 문의 */}
          <section className="flex flex-col gap-3 font-medium">
            <Heading3>4️⃣ 문의</Heading3>
            <div className="flex flex-col text-xsmall14 md:text-xsmall16">
              문의는 챌린지 오픈 채팅방으로 부탁드립니다!
            </div>
          </section>
          <hr className="border-neutral-80" />
          <p className="text-xsmall14 text-neutral-0 md:text-xsmall16">
            렛츠 커리어는 오늘도 “지금” 여러분께 필요한 프로그램을 개발
            중입니다!
            <br /> 여러분의 후기는 서비스 개선 및 새로운 프로그램 기획에 가장
            중요한 목소리고요!
            <br /> 렛츠 커리어가 여러분과 더 오래 함께 달릴 수 있도록 솔직하고
            생생한 후기 부탁드립니다!
            <br /> 여러분의 성장 과정을 렛츠 커리어와 함께 해주셔서 다시 한번
            감사합니다.
            <br />
            <br /> 렛츠 커리어 드림 ☺️
          </p>
        </section>
      </div>
    </>
  );
};

export default MissionGuideBonusSection;
