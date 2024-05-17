import { Link } from 'react-router-dom';
import { IGuide } from '../../../../../interfaces/interface';

interface GuideItemProps {
  guide: IGuide;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  setValues: React.Dispatch<React.SetStateAction<IGuide>>;
}

const GuideItem = ({ guide, setIsModalShown, setValues }: GuideItemProps) => {
  return (
    <li className="text-0.875 flex justify-between">
      <Link
        to={guide.link}
        className="w-[60%] overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
        target="_blank"
        rel="noopenner noreferrer"
      >
        {guide.title}
      </Link>
      <div className="flex items-center gap-3">
        <i className="cursor-pointer">
          <img
            className="w-4"
            src="/icons/edit-icon.svg"
            alt="edit icon"
            onClick={() => {
              setValues(guide);
              setIsModalShown(true);
            }}
          />
        </i>
        <div className="flex gap-4">{guide.createdDate}</div>
      </div>
    </li>
  );
};

export default GuideItem;
