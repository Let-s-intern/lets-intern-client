import { IoCloseOutline } from 'react-icons/io5';
import { TagDetail } from '../../../api/blogSchema';

interface TagDeleteProps {
  title: TagDetail['title'];
  onClickDelete: () => void;
}

const TagDelete = ({ title, onClickDelete }: TagDeleteProps) => {
  return (
    <div key={title} className="flex items-center gap-2.5 bg-[#FAEDEE] pl-2.5">
      <div className="text-0.875 bg-[#FAEDEE]">#{title}</div>
      <IoCloseOutline
        className="cursor-pointer bg-neutral-0"
        color="#FFF"
        size={20}
        onClick={onClickDelete}
      />
    </div>
  );
};

export default TagDelete;
