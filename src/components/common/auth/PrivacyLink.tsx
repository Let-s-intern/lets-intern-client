interface PrivacyLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrivacyLink = ({ children, onClick }: PrivacyLinkProps) => {
  return (
    <b
      className="cursor-pointer font-medium text-primary underline"
      onClick={onClick}
    >
      {children}
    </b>
  );
};

export default PrivacyLink;
