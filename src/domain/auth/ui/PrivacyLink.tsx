interface PrivacyLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrivacyLink = ({ children, onClick }: PrivacyLinkProps) => {
  return (
    <button
      className="shrink-0 cursor-pointer text-neutral-50"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrivacyLink;
