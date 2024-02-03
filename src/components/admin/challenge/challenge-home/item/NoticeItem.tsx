interface Props {
  title: string;
  date: string;
}

const NoticeItem = ({ title, date }: Props) => {
  return (
    <li className="flex justify-between">
      <span className="w-[60%] overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </span>
      <div className="flex gap-4">
        <span className="w-24">{date}</span>
        <i>
          <img src="/icons/edit-icon.svg" alt="edit-icon" />
        </i>
      </div>
    </li>
  );
};

export default NoticeItem;
