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

  return (
    <Users
      loading={loading}
      error={error}
      users={users}
      managers={managers}
      searchValues={searchValues}
      handleChangeSearchValues={handleChangeSearchValues}
    />
  );
};

export default UsersContainer;
