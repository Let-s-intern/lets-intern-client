'use client';

import { FormControl, RadioGroup } from '@mui/material';
import React, { useState } from 'react';

import { OptionFormRadioControlLabel } from '@/common/ControlLabel';
import FilledInput from '@/domain/report/ui/FilledInput';
import Heading2 from '@/domain/report/ui/heading/Heading2';
import RequiredStar from '@/domain/report/ui/RequiredStar';
import useValidateUrl from '@/hooks/useValidateUrl';
import useReportApplicationStore from '@/store/useReportApplicationStore';

import { FileUploadButton } from './FileUploadButton';

export const PremiumSection = ({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [value, setValue] = useState('file');

  const { data, setReportApplication } = useReportApplicationStore();
  const isValidUrl = useValidateUrl(data.recruitmentUrl);

  return (
    <section className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-5">
      {
        <div className="flex w-40 shrink-0 items-center">
          <Heading2>(프리미엄) 채용공고</Heading2>
          <RequiredStar />
        </div>
      }
      <div className="w-full">
        <span className="text-xsmall14 mb-3 inline-block lg:mb-4">
          희망하는 기업의 채용공고를 첨부해주세요.
        </span>
        <FormControl fullWidth>
          <RadioGroup
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value === 'url') dispatch(null);
              else setReportApplication({ recruitmentUrl: null });
            }}
            name="radio-buttons-group"
          >
            <div className="mb-4">
              <OptionFormRadioControlLabel
                sx={{ flexShrink: 0 }}
                label="파일 첨부"
                value="file"
                subText="(png, jpg, jpeg, pdf 형식 지원, 50MB 이하)"
              />
              <span className="text-xxsmall12 text-neutral-45 mb-2 mt-2 block md:mt-0">
                *업무, 지원자격, 우대사항이 보이게 채용공고를 캡처해주세요.
              </span>
              {value === 'file' && (
                <FileUploadButton file={file} dispatch={dispatch} />
              )}
            </div>
            <div>
              <OptionFormRadioControlLabel label="URL" value="url" />
              {value === 'url' && (
                <FilledInput
                  name="recruitmentUrl"
                  placeholder="https://"
                  value={data.recruitmentUrl ?? undefined}
                  onChange={(e) =>
                    setReportApplication({ recruitmentUrl: e.target.value })
                  }
                />
              )}
              {value === 'url' && !isValidUrl && (
                <span className="text-xsmall14 text-system-error h-3">
                  올바른 주소를 입력해주세요
                </span>
              )}
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};
