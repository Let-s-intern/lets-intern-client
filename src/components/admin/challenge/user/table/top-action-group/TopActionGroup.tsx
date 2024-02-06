import { IoMdArrowDropdown } from 'react-icons/io';
import Button from '../../../ui/button/Button';

const TopActionGroup = () => {
  return (
    <div className="flex justify-between border-b border-zinc-300 px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <i className="cursor-pointer">
            <img
              src="/icons/admin-checkbox-unchecked.svg"
              alt="checkbox-icon"
            />
          </i>
          <i className="text-xl">
            <IoMdArrowDropdown />
          </i>
        </div>
        <div className="flex items-center gap-4">
          <i>
            <img src="/icons/mail-icon.svg" alt="mail-icon" />
          </i>
          <i>
            <img src="/icons/call-icon.svg" alt="call-icon" />
          </i>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button>참여자 추가</Button>
        <Button>저장</Button>
      </div>
    </div>
  );
};

export default TopActionGroup;
