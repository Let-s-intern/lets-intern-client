import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

const TopDropdown = () => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [value, setValue] = useState('15기');

  return (
    <div className="relative">
      <div
        className="flex w-24 cursor-pointer items-center justify-between gap-4 rounded border border-neutral-400 py-2 pl-4 pr-2"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        <span className="font-medium">{value}</span>
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuShown && (
        <ul className="absolute bottom-0 w-24 translate-y-[calc(100%+0.25rem)] rounded bg-white shadow-md">
          {['15기', '14기', '13기'].map((value) => (
            <li
              className="cursor-pointer py-3 pl-4 pr-2 font-medium hover:bg-gray-50"
              onClick={() => {
                setValue(value);
                setIsMenuShown(false);
              }}
            >
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopDropdown;
