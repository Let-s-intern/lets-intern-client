import { Link } from 'react-router-dom';

interface IconProps {
  src: string;
  alt: string;
  to?: string;
  className?: string;
}

const Icon = ({ src, alt, to = '#', className }: IconProps) => {
  return (
    <Link
      to={to}
      {...(to !== '#' && { target: '_blank', rel: 'noopener noreferrer' })}
      className={className}
    >
      <img className="w-5" src={src} alt={alt} />
    </Link>
  );
};

export default Icon;
