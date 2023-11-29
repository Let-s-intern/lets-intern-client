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

  const handleEmailSend = async (isApproved: boolean) => {
    try {
      const res = await axios.get(
        `/application/admin/email/${params.programId}`,
      );
      const emailList = isApproved
        ? res.data.approvedEmailList
        : res.data.notApprovedEmailList;
      const emailSubject = isApproved ? '참가확정 이메일' : '미선발 이메일';
      const emailBody = isApproved
        ? '참가확정되셨습니다.'
        : '미선발되셨습니다.';
      const emailString =
        emailList.join(',') + `?subject=${emailSubject}&body=${emailBody}`;
      const url = `mailto:${emailString}`;
      window.open(url);
    } catch (err) {
      alert('이메일 전송에 실패했습니다.');
    }
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
