import MainLink from './MainLink';

interface Props {
  className?: string;
  href: string;
  children?: string;
}

const DocumentLink = ({ href, children }: Props) => {
  return (
    <MainLink
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
