import { twMerge } from '@/lib/twMerge';
import { Link } from 'react-router-dom';

export interface BlogItemProps {
  thumbnail: string;
  category: string;
  title: string;
  date?: string;
  url: string;
  className?: string;
}

const BlogItem = (props: BlogItemProps) => {
  return (
    <>
      <Link
        className={twMerge('flex w-full flex-col', props.className)}
        to={props.url}
        target={props.url.startsWith('http') ? '_blank' : undefined}
        data-url={props.url}
        data-text={props.title}
      >
        <img
          src={props.thumbnail}
          alt="thumbnail"
          className="border-neutral-75 aspect-[1.3/1] w-full rounded-sm border-[0.7px] object-cover"
        />
        <span className="text-xsmall14 text-primary mt-3 font-semibold">
          {props.category}
        </span>
        <h3 className="text-xsmall16 text-neutral-0 md:text-small18 mt-1 line-clamp-2 text-wrap font-semibold">
          {props.title}
        </h3>
        <span className="text-xxsmall12 text-neutral-40 mt-2">
          {props.date} 작성
        </span>
      </Link>
    </>
  );
};

export default BlogItem;
