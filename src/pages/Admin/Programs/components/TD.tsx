import { TDProps } from '../interfaces';

const TD = ({ children, className }: TDProps) => {
  return (
    <td
      className={`border border-slate-300 px-4 py-2${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </td>
  );
};

export default TD;
