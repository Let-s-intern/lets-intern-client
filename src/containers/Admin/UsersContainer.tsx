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

  const searchUsersWithQuery = (users: any) => {
    const keyword = searchParams.get('keyword');
    const type = searchParams.get('type');
    const th = Number(searchParams.get('th'));
    const managerId = Number(searchParams.get('managerId'));
    if (keyword) {
      users = users.filter(
        (user: any) =>
          user.name.includes(keyword) ||
          user.email.includes(keyword) ||
          user.phoneNum.includes(keyword),
      );
    }
    if (type) {
      users = users.filter((user: any) => {
        for (const program of user.programs) {
          if (program.type === type) {
            return true;
          }
        }
        return false;
      });
    }
    if (th) {
      users = users.filter((user: any) => {
        for (const program of user.programs) {
          if (program.th === th) {
            return true;
          }
        }
        return false;
      });
    }
    if (managerId) {
      if (managerId === 0) {
        users = users.filter((user: any) => user.managerId === null);
      } else {
        users = users.filter((user: any) => user.managerId === managerId);
      }
    }

    return users;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/user/admin');
        let newUsers = [];
        for (const user of res.data.userList) {
          const res = await axios.get(`/program/admin/user/${user.id}`);
          newUsers.push({
            ...user,
            programs: [...res.data.userProgramList],
          });
        }
        newUsers = searchUsersWithQuery(newUsers);
        setUsers(newUsers);
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
  }, [searchParams]);

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
      setUsers={setUsers}
      setSearchValues={setSearchValues}
    />
  );
};

export default UsersContainer;
