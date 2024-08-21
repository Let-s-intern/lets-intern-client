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

const ControlLabel = ({
  label,
  value,
  subText,
}: {
  label: string;
  value: string;
  subText?: string;
}) => {
  return (
    <div className="flex items-center">
      <FormControlLabel
        sx={labelSx}
        value={value}
        control={<Radio size="small" sx={radioSx} />}
        label={label}
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
