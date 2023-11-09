import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const Input = styled(TextField)({
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

export default Input;
