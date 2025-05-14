import MainLink from './MainLink';

interface Props {
  imgSrc: string;
  isNextRouter: boolean;
  className?: string;
  href: string;
}

function IconLink({ imgSrc, isNextRouter, className, href }: Props) {
  return (
    <MainLink
      isNextRouter={isNextRouter}
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
