import { twMerge } from '@/lib/twMerge';
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  Radio,
} from '@mui/material';
import React, { CSSProperties } from 'react';

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

const DEFAULT_LABEL_SX = {
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
  wrapperClassName?: string;
  labelStyle?: CSSProperties;
}

export const ReportFormRadioControlLabel: React.FC<
  ExtendedControlLabelProps
> = ({ subText, labelStyle, sx, right, wrapperClassName, ...restProps }) => {
  const defaultSx = {
    ...sx,
    '.MuiFormControlLabel-label': {
      ...DEFAULT_LABEL_SX['.MuiFormControlLabel-label'],
      ...labelStyle,
    },
  };

  return (
    <div
      className={twMerge(
        'flex items-center justify-between py-2',
        wrapperClassName,
      )}
    >
      <div className="flex h-5 items-center">
        <FormControlLabel
          sx={defaultSx}
          control={<Radio size="small" sx={radioSx} />}
          {...restProps}
        />
        {subText && (
          <span className="-ml-2 inline-block text-xsmall14 font-medium text-neutral-50">
            {subText}
          </span>
        )}
      </div>
      {right ? right : <div>{/* empty */}</div>}
    </div>
  );
};

export const ReportFormCheckboxControlLabel: React.FC<
  ExtendedControlLabelProps
> = ({ subText, sx, right, wrapperClassName, ...restProps }) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between py-2',
        wrapperClassName,
      )}
    >
      <div className="flex h-5 items-center">
        <FormControlLabel
          sx={{ ...DEFAULT_LABEL_SX, ...sx }}
          control={<Checkbox size="small" sx={checkboxSx} />}
          {...restProps}
        />
        {subText && (
          <span className="-ml-2 inline-block text-xsmall14 font-medium text-neutral-50">
            {subText}
          </span>
        )}
      </div>
      {right ? right : <div>{/* empty */}</div>}
    </div>
  );
};
