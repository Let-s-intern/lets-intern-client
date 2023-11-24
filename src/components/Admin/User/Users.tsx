import ActionButton from '../ActionButton';
import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import TableBody from './TableBody';
import TableHead from './TableHead';

const Users = () => {
  return (
    <>
      <Header>
        <Heading>회원 관리</Heading>
        <ActionButton bgColor="blue">등록</ActionButton>
      </Header>
      <Table>
        <TableHead />
        <TableBody />
      </Table>
    </>
  );
};

export default Users;
