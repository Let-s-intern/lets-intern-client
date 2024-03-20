import TableRow from './TableRow';

interface UserTableBodyProps {
  program: any;
  applications: any[];
  handleApplicationStatusChange: (e: any, applicationId: number) => void;
}

const UserTableBody = ({
  program,
  applications,
  handleApplicationStatusChange,
}: UserTableBodyProps) => {
  return (
    <tbody>
      {applications.map((application: any) => (
        <TableRow
          key={application.application.id}
          application={application}
          program={program}
          handleApplicationStatusChange={handleApplicationStatusChange}
        />
      ))}
    </tbody>
  );
};

export default UserTableBody;
