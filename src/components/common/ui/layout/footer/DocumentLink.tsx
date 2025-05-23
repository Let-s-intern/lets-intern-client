import MainLink from './MainLink';

interface Props {
  isNextRouter: boolean;
  className?: string;
  href: string;
  children?: string;
}

const DocumentLink = ({ isNextRouter, href, children }: Props) => {
  return (
    <MainLink
      isNextRouter={isNextRouter}
      href={href}
      className="text-0.75-medium lg:text-0.875-medium"
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </MainLink>
  );
};

export default DocumentLink;
