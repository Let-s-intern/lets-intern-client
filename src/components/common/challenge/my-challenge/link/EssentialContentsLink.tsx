import { Link } from 'react-router-dom';

interface Props {
  missionDetail: any;
}

const EssentialContentsLink = ({ missionDetail }: Props) => {
  return (
    <Link
      to={missionDetail.essentialContentsId}
      className="rounded border border-[#BCBCBC] px-4 py-2 text-center font-medium"
      target="_blank"
      rel="noopenner noreferrer"
    >
      학습 콘텐츠 확인하기
    </Link>
  );
};

export default EssentialContentsLink;
