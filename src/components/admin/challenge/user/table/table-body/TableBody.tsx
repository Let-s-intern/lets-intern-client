import TableBodyRow from './TableBodyRow';

const TableBody = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
        <TableBodyRow
          key={th}
          name="송민제"
          isMember={true}
          school="렛인대 전공 4학년"
          email="minje0403@gmail.com"
          tel="010-1111-1111"
          inflowPath="인스타그램"
          account="하나은행 123-455678-102848"
        />
      ))}
    </div>
  );
};

export default TableBody;
