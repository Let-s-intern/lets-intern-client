import styled from 'styled-components';

interface TDProps {
  textAlign?: 'left' | 'center';
  children?: React.ReactNode;
}

interface TDBlockProps {
  textalign?: 'left' | 'center';
}

const TDBlock = styled.td<TDBlockProps>`
  border: 1px solid #cbd5e0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;

  ${(props) => props.textalign && `text-align: ${props.textalign};`}
`;

const TD = ({ textAlign = 'center', children }: TDProps) => {
  return <TDBlock textalign={textAlign}>{children}</TDBlock>;
};

export default TD;
