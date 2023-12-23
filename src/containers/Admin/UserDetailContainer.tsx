import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import UserDetail from '../../components/Admin/User/UserDetail';
import axios from '../../libs/axios';

const UserDetailContainer = () => {
  const params = useParams();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/admin/${params.userId}`);
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return <UserDetail loading={loading} error={error} user={user} />;
};

export default UserDetailContainer;
