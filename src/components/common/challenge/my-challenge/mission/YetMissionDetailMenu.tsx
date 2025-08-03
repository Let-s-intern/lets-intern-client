import { UserChallengeMissionDetail } from '@/api/challengeSchema';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const YetMissionDetailMenu = ({ missionDetail }: Props) => {
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
      </div>
    </>
  );
};

export default YetMissionDetailMenu;
