import { FormControlLabel, Radio } from '@mui/material';

const radioSx = {
  color: '#E7E7E7',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};
const labelSx = {
  '.MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#4C4F56',
  },
};

interface ControlLabelProps {
  label: string;
  value: string;
  name?: string;
  subText?: string;
}

const ControlLabel = ({ label, value, name, subText }: ControlLabelProps) => {
  return (
    <div className="flex items-center">
      <FormControlLabel
        sx={labelSx}
        value={value}
        control={<Radio size="small" sx={radioSx} />}
        label={label}
        name={name}
      />
      {subText && (
        <span className="-ml-2 inline-block text-xsmall14 font-medium text-neutral-50">
          {subText}
        </span>
      )}
    </div>
  );
};

export default ControlLabel;
