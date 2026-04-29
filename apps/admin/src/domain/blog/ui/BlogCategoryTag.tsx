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
    <button
      className={`blog_category text-xsmall14 flex items-center justify-center rounded-full px-2.5 py-1.5 ${isClicked ? 'bg-primary-40 text-primary font-bold' : 'bg-neutral-85 text-neutral-45'}`}
      onClick={onClick}
    >
      {category}
    </button>
  );
};

export default BlogCategoryTag;
