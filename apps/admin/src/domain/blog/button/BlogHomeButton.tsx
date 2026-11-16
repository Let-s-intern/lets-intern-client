import { useNavigate } from 'react-router-dom';

const BlogHomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="blog_home rounded-full bg-neutral-90 px-6 py-5 font-bold text-neutral-0"
      onClick={() => {
        navigate('/blog/list');
      }}
    >
      블로그 홈
    </button>
  );
};

export default BlogHomeButton;
