import { useEffect, useState } from 'react';

import Users from '../../components/Admin/User/Users';
import axios from '../../libs/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UsersContainer = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [searchValues, setSearchValues] = useState<any>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/user/admin');
        console.log(res.data.userList);
        setUsers(res.data.userList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchManagers = async () => {
      try {
        const res = await axios.get('/user/admin/manager');
        setManagers(res.data.managerList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchManagers();
  }, []);

  const handleChangeSearchValues = (e: any) => {
    const { name, value } = e.target;
    setSearchValues({
      ...searchValues,
      [name]: value,
    });
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      alert('삭제가 취소되었습니다.');
      return;
    }
    await axios.delete(`/user/admin/${userId}`);
    const newUser = users.filter((user: any) => user.id !== userId);
    setUsers(newUser);
    alert('삭제되었습니다.');
  };

  return (
    <Users
      loading={loading}
      error={error}
      users={users}
      managers={managers}
      searchValues={searchValues}
      handleChangeSearchValues={handleChangeSearchValues}
      handleDeleteUser={handleDeleteUser}
    />
  );
};

export default UsersContainer;
