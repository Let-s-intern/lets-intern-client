import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import AttendTableBody from './AttendTableBody';
import AttendTableHead from './AttendTableHead';
import axios from '../../../utils/axios';

const AttendCheck = () => {
  const params = useParams();
  const [program, setProgram] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      let res;
      res = await axios.get(`/program/admin/${params.programId}`);
      setProgram(res.data);
      res = await axios.get(`/application/admin/${params.programId}`);
      const newApplications = res.data.applicationList.filter(
        (application: any) => application.application.status === 'IN_PROGRESS',
      );
      setApplications(newApplications);
    };
    fetchData();
  }, []);

  const handleAttendCheckChange = async (e: any, applicationId: number) => {
    await axios.patch(`/application/${applicationId}`, {
      attendance: e.target.value,
    });
    const res = await axios.get(`/application/admin/${params.programId}`);
    setApplications(res.data.applicationList);
  };

  return (
    <>
      <Header>
        <Heading>출석체크 - {program.title}</Heading>
      </Header>
      <Table>
        <AttendTableHead />
        <AttendTableBody
          program={program}
          applications={applications}
          onAttendCheckChange={handleAttendCheckChange}
        />
      </Table>
    </>
  );
};

export default AttendCheck;
