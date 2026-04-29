import { useNavigate } from 'react-router-dom';

const BlogHomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="blog_home bg-neutral-90 text-neutral-0 rounded-full px-6 py-5 font-bold"
      onClick={() => {
        navigate('/blog/list');
      }}
    >
      블로그 홈
    </button>
  );
};

export default BlogHomeButton;
