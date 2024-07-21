import { Link } from 'react-router-dom';

const mock = [
  {
    id: 1,
    title: 'Post 1',
    content: 'This is the first post',
  },
  {
    id: 2,
    title: 'Post 2',
    content: 'This is the second post',
  },
];

const BlogPostList = () => {
  const data = mock;
  return (
    <div>
      {/* look like button by tailwindCSS */}
      <Link
        to="/admin/blog/create"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Create New Post
      </Link>

      <div>
        {data.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;
