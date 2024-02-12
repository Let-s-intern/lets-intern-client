interface Props {
  notice: any;
}

const NoticeItem = ({ notice }: Props) => {
  return (
    <li className="flex justify-between">
      <span className="w-[60%] overflow-hidden text-ellipsis whitespace-nowrap">
        {notice.title}
      </span>
      <div className="flex gap-4">
        <span className="w-24">{notice.createdAt}</span>
        <i>
          <img src="/icons/edit-icon.svg" alt="edit-icon" />
        </i>
      </div>
    </li>
  );
};

export default NoticeItem;
