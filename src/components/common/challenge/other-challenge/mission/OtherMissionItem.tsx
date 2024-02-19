import { IoIosLink } from 'react-icons/io';
import { Link } from 'react-router-dom';

interface Props {
  mission: any;
}

const OtherMissionItem = ({ mission }: Props) => {
  return (
    <li>
      <Link
        to={mission.attendanceLink}
        target="_blank"
        rel="noopenner noreferrer"
        className="flex cursor-pointer items-center justify-between rounded-xl border border-[#D9D9D9] bg-white px-8 py-6 font-medium transition-colors duration-150 hover:bg-[#F8F8F8]"
      >
        <span>
          {mission.missionTh}일차. {mission.missionTitle}
        </span>
        <i>
          <IoIosLink />
        </i>
      </Link>
    </li>
  );
};

export default OtherMissionItem;
