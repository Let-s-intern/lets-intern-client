import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { gradeToText } from '../../../../utils/convert';

interface GradeDropdownProps {
  value: string;
  setValue: (value: string) => void;
  type: 'SIGNUP' | 'MYPAGE';
}

const GradeDropdown = ({ value, setValue, type }: GradeDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (grade: string) => {
    setValue(grade);
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
    <div
      className={`relative ${type === 'SIGNUP' ? 'z-10 rounded-xxs border border-[#C4C4C4] bg-white' : ''}`}
      ref={dropdownRef}
    >
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-md ${type === 'SIGNUP' ? 'bg-white' : 'bg-neutral-0 bg-opacity-[4%]'} px-4 py-3`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="font-medium">
          {value ? (
            <span>{gradeToText[value]}</span>
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
              key={grade}
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
