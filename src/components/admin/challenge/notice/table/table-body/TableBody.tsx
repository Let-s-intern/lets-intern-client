import TableBodyRow from './TableBodyRow';

const TableBody = () => {
  return (
    <div className="border-b border-b-zinc-200 py-1">
      {Array.from({ length: 4 }, (_, index) => index + 1).map((th) => (
        <TableBodyRow
          key={th}
          th={th}
          name="[필독] 공지사항"
          author="운영진"
          createdDate="2024.01.26"
          viewCount={21}
        />
      ))}
    </div>
  );
};

export default TableBody;
