import { Link } from 'react-router-dom';
import MenuIcon from './MenuIcon';
import { ProgramCategoryKey } from '../../../../../interfaces/Program.interface';
import { PROGRAM_CATEGORY } from '../../../../../utils/convert';

interface ProgramMenuProps {
  className?: string;
  to: string;
  category: (typeof PROGRAM_CATEGORY)[ProgramCategoryKey];
  caption: string;
  selected: boolean;
}

const PRIMARY_LIGHT = '#757BFF';
const NEUTRAL_75 = '#D8D8D8';

const ProgramMenu = ({
  className,
  to,
  category,
  caption,
  selected,
}: ProgramMenuProps) => {
  return (
    <Link className={`flex flex-col items-center ${className}`} to={to}>
      <MenuIcon
        category={category}
        fill={selected ? PRIMARY_LIGHT : NEUTRAL_75}
      />
      <span className="text-0.75-medium sm:text-0.875-medium lg:text-1-medium mt-2.5 block">
        {caption}
      </span>
    </Link>
  );
};

export default ProgramMenu;
