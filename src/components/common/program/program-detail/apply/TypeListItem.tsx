import clsx from 'clsx';

interface TypeListItemProps {
  caption: string;
  isCheck: boolean;
  onClick: React.MouseEventHandler<HTMLLIElement>;
}

const TypeListItem = ({ caption, isCheck, onClick }: TypeListItemProps) => {
  return (
    <li
      onClick={onClick}
      className={clsx('flex gap-2 rounded-sm px-1.5 py-2.5', {
        'bg-primary-10': isCheck,
      })}
    >
      <img
        src={isCheck ? '/icons/checked.svg' : '/icons/unchecked.svg'}
        alt="체크박스 아이콘"
      />
      <span className="text-1">{caption}</span>
    </li>
  );
};

export default TypeListItem;
