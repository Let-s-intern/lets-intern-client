import Link from 'next/link';

interface IconProps {
  src: string;
  alt: string;
  to?: string;
  className?: string;
}

const Icon = ({ src, alt, to = '#', className }: IconProps) => {
  return (
    <Link
      href={to}
      {...(to !== '#' && { target: '_blank', rel: 'noopener noreferrer' })}
      className={className}
    >
      <img className="w-5" src={src} alt={alt} />
    </Link>
  );
};

export default Icon;
