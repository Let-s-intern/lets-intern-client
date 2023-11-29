import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

interface InputProps {
  type?: string;
  placeholder?: string;
  name?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputBlock = styled(TextField)({
  '& input:valid:hover + fieldset': {
    borderColor: '#6963F6',
  },
  '& input:valid:focus + fieldset': {
    borderColor: '#6963F6',
  },
  '& label.Mui-focused': {
    color: '#6963F6',
  },
});

const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  label,
  disabled,
  multiline,
  rows,
  onChange,
  className,
}: InputProps) => {
  return (
    <InputBlock
      type={type}
      label={label}
      placeholder={placeholder}
      name={name}
      value={value}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      onChange={onChange}
      autoComplete="off"
      fullWidth
      sx={{ backgroundColor: 'white' }}
      className={className}
    />
  );
};

export default Input;
