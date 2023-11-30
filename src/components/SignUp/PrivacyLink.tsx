import styled from 'styled-components';

interface PrivacyLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrivacyLink = ({ children, onClick }: PrivacyLinkProps) => {
  return (
    <PrivacyLinkBlock
      className="cursor-pointer font-medium text-primary underline"
      onClick={onClick}
    >
      {children}
    </PrivacyLinkBlock>
  );
};

export default PrivacyLink;

const PrivacyLinkBlock = styled.b`
  cursor: pointer;
  font-weight: 500;
  color: #6963f6;
  text-decoration: underline;
  word-spacing: -2px;
`;
