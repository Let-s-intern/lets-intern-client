import TableBodyRow from './TableBodyRow';

interface Props {
  applicationList: any;
}

const TableBody = ({ applicationList }: Props) => {
  return (
    <div className="mb-12 flex flex-col">
      {applicationList.map((application: any) => (
        <TableBodyRow
          key={application.applicationId}
          application={application}
        />
      ))}
    </div>
  );
};

export default TableBody;
