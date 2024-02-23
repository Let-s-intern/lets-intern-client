import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { wishJobToTextForSorting } from '../../../../../utils/convert';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
}

const FilterDropdown = ({ filter, setFilter }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClicked = (wishJob: string) => {
    setFilter(wishJob);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex min-w-[8rem] cursor-pointer items-center justify-between gap-2 rounded border border-[#9D9D9D] py-2 pl-3 pr-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="text-sm font-medium">
          {wishJobToTextForSorting[filter] || '전체'}
        </span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuOpen && (
        <div className="absolute left-0 top-10 w-[10rem] rounded border border-[#9D9D9D] bg-white text-sm shadow-lg">
          <ul>
            {Object.keys(wishJobToTextForSorting).map((wishJob: any) => (
              <li
                key={wishJob}
                className="cursor-pointer px-3 py-2 transition-all hover:bg-neutral-200"
                onClick={() => handleMenuItemClicked(wishJob)}
              >
                {wishJobToTextForSorting[wishJob]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
