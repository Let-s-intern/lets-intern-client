import { UserChallengeMissionDetail } from '@/schema';
import OtVideo from '../../OtVideo';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const YetMissionDetailMenu = ({ missionDetail }: Props) => {
  const isOtMission = missionDetail.th === 0;
  const showOtVod = isOtMission && missionDetail.vodLink;

  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="whitespace-pre-line text-black">
          {missionDetail.description}
        </p>
        <div className="mt-4">
          <h4 className="text-sm text-[#898989]">미션 가이드</h4>
          <p className="mt-1 whitespace-pre-line text-black">
            {missionDetail.guide}
          </p>
        </div>
        {/* OT 영상 */}
        {showOtVod && <OtVideo vodLink={missionDetail.vodLink!} />}
      </div>
    </>
  );
};

export default YetMissionDetailMenu;
