import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

import RoundedBox from '../box/RoundedBox';
import NoticeItem from '../item/NoticeItem';
import SectionHeading from '../heading/SectionHeading';
import Button from '../button/Button';

const NoticeSection = () => {
  return (
    <RoundedBox
      as="section"
      className="flex w-[55%] flex-col justify-between px-8 py-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionHeading>공지사항</SectionHeading>
          <Button>새 공지 등록</Button>
        </div>
        <div>
          <ul className="flex flex-col gap-2">
            <NoticeItem
              title="공지사항을 작성해주세요. 길어지면 이렇게 해주시면 됩니다."
              date="2024.01.26"
            />
            <NoticeItem
              title="공지사항을 작성해주세요. 길어지면 이렇게 해주시면 됩니다."
              date="2024.01.26"
            />
            <NoticeItem
              title="공지사항을 작성해주세요. 길어지면 이렇게 해주시면 됩니다."
              date="2024.01.26"
            />
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div className="w-20" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="cursor-pointer font-medium">1</span>
            <span className="cursor-pointer">2</span>
          </div>
          <span className="cursor-pointer">
            <i>
              <IoIosArrowForward />
            </i>
          </span>
        </div>
        <Link to="#" className="w-20 text-sm">
          전체보기
        </Link>
      </div>
    </RoundedBox>
  );
};

export default NoticeSection;
