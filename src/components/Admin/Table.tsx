import styled, { css } from 'styled-components';

interface TableProps {
  minWidth?: number;
  children: React.ReactNode;
}

interface TableContentProps {
  $minWidth?: number;
}

const Table = ({ minWidth, children }: TableProps) => {
  return (
    <TableBlock>
      <TableContent $minWidth={minWidth}>{children}</TableContent>
    </TableBlock>
  );
};

export default Table;

const TableBlock = styled.div`
  width: 100%;
  overflow-x: auto;
  transform: rotateX(180deg);
`;

const TableContent = styled.table<TableContentProps>`
  width: 100%;
  min-width: ${({ $minWidth }) => css`
    ${$minWidth ? $minWidth : 1300}px
  `};
  border: 1px solid #cbd5e0;
  transform: rotateX(180deg);
`;
