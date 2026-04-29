import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const BlogHashtag = ({ text, tagId }: { text: string; tagId: number }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [searchParams] = useSearchParams();

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    // 현재 경로가 /blog/hashtag라면
    if (pathname === '/blog/hashtag') {
      const params = new URLSearchParams(searchParams as any);
      params.set('tagId', tagId.toString());
      navigate(`/blog/hashtag?${params.toString()}`);
      return;
    }

    navigate(`/blog/hashtag?tagId=${tagId}`);
  };
  return (
    <div
      className="text-xsmall14 text-primary-dark flex cursor-pointer items-center justify-center rounded-full bg-[#F3F5FA] px-2.5 py-1"
      onClick={onClick}
    >
      #{text}
    </div>
  );
};

export default BlogHashtag;
