import { useEffect, useRef, useState } from 'react';
import { gradeToText } from '../../../../../utils/convert';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BasicInfoValue } from '../section/BasicInfo';

interface GradeDropdownProps {
  value: BasicInfoValue;
  setValue: (value: BasicInfoValue) => void;
}

const GradeDropdown = ({ value, setValue }: GradeDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (grade: string) => {
    setValue({ ...value, grade });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex w-full cursor-pointer items-center justify-between rounded-md bg-neutral-0 bg-opacity-[4%] px-4 py-3"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="font-medium">
          {value.grade ? (
            <span>{gradeToText[value.grade]}</span>
          ) : (
            <span className="text-neutral-0 text-opacity-75">
              학년을 선택해주세요.
            </span>
          )}
        </span>
        <span className="text-neutral-0 text-opacity-[74%]">
          {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {isMenuOpen && (
        <ul className="absolute -bottom-1 w-full translate-y-full rounded-md bg-[#FAFAFA]">
          {Object.keys(gradeToText).map((grade: string) => (
            <li
              className="cursor-pointer rounded-md px-6 py-1.5 text-neutral-0 text-opacity-[88%] duration-200 hover:bg-primary-20"
              onClick={() => handleMenuItemClick(grade)}
            >
              {gradeToText[grade]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GradeDropdown;
