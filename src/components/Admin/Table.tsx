import styled, { css } from 'styled-components';

interface TableProps {
  minWidth?: number;
  children: React.ReactNode;
}

interface TableBlockProps {
  $minWidth?: number;
}

const Table = ({ minWidth, children }: TableProps) => {
  return <TableBlock $minWidth={minWidth}>{children}</TableBlock>;
};

export default Table;

const TableBlock = styled.table<TableBlockProps>`
  width: 100%;
  min-width: ${({ $minWidth }) => css`
    ${$minWidth ? $minWidth : 1300}px
  `};
  border: 1px solid #cbd5e0;
`;
