import { IoCloseOutline } from 'react-icons/io5';
import { TagDetail } from '@/api/blog/blogSchema';

interface TagDeleteProps {
  title: TagDetail['title'];
  onClick: () => void;
}

const TagDelete = ({ title, onClick }: TagDeleteProps) => {
  return (
    <div key={title} className="flex items-center gap-2.5 bg-[#FAEDEE] pl-2.5">
      <div className="text-0.875 bg-[#FAEDEE]">#{title}</div>
      <IoCloseOutline
        className="bg-neutral-0 cursor-pointer"
        color="#FFF"
        size={20}
        onClick={onClick}
      />
    </div>
  );
};

export default TagDelete;
