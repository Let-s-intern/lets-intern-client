import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from '../../libs/axios';
import ProgramUsers from '../../components/Admin/Program/ProgramUsers';

const ProgramUsersContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [isLetsChat, setIsLetsChat] = useState<boolean>(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const {
          data: { type },
        } = await axios.get(`/program/admin/${params.programId}`);
        if (type === 'LETS_CHAT') {
          setIsLetsChat(true);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [params]);

  if (loading) {
    return <div className="mx-auto max-w-xl"></div>;
  }

  if (error) {
    return <div></div>;
  }

  return <ProgramUsers isLetsChat={isLetsChat} />;
};

export default ProgramUsersContainer;
