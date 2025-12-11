import { Fragment, ReactNode } from 'react';
import EmptyContainer from '../../../common/ui/EmptyContainer';
import MoreHeader from '../../../common/ui/MoreHeader';
import BlogItem, { BlogItemProps } from './BlogItem';

interface BlogContainerProps {
  title: ReactNode;
  subTitle?: ReactNode;
  moreUrl?: string;
  blogs: BlogItemProps[];
  gaItem: string;
  gaTitle: string;
}

const BlogContainer = (props: BlogContainerProps) => {
  return (
    <div className="flex w-full max-w-[1120px] flex-col gap-y-8 md:gap-y-9">
      <MoreHeader
        subtitle={props.subTitle}
        href={props.moreUrl}
        isVertical
        isBig
        gaText={props.gaTitle}
      >
        {typeof props.title === 'string' ? (
          <>
            {props.title.split('\\n').map((line, index) => (
              <Fragment key={index}>
                {line} <br className="md:hidden" />
              </Fragment>
            ))}
          </>
        ) : (
          props.title
        )}
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
              className={props.gaItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogContainer;
