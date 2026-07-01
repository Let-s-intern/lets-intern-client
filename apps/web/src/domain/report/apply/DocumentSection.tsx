'use client';

import { FormControl, RadioGroup } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import { convertReportTypeStatus } from '@/api/report';
import { OptionFormRadioControlLabel } from '@/common/ControlLabel';
import FilledInput from '@/domain/report/ui/FilledInput';
import Heading2 from '@/domain/report/ui/heading/Heading2';
import RequiredStar from '@/domain/report/ui/RequiredStar';
import useValidateUrl from '@/hooks/useValidateUrl';
import useReportApplicationStore from '@/store/useReportApplicationStore';

import { FileUploadButton } from './FileUploadButton';

export const DocumentSection = ({
  file,
  dispatch,
}: {
  file: File | null;
  dispatch: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const params = useParams<{ reportType: string }>();
  const { reportType } = params;

  const [value, setValue] = useState('file');

  const { data, setReportApplication } = useReportApplicationStore();
  const isValidUrl = useValidateUrl(data.applyUrl);

  return (
    <section className="flex flex-col lg:flex-row lg:items-start lg:gap-5">
      <div className="mb-3 flex w-40 shrink-0 items-center">
        <Heading2>진단용 {convertReportTypeStatus(reportType!)}</Heading2>
        <RequiredStar />
      </div>
      <FormControl fullWidth>
        <RadioGroup
          defaultValue="file"
          name="radio-buttons-group"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value === 'url') dispatch(null);
            else setReportApplication({ applyUrl: null });
          }}
        >
          {/* 파일 첨부 */}
          <div className="mb-4">
            <OptionFormRadioControlLabel
              label="파일 첨부"
              value="file"
              subText="(pdf, doc, docx 형식 지원, 50MB 이하)"
            />
            {value === 'file' && (
              <FileUploadButton file={file} dispatch={dispatch} />
            )}
          </div>
          {/* URL */}
          <div>
            <OptionFormRadioControlLabel label="URL" value="url" />
            {value === 'url' && (
              <FilledInput
                name="applyUrl"
                placeholder="https://"
                value={data.applyUrl || undefined}
                onChange={(e) =>
                  setReportApplication({ applyUrl: e.target.value })
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
    </section>
  );
};
