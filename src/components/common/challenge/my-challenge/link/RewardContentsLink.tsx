import { Link } from 'react-router-dom';

interface Props {
  missionDetail: any;
}

const RewardContentsLink = ({ missionDetail }: Props) => {
  return (
    <Link
      to={missionDetail.limitedContentsLink}
      className="rounded border border-[#BCBCBC] px-4 py-2 text-center font-medium"
      target="_blank"
      rel="noopenner noreferrer"
    >
      리워드 콘텐츠 확인하기
    </Link>
  );
};

export default RewardContentsLink;
