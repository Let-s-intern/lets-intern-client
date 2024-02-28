import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { bankTypeToText } from '../../../../utils/convert';

interface Props {
  values: any;
  setValues: (values: any) => void;
}

const BankDropdown = ({ values, setValues }: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        className="flex w-48 cursor-pointer items-center justify-between rounded-lg border border-[#cacaca] px-4 py-3"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span>{bankTypeToText[values.accountType]}</span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuOpen && (
        <ul className="absolute -bottom-1 w-full translate-y-full rounded-lg border border-[#cacaca] bg-white">
          {Object.keys(bankTypeToText).map((bankType: string) => (
            <li
              className="cursor-pointer px-4 py-2 text-sm duration-200 hover:bg-neutral-100"
              onClick={() => {
                setValues({ ...values, accountType: bankType });
                setIsMenuOpen(false);
              }}
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
