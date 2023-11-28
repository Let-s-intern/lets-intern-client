import styled from 'styled-components';
import ActionButton from '../ActionButton';
import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import Filter from './Filter';
import TableBody from './TableBody';
import TableHead from './TableHead';

interface UsersProps {
  loading: boolean;
  error: unknown;
  users: any[];
  managers: any[];
  searchValues: any;
  handleChangeSearchValues: (e: any) => void;
}

const Users = ({
  loading,
  error,
  users,
  managers,
  searchValues,
  handleChangeSearchValues,
}: UsersProps) => {
  if (loading) {
    return <></>;
  }

  if (error) {
    return <>에러 발생</>;
  }

  return (
    <>
      <Header>
        <Heading>회원 관리</Heading>
        <ActionButton to="/admin/users/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <FilterWrapper>
        <Filter
          searchValues={searchValues}
          managers={managers}
          onChangeSearchValues={handleChangeSearchValues}
        />
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
