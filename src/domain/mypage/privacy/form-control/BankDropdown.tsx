import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { bankTypeToText } from '../../../../utils/convert';

interface BankDropdownProps {
  value: any;
  setValue: (values: any) => void;
}

const BankDropdown = ({ value, setValue }: BankDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (bankType: string) => {
    setValue({ ...value, accountType: bankType });
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
        {value.accountType ? (
          <span>{bankTypeToText[value.accountType]}</span>
        ) : (
          <span className="text-neutral-0 text-opacity-75">
            환급받을 계좌의 은행을 선택해주세요.
          </span>
        )}
        <span className="text-neutral-0 text-opacity-[74%]">
          {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {isMenuOpen && (
        <ul className="absolute -bottom-1 w-full translate-y-full rounded-md bg-[#FAFAFA]">
          {Object.keys(bankTypeToText).map((bankType: string) => (
            <li
              className="cursor-pointer rounded-md px-6 py-1.5 text-neutral-0 text-opacity-[88%] duration-200 hover:bg-primary-20"
              onClick={() => handleMenuItemClick(bankType)}
            >
              {bankTypeToText[bankType]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BankDropdown;
