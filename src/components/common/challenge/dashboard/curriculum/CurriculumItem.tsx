import clsx from 'clsx';

interface Props {
  lineTop?: boolean;
  isOpen: boolean;
  name: string;
  description: string;
  index: number;
  setOpennedIndex: (opennedIndex: number | null) => void;
}

const CurriculumItem = ({
  lineTop,
  isOpen,
  name,
  description,
  index,
  setOpennedIndex,
}: Props) => {
  return (
    <li
      className={clsx('border-b border-[#DEDEDE]', {
        'border-t': lineTop,
      })}
    >
      <div
        className="cursor-pointer py-3 text-center duration-200 hover:bg-[#F1F1F1]"
        onClick={() => {
          if (isOpen) {
            setOpennedIndex(null);
          } else {
            setOpennedIndex(index);
          }
        }}
      >
        {name}
      </div>
      {isOpen && (
        <div className="mb-4 mt-2 px-2">
          <p className="break-keep text-center text-sm">{description}</p>
        </div>
      )}
    </li>
  );
};

export default CurriculumItem;
