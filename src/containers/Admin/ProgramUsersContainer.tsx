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
      const res = await axios.get(`/application/admin/${params.programId}`);
      console.log(res.data.applicationList);
      setApplications(res.data.applicationList);
    } catch (err) {
      alert('참여 상태 변경에 실패했습니다.');
    }
  };

  const handleEmailListDownload = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailSend = async (isApproved: boolean) => {
    const emailList = isApproved
      ? applications
          .filter(
            (application: any) =>
              application.application.status === 'IN_PROGRESS',
          )
          .map((application: any) => application.application.email)
      : applications
          .filter(
            (application: any) =>
              application.application.status === 'APPLIED_NOT_APPROVED',
          )
          .map((application: any) => application.application.email);
    const subject =
      (isApproved ? '참가확정 이메일 목록' : '미선발 이메일 목록') +
      ' - ' +
      program.title;
    const emailString = subject + '\n' + emailList.join('\n');
    handleEmailListDownload(subject + '.txt', emailString);
  };

  return (
    <ProgramUsers
      loading={loading}
      error={error}
      program={program}
      applications={applications}
      handleApplicationStatusChange={handleApplicationStatusChange}
      onEmailSend={handleEmailSend}
    />
  );
};

export default ProgramUsersContainer;
