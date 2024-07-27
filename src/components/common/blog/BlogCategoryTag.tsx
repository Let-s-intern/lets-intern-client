const BlogCategoryTag = ({
  category,
  isClicked,
  onClick,
}: {
  category: string;
  isClicked: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full px-2.5 py-1.5 text-xsmall14 ${isClicked ? 'bg-primary-40 font-bold text-primary' : 'bg-neutral-85 text-neutral-45'}`}
      onClick={onClick}
    >
      {category}
    </div>
  );
};

export default BlogCategoryTag;
