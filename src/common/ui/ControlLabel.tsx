import { twMerge } from '@/lib/twMerge';
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  Radio,
} from '@mui/material';
import React, { CSSProperties, memo } from 'react';

const RADIO_SX = {
  color: '#E7E7E7',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};

const CHECKBOX_SX = {
  color: '#E7E7E7',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};

const DEFAULT_LABEL_SX = {
  '.MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#2A2D34',
    fontFamily: 'Pretendard Variable',
    'white-space': 'pre-line',
  },
};

interface ExtendedControlLabelProps
  extends Omit<FormControlLabelProps, 'control'> {
  subText?: string;
  right?: React.ReactNode;
  wrapperClassName?: string;
  labelStyle?: CSSProperties;
}

export const OptionFormRadioControlLabel: React.FC<ExtendedControlLabelProps> =
  memo(function OptionFormRadioControlLabel({
    subText,
    labelStyle,
    sx,
    right,
    wrapperClassName,
    ...restProps
  }) {
    const extendedSx = {
      ...sx,
      '.MuiFormControlLabel-label': {
        ...DEFAULT_LABEL_SX['.MuiFormControlLabel-label'],
        ...labelStyle,
      },
    };

    return (
      <div
        className={twMerge(
          'flex items-center justify-between',
          wrapperClassName,
        )}
      >
        <div className="flex items-center">
          <FormControlLabel
            sx={extendedSx}
            control={<Radio size="small" sx={RADIO_SX} />}
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
  });

export const OptionFormCheckboxControlLabel: React.FC<
  ExtendedControlLabelProps
> = ({ subText, sx, right, labelStyle, wrapperClassName, ...restProps }) => {
  const extendedSx = {
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
          sx={extendedSx}
          control={<Checkbox size="small" sx={CHECKBOX_SX} />}
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
