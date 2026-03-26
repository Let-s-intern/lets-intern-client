'use client';

import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/v1/Input';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import {
  CreateVodReq,
  liveAndVodJob,
  ProgramAdminClassification,
  ProgramAdminClassificationEnum,
  ProgramClassification,
  UpdateVodReq,
  VodIdSchema,
} from '@/schema';
import { programClassificationToText } from '@/utils/convert';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useCallback, useState } from 'react';

interface LiveBasicProps<T extends CreateVodReq | UpdateVodReq> {
  defaultValue?: VodIdSchema;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function VodEditor<T extends CreateVodReq | UpdateVodReq>({
  defaultValue,
  setInput,
}: LiveBasicProps<T>) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setInput],
  );

  const [image, setImage] = useState<string | null | undefined>(
    defaultValue?.vodInfo.thumbnail,
  );

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.VOD,
    });
    setImage(url);
    setInput((prev) => ({ ...prev, [e.target.name]: url }));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <FormControl size="small">
        <InputLabel id="programType">프로그램 분류</InputLabel>
        <Select
          labelId="programTypeInfo"
          label="프로그램 분류"
          id="programTypeInfo"
          name="programTypeInfo"
          multiple
          defaultValue={
            defaultValue?.programTypeInfo
              ? defaultValue.programTypeInfo.map(
                  (info) => info.programClassification,
                )
              : []
          }
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              programTypeInfo: (e.target.value as ProgramClassification[]).map(
                (item) => ({
                  classificationInfo: {
                    programClassification: item,
                  },
                }),
              ),
            }))
          }
          input={<OutlinedInput label="프로그램 분류" />}
          renderValue={(selectedList) => (
            <div className="flex flex-wrap gap-2">
              {selectedList.map((selected) => (
                <Chip
                  key={selected}
                  label={
                    programClassificationToText[
                      selected as ProgramClassification
                    ]
                  }
                />
              ))}
            </div>
          )}
        >
          {Object.keys(programClassificationToText).map((type) => (
            <MenuItem key={type} value={type}>
              {programClassificationToText[type as ProgramClassification]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* B2 타입 */}
      <SelectFormControl
        labelId="adminProgramTypeInfo"
        label="B2 타입"
        multiple
        defaultValue={
          defaultValue?.adminProgramTypeInfo
            ? defaultValue.adminProgramTypeInfo.map(
                (info) => info.programAdminClassification,
              )
            : []
        }
        onChange={(e) =>
          setInput((prev) => ({
            ...prev,
            adminProgramTypeInfo: (
              e.target.value as ProgramAdminClassification[]
            ).map((item) => ({
              classificationInfo: {
                programAdminClassification: item,
              },
            })),
          }))
        }
        renderValue={(selectedList) => (
          <div className="flex flex-wrap gap-2">
            {selectedList.map((selected) => (
              <Chip
                key={selected}
                label={
                  ProgramAdminClassificationEnum.enum[
                    selected as ProgramAdminClassification
                  ]
                }
              />
            ))}
          </div>
        )}
      >
        {Object.values(ProgramAdminClassificationEnum.enum).map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </SelectFormControl>

      <FormControl size="small">
        <InputLabel id="job">직무</InputLabel>
        <Select
          labelId="job"
          id="job"
          label="직무"
          name="job"
          defaultValue={defaultValue?.vodInfo.job ?? ''}
          onChange={onChange}
        >
          <MenuItem value="">선택하세요</MenuItem>
          {Object.keys(liveAndVodJob.enum).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ImageUpload
        label="프로그램 썸네일 이미지 업로드"
        id="thumbnail"
        name="thumbnail"
        image={image ?? undefined}
        onChange={onChangeImage}
      />
      <Input
        label="제목"
        type="text"
        name="title"
        placeholder="제목을 입력해주세요"
        defaultValue={defaultValue?.vodInfo.title ?? undefined}
        size="small"
        onChange={onChange}
      />
      <Input
        label="한 줄 설명"
        type="text"
        name="shortDesc"
        size="small"
        defaultValue={defaultValue?.vodInfo.shortDesc ?? undefined}
        placeholder="한 줄 설명을 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="리틀리 링크"
        type="text"
        name="link"
        size="small"
        placeholder="리틀리 링크를 입력해주세요"
        defaultValue={defaultValue?.vodInfo.link || ''}
        onChange={onChange}
      />
    </div>
  );
}
