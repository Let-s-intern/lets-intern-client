import { useEffect, useState } from 'react';

import Users from '../../components/Admin/User/Users';
import axios from '../../libs/axios';

const UsersContainer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/user/admin');
        setUsers(res.data.userList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return <Users users={users} />;
};

export default UsersContainer;
