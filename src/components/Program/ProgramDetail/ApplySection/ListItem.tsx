interface ListItemProps {
  checked?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const ListItem = ({ checked, children, onClick }: ListItemProps) => {
  return (
    <li
      className="flex cursor-pointer items-center gap-3 py-3"
      onClick={onClick}
    >
      {checked ? (
        <i className="h-6 w-6">
          <img src="/icons/check.svg" alt="check" className="w-full" />
        </i>
      ) : (
        <div className="h-6 w-6"></div>
      )}
      {children}
    </li>
  );
};

export default ListItem;
