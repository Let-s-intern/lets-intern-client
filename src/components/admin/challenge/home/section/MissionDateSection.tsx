import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import RoundedBox from '../box/RoundedBox';
import Button from '../../ui/button/Button';
import SectionHeading from '../heading/SectionHeading';
import MissionDateItem from '../item/MissionDateItem';

const MissionDateSection = () => {
  return (
    <RoundedBox as="section" className="flex w-[45%] flex-col gap-2">
      <div className="flex items-center justify-between px-8 py-6 pb-0">
        <SectionHeading>미션 일정</SectionHeading>
        <Button to="/admin/challenge/mission">미션관리</Button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <ul className="divide-y divide-neutral-200">
          <MissionDateItem
            title="OT"
            date="01.25 11:00 진행"
            content="미션 요약을 작성해주세요. 미션 요약을 작성해주세요."
          />
          <MissionDateItem
            title="OT"
            date="01.25 11:00 진행"
            content="미션 요약을 작성해주세요. 미션 요약을 작성해주세요."
          />
          <MissionDateItem
            title="OT"
            date="01.25 11:00 진행"
            content="미션 요약을 작성해주세요. 미션 요약을 작성해주세요."
          />
        </ul>
        <div className="pointer-events-none absolute bottom-0 flex h-20 w-full items-end bg-gradient-to-b from-transparent to-white">
          <Link
            to="/admin/challenge/mission"
            className="pointer-events-auto flex w-full cursor-pointer justify-center bg-white pb-2 pt-1"
          >
            <i>
              <IoMdArrowDropdown />
            </i>
          </Link>
        </div>
      </div>
    </RoundedBox>
  );
};

export default MissionDateSection;
