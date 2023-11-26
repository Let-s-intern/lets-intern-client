import styled from 'styled-components';
import ActionButton from '../ActionButton';
import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import Filter from './Filter';
import TableBody from './TableBody';
import TableHead from './TableHead';

interface UsersProps {
  users: any[];
}

const Users = ({ users }: UsersProps) => {
  return (
    <>
      <Header>
        <Heading>회원 관리</Heading>
        <ActionButton to="/admin/users/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <FilterWrapper>
        <Filter />
      </FilterWrapper>
      <Table>
        <TableHead />
        <TableBody users={users} />
      </Table>
    </>
  );
};

export default Users;

const FilterWrapper = styled.div`
  margin-bottom: 1rem;
`;
