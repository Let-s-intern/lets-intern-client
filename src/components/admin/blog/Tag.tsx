interface TagProps {
  id: number;
  title: string;
  onClick?: () => void;
}

export default function Tag({ id, title, onClick }: TagProps) {
  return (
    <div
      key={id}
      className="text-0.75 cursor-pointer rounded-full bg-[#F3F5FA] px-2.5 py-1 text-primary-dark"
      onClick={onClick}
    >
      #{title}
    </div>
  );
}
