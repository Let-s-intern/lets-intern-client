interface Props {
  title: string;
  date: string;
  content: string;
}

const MissionDateItem = ({ title, date, content }: Props) => {
  return (
    <li className="cursor-pointer px-8 py-2 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <span className="text-sm">{date}</span>
      </div>
      <p className="mt-1 text-sm">{content}</p>
    </li>
  );
};

export default MissionDateItem;
