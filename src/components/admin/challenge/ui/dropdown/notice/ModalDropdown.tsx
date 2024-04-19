import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
  values: any;
  setValues: (valeus: any) => void;
}

const ModalDropdown = ({ values, setValues }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  const typeToText: any = {
    ESSENTIAL: '필수',
    ADDITIONAL: '선택',
  };

  return (
    <div className="relative">
      <div
        className="flex w-40 cursor-pointer items-center justify-between rounded-sm border border-neutral-400 px-4 py-2"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        <span className="text-sm">
          {typeToText[values.type] || '유형 선택'}
        </span>
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuShown && (
        <ul className="absolute bottom-0 w-full translate-y-[calc(100%+0.25rem)] overflow-hidden rounded-md border border-neutral-400 bg-white shadow-lg">
          {Object.keys(typeToText).map((type) => (
            <li
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                setValues({ ...values, type });
                setIsMenuShown(false);
              }}
            >
              {typeToText[type]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModalDropdown;
