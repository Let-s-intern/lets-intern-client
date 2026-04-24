import styled, { css } from 'styled-components';

interface TDProps {
  textAlign?: 'left' | 'center';
  whiteSpace?: 'wrap' | 'nowrap';
  children?: React.ReactNode;
}

interface TDBlockProps {
  $textAlign?: 'left' | 'center';
  $whiteSpace?: 'wrap' | 'nowrap';
}

const TD = ({
  textAlign = 'center',
  whiteSpace = 'nowrap',
  children,
}: TDProps) => {
  return (
    <TDBlock $textAlign={textAlign} $whiteSpace={whiteSpace}>
      {children}
    </TDBlock>
  );
};

export default TD;

const TDBlock = styled.td<TDBlockProps>`
  border: 1px solid #cbd5e0;
  padding: 0.5rem;
  font-size: 0.75rem;
  ${({ $textAlign }) =>
    $textAlign &&
    css`
      text-align: ${$textAlign};
    `}
  ${({ $whiteSpace }) =>
    $whiteSpace === 'nowrap' &&
    css`
      white-space: nowrap;
    `}
`;
