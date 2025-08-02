import { UserChallengeMissionDetail } from '@/api/challengeSchema';
import { Link } from 'react-router-dom';

import AbsentContentsDropdown from '../dropdown/AbsentContentsDropdown';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const AbsentContentsInfoMenu = ({ missionDetail }: Props) => {
  return (
    <div className="mt-5 flex gap-4 px-3">
      <Link
        to={missionDetail.templateLink}
        className="rounded flex-1 border border-[#DCDCDC] bg-white px-8 py-2 text-center font-semibold shadow"
        target="_blank"
        rel="noopenner noreferrer"
      >
        미션 템플릿
      </Link>
      <AbsentContentsDropdown missionDetail={missionDetail} />
    </div>
  );
};

export default AbsentContentsInfoMenu;
