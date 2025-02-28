import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';

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
        href={props.url}
        target={props.url.startsWith('http') ? '_blank' : undefined}
        data-url={props.url}
        data-text={props.title}
      >
        <img
          src={props.thumbnail}
          alt="thumbnail"
          className="aspect-[3/2] w-full rounded-sm object-cover"
        />
        <span className="mt-3 text-xsmall14 font-semibold text-primary">
          {props.category}
        </span>
        <h3 className="mt-1 text-wrap text-xsmall16 font-semibold text-neutral-0 md:text-small18">
          {props.title}
        </h3>
        <span className="mt-2 text-xxsmall12 text-neutral-40">
          {props.date} 작성
        </span>
      </Link>
    </>
  );
};

export default BlogItem;
