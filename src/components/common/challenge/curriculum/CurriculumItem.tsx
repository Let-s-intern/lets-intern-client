import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  lineTop?: boolean;
  name: string;
  description: string;
}

const CurriculumItem = ({ lineTop, name, description }: Props) => {
  const [descriptionShown, setDescriptionShown] = useState(false);

  return (
    <li
      className={clsx('border-b border-[#DEDEDE]', {
        'border-t': lineTop,
      })}
    >
      <div
        className="cursor-pointer py-3 text-center"
        onClick={() => setDescriptionShown(!descriptionShown)}
      >
        {name}
      </div>
      {descriptionShown && (
        <div className="mb-4 px-2">
          <p className="text-center text-sm">{description}</p>
        </div>
      )}
    </li>
  );
};

export default CurriculumItem;
