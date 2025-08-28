import MainLink from './MainLink';

interface Props {
  imgSrc: string;
  className?: string;
  href: string;
}

function IconLink({ imgSrc, className, href }: Props) {
  return (
    <MainLink
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className="h-5 w-auto" src={imgSrc} alt="" />
    </MainLink>
  );
}

export default IconLink;
