import { ReactNode } from 'react';
import EmptyContainer from '../ui/EmptyContainer';
import MoreHeader from '../ui/MoreHeader';
import BlogItem, { BlogItemProps } from './BlogItem';

interface BlogContainerProps {
  title: ReactNode;
  subTitle?: ReactNode;
  moreUrl?: string;
  blogs: BlogItemProps[];
}

const BlogContainer = (props: BlogContainerProps) => {
  return (
    <div className="flex w-full max-w-[1160px] flex-col gap-y-8 md:gap-y-9">
      <MoreHeader
        subtitle={props.subTitle}
        href={props.moreUrl}
        isVertical
        isBig
      >
        {props.title}
      </MoreHeader>
      {props.blogs.length < 1 ? (
        <EmptyContainer />
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {props.blogs.map((blog, index) => (
            <BlogItem
              key={index}
              thumbnail={blog.thumbnail}
              category={blog.category}
              title={blog.title}
              date={blog.date}
              url={blog.url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogContainer;
