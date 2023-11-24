import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ActionButton from './ActionButton';

interface ListHeaderProps {
  children: React.ReactNode;
}

const ListHeaderBlock = styled.header`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ListHeader = ({ children }: ListHeaderProps) => {
  return (
    <ListHeaderBlock>
      <Heading>{children}</Heading>
      <ActionButton to="/admin/programs/create" bgColor="blue">
        등록
      </ActionButton>
    </ListHeaderBlock>
  );
};

export default ListHeader;
