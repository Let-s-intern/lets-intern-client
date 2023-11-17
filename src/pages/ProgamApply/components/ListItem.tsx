import { ListItemProps } from '../interface';

const ListItem = ({ checked, children }: ListItemProps) => {
  return (
    <li className="flex items-center gap-3 py-3">
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
