import { useEffect, useState } from 'react';

import AttendCheck from '../../components/Admin/Program/AttendCheck';
import axios from '../../libs/axios';
import { useParams } from 'react-router-dom';

const AttendCheckContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        res = await axios.get(`/program/admin/${params.programId}`);
        setProgram(res.data);
        res = await axios.get(`/application/admin/${params.programId}`);
        const newApplications = res.data.applicationList.filter(
          (application: any) =>
            application.application.status === 'IN_PROGRESS',
        );
        console.log(newApplications);
        setApplications(newApplications);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAttendCheckChange = async (e: any, applicationId: number) => {
    try {
      await axios.patch(`/application/${applicationId}`, {
        attendance: e.target.value,
      });
      const res = await axios.get(`/application/admin/${params.programId}`);
      setApplications(res.data.applicationList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendCheck
      loading={loading}
      error={error}
      program={program}
      applications={applications}
      handleAttendCheckChange={handleAttendCheckChange}
    />
  );
};

export default AttendCheckContainer;
