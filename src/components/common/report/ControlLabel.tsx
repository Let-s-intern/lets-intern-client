import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  Radio,
} from '@mui/material';
import React from 'react';

const radioSx = {
  color: '#E7E7E7',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};

const checkboxSx = {
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

interface ExtendedControlLabelProps
  extends Omit<FormControlLabelProps, 'control'> {
  subText?: string;
  right?: React.ReactNode;
}

export const ReportFormRadioControlLabel: React.FC<
  ExtendedControlLabelProps
> = ({ subText, sx, ...restProps }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FormControlLabel
          sx={{ ...labelSx, ...sx }}
          control={<Radio size="small" sx={radioSx} />}
          {...restProps}
        />
        {subText && (
          <span className="-ml-2 inline-block text-xsmall14 font-medium text-neutral-50">
            {subText}
          </span>
        )}
      </div>
      {restProps.right ? restProps.right : <div>{/* empty */}</div>}
    </div>
  );
};

export const ReportFormCheckboxControlLabel: React.FC<
  ExtendedControlLabelProps
> = ({ subText, sx, ...restProps }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FormControlLabel
          sx={{ ...labelSx, ...sx }}
          control={<Checkbox size="small" sx={checkboxSx} />}
          {...restProps}
        />
        {subText && (
          <span className="-ml-2 inline-block text-xsmall14 font-medium text-neutral-50">
            {subText}
          </span>
        )}
      </div>
      {restProps.right ? restProps.right : <div>{/* empty */}</div>}
    </div>
  );
};
