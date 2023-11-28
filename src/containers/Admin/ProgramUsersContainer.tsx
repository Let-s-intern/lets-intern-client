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
      }
    };
    const fetchProgramUsers = async () => {
      try {
        const res = await axios.get(`/application/admin/${params.programId}`);
        console.log(res.data.applicationList);
        setApplications(res.data.applicationList);
      } catch (err) {
        setError(err);
      }
    };
    fetchProgram();
    fetchProgramUsers();
    setLoading(false);
  }, [params]);

  const handleApplicationStatusChange = async (
    e: any,
    applicationId: number,
  ) => {
    try {
      await axios.patch(`/application/${applicationId}`, {
        status: e.target.value,
        isApproved: e.target.value === 'IN_PROGRESS',
      });
      setApplications(
        applications.map((application: any) => {
          if (application.id === applicationId) {
            return {
              ...application,
              status: e.target.value,
              isApproved: e.target.value === 'IN_PROGRESS',
            };
          }
          return application;
        }),
      );
    } catch (err) {
      alert('참여 상태 변경에 실패했습니다.');
    }
  };

  return (
    <ProgramUsers
      loading={loading}
      error={error}
      program={program}
      applications={applications}
      handleApplicationStatusChange={handleApplicationStatusChange}
    />
  );
};

export default ProgramUsersContainer;
