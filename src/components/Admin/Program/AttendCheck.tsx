import Header from '../Header';
import Heading from '../Heading';
import Table from '../Table';
import AttendTableBody from './AttendTableBody';
import AttendTableHead from './AttendTableHead';

interface AttendCheckProps {
  loading: boolean;
  error: unknown;
  program: any;
  applications: any;
  handleAttendCheckChange: (e: any, applicationId: number) => void;
}

const AttendCheck = (props: AttendCheckProps) => {
  return (
    <>
      <Header>
        <Heading>출석체크 - {props.program.title}</Heading>
      </Header>
      <Table>
        <AttendTableHead />
        <AttendTableBody
          program={props.program}
          applications={props.applications}
          onAttendCheckChange={props.handleAttendCheckChange}
        />
      </Table>
    </>
  );
};

export default AttendCheck;
