import { Link } from 'react-router-dom';

interface Props {
  notice: any;
}

const NoticeItem = ({ notice }: Props) => {
  return (
    <li className="flex justify-between text-sm">
      <Link
        to={notice.link}
        className="w-[60%] overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
        target="_blank"
        rel="noopenner noreferrer"
      >
        {notice.title}
      </Link>
      <div className="flex gap-4">{notice.createdAt}</div>
    </li>
  );
};

export default NoticeItem;
