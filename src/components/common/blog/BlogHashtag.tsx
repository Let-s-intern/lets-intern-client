const BlogHashtag = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-full bg-[#F3F5FA] px-2.5 py-1 text-xsmall14 text-primary-dark"
      onClick={onClick}
    >
      #{text}
    </div>
  );
};

export default BlogHashtag;
