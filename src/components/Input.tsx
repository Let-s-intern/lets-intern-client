import TextField from '@mui/material/TextField';
import { makeStyles, styled } from '@mui/material/styles';

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

// const InputBlock = styled(TextField)({
//   '& input:valid:hover + fieldset': {
//     borderColor: '#6963F6',
//   },
//   '& input:valid:focus + fieldset': {
//     borderColor: '#6963F6',
//   },
//   '& label.Mui-focused': {
//     color: '#6963F6',
//   },
//   '& textarea:valid:hover + fieldset': {
//     borderColor: '#6963F6',
//   },
//   '& textarea:valid:focus + fieldset': {
//     borderColor: '#6963F6',
//   },
// });

const InputBlock = styled(TextField)`
  input:valid:hover + fieldset {
    border-color: #6963f6;
  }
  input:valid:focus + fieldset {
    border-color: #6963f6;
  }
  label.Mui-focused {
    color: #6963f6;
  }
  textarea:hover {
    border-color: #6963f6;
  }
  textarea:focus {
    border-color: #6963f6;
  }
`;

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
    <TextField
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
      className={className}
      sx={{
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6963f6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6963f6',
          },
        },
        '& label.Mui-focused': {
          color: '#6963F6',
        },
      }}
    />
  );
};

export default Input;
