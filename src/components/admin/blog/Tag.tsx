import { MouseEventHandler } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface TagProps {
  id: number;
  title: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: MouseEventHandler<SVGElement>;
}

export default function Tag({ id, title, onClick, onDelete }: TagProps) {
  return (
    <div
      key={id}
      className="text-0.75 flex cursor-pointer items-center gap-1 rounded-full bg-[#F3F5FA] px-2.5 py-1 text-primary-dark"
      onClick={onClick}
    >
      <span>#{title}</span>
      <IoCloseOutline
        className="cursor-pointerneutral-0"
        color="#4138A3"
        size={18}
        onClick={(event) => {
          event.stopPropagation();
          if (onDelete) onDelete(event);
        }}
      />
    </div>
  );
}
