import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from '../../libs/axios';
import ProgramUsers from '../../components/Admin/Program/ProgramUsers';

const ProgramUsersContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/program/admin/${params.programId}`);
        setProgram(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchProgramUsers = async () => {
      try {
        const res = await axios.get(`/application/admin/${params.programId}`);
        console.log(res.data);
        setApplications(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
    fetchProgramUsers();
  }, [params]);

  return (
    <ProgramUsers
      loading={loading}
      error={error}
      program={program}
      applications={applications}
    />
  );
};

export default ProgramUsersContainer;
