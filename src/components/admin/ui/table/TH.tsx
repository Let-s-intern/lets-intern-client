import styled from 'styled-components';

interface THProps {
  children: React.ReactNode;
}

const THBlock = styled.th`
  border: 1px solid white;
  /* background-color: #edf2f7; */
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.75rem;
  white-space: nowrap;
`;

const TH = ({ children }: THProps) => {
  return <THBlock className="bg-neutral-200">{children}</THBlock>;
};

export default TH;
