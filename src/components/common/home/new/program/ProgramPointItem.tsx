import { Link } from 'react-router-dom';

import { PROGRAM_CLASSIFICATION_KEY } from '../../../../../utils/programConst';

const PROGRAM = {
  TITLE_LIST: ['합격 후', '성장 단계'],
  DESC_LIST: ['취뽀후 계속해서', '성장하고 싶은 누구나'],
};

const ProgramPointItem = () => {
  return (
    <Link to={`/program?classification=${PROGRAM_CLASSIFICATION_KEY.PASS}`}>
      <li className="flex h-[13.75rem] cursor-pointer flex-col justify-between rounded-lg bg-primary px-4 pb-6 pt-[3.75rem] md:h-80 md:pt-24 lg:h-[27.5rem] lg:pt-[12.7rem]">
        <h2 className="text-1.25-medium lg:text-1.5-medium text-center text-primary">
          <span className="text-static-100">{PROGRAM.TITLE_LIST[0]}</span>{' '}
          <span className="text-neutral-0">{PROGRAM.TITLE_LIST[1]}</span>
        </h2>
        <p className="text-0.875 lg:text flex flex-col items-start">
          <span>{PROGRAM.DESC_LIST[0]}</span>
          <span>{PROGRAM.DESC_LIST[1]}</span>
        </p>
      </li>
    </Link>
  );
};

export default ProgramPointItem;
