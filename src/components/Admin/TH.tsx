import styled from 'styled-components';

interface THProps {
  children: React.ReactNode;
}

const THBlock = styled.th`
  border: 1px solid #cbd5e0;
  background-color: #edf2f7;
  padding: 0.5rem 1rem;
  font-weight: 500;
`;

const TH = ({ children }: THProps) => {
  return <THBlock>{children}</THBlock>;
};

export default TH;
