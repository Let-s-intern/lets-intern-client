import { UserChallengeMissionDetail } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { Link } from 'react-router-dom';
import OtVideo from '../../OtVideo';
import ContentsDropdown from '../dropdown/ContentsDropdown';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const MissionInfo = ({
  missionDetail,
}: {
  missionDetail: UserChallengeMissionDetail;
}) => {
  const isOtMission = missionDetail.th === 0;

  return (
    <>
      <p className="mt-5 whitespace-pre-line text-black">
        {missionDetail.description}
      </p>
      <div className="mt-8">
        <h4 className="text-small18 font-semibold text-primary">미션 가이드</h4>
        <p className="mt-5 whitespace-pre-line text-xsmall16 font-medium text-black">
          {missionDetail.guide}
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        {/* OT 자료 */}
        {!isOtMission && (
          <Link
            to={missionDetail.templateLink || '#'}
            className="flex-1 rounded-sm border border-primary-20 bg-white p-3 text-center text-xsmall16 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            미션 템플릿
          </Link>
        )}
        <ContentsDropdown missionDetail={missionDetail} />
      </div>
      {isOtMission && missionDetail.vodLink && (
        <OtVideo vodLink={missionDetail.vodLink} />
      )}
    </>
  );
};

const BonusMissionInfo = () => {
  return (
    <>
      <p className="mt-5 whitespace-pre-line text-neutral-0">
        안녕하세요, 커리어의 첫걸음을 함께하는 렛츠커리어입니다!
        <br />
        렛츠커리어의 챌린지 프로그램을 믿고 따라와주셔서 감사드리며,
        <br />
        솔직한 후기를 남겨주시면 <strong>💵1건당 1만원 리워드💵</strong>를 100%
        지급해드립니다.
      </p>
      <hr className="mt-8" />
      <div className="mt-8">
        <h4 className="text-small18 font-semibold text-primary">참여 방법</h4>
        <ol className="mt-5 list-decimal pl-5 text-xsmall16 font-medium text-neutral-0">
          <li>
            이번 챌린지를 통해 배운 점, 성장한 점 등을 바탕으로 네이버 블로그,
            티스토리, 브런치 등 원하는 플랫폼을 택하여 후기를 작성해주세요.
          </li>
          <li>
            작성한 후기 링크를 챌린지 대시보드 &gt; 보너스 미션 제출란에
            업로드해주세요.
          </li>
          <li>챌린지 운영 매니저가 확인 후 리워드를 지급해드립니다.</li>
        </ol>
      </div>
      <hr className="mt-8" />
      <div className="mt-8">
        <h4 className="text-small18 font-semibold text-primary">
          후기 작성 가이드라인
        </h4>
        <ul className="mt-5 list-disc pl-5 text-xsmall16 font-medium text-neutral-0">
          <li>활동 이미지 3장 이상 필수 첨부</li>
          <li>&apos;렛츠커리어, 취준, 프로그램명&apos; 필수 키워드 포함</li>
          <li>공개 설정은 전체공개로 해 주세요</li>
          <li>블로그 플랫폼: 네이버블로그 / 티스토리 / 브런치 중 택 1</li>
        </ul>
        <ul className="mt-5 flex flex-col gap-3 text-xsmall16 font-medium text-neutral-0">
          <li>
            <span className="text-xsmall16 font-semibold">제목</span>
            <p className="text-xsmall16 font-medium">
              필수 키워드 3개를 포함하여 자유롭게 작성
            </p>
          </li>
          <li>
            <span className="text-xsmall16 font-semibold">본문</span>
            <p className="text-xsmall16 font-medium">
              ‘렛츠커리어’, ‘취준’ 키워드를 본문에 3회 이상 언급
            </p>
          </li>
          <li>
            <span className="text-xsmall16 font-semibold">해시태그</span>
            <p className="text-xsmall16 font-medium">
              #렛츠커리어 #취준 #프로그램명 모두 포함 <br />
              (*키워드가 지켜지지 않으면 수정요청이 있을 수 있어요.)
            </p>
          </li>
        </ul>
      </div>
      <hr className="mt-8" />
      <div className="mt-8 text-xsmall16 font-medium text-neutral-0">
        <p className="mb-8">
          📚 후기 예시가 궁금하다면? <br />
          👉 후기 모음 보기: https://www.letscareer.co.kr/review/blog
        </p>
        문의는 편한 방식으로 부탁드립니다! <br />
        <ul className="mb-8 list-disc pl-5 text-neutral-0">
          <li>official@letscareer.co.kr로 이메일 문의 가능</li>
          <li>우측 하단 채팅 문의 가능</li>
        </ul>
        <p>
          여러분의 소중한 경험이 누군가에게는 큰 동기부여가 될 수 있어요. <br />
          생생하고 따뜻한 이야기, 기대할게요 😊
        </p>
      </div>
    </>
  );
};

const DailyMissionInfoSection = ({ missionDetail }: Props) => {
  const missionTitle =
    missionDetail.th === BONUS_MISSION_TH
      ? '보너스 미션. 블로그 후기 작성하기 리워드 받기!'
      : `${missionDetail.th}회차. ${missionDetail.title}`;

  const isBonusMission = missionDetail.th === BONUS_MISSION_TH;

  return (
    <>
      <div className="flex items-end gap-2">
        <h3 className="text-small20 font-bold">{missionTitle}</h3>
        <span className="text-xsmall16 font-medium text-primary">
          마감 {missionDetail.endDate.format('MM/DD(ddd) HH:mm')}까지
        </span>
      </div>
      {isBonusMission ? (
        <BonusMissionInfo />
      ) : (
        <MissionInfo missionDetail={missionDetail} />
      )}
    </>
  );
};

export default DailyMissionInfoSection;
