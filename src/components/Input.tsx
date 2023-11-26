import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

interface InputProps {
  type?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  placeholder,
  value,
  label,
  onChange,
}: InputProps) => {
  return (
    <InputBlock
      type={type}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="off"
      fullWidth
      sx={{ backgroundColor: 'white' }}
    />
  );
};

export default Input;
