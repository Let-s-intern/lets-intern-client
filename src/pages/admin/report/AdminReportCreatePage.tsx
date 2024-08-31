import { Button, Snackbar, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateReportData, usePostReportMutation } from '../../../api/report';
import EditorApp from '../../../components/admin/lexical/EditorApp';

const initialReport: CreateReportData = {
  reportType: 'PERSONAL_STATEMENT',
  title: '',
  contents: '',
  notice: '',
  priceInfo: [],
  optionInfo: [],
  feedbackInfo: {
    price: 0,
    discountPrice: 0,
  },
};

const AdminReportCreatePage = () => {
  const navgiate = useNavigate();

  const [editingValue, setEditingValue] =
    useState<CreateReportData>(initialReport);
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: '',
  });
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);

  const createReportMutation = usePostReportMutation();

  // const { data: tags = [] } = useReportTagQuery();
  // const createReportTagMutation = usePostReportTagMutation();
  // const deleteReportTagMutation = useDeleteReportTagMutation({
  //   onError: (error) => {
  //     if (isAxiosError(error) && error.response?.status === 400) {
  //       setSnackbar({
  //         open: true,
  //         message: '서류 진단에 연결된 태그는 삭제할 수 없습니다.',
  //       });
  //     }
  //   },
  // });
  // const createReportMutation = usePostReportMutation();

  // const selectedTagList = tags.filter((tag) =>
  //   editingValue.tagList.includes(tag.id),
  // );

  useEffect(() => {
    console.log('editingValue', editingValue);
  }, [editingValue]);

  const postReport = async (event: MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    createReportMutation.mutateAsync({
      ...editingValue,
      visibleDate:
        name === 'publish' ? dayjs().format('YYYY-MM-DDTHH:mm') : null,
    });
    setSnackbar({
      open: true,
      message: '서류 진단가 생성되었습니다.',
    });
    navgiate('/admin/report/list');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  // const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
  //   setNewTag(event.target.value);
  // };

  // const onSubmitTag = async (event: FormEvent) => {
  //   event.preventDefault();
  //   if (newTag.trim() === '') return;

  //   const isExist = tags?.some((tag) => tag.title === newTag);
  //   if (isExist) {
  //     setSnackbar({ open: true, message: '이미 존재하는 태그입니다.' });
  //     return;
  //   }

  //   const res = await createReportTagMutation.mutateAsync(newTag);
  //   const createdTag = postTagSchema.parse(res.data.data);
  //   selectTag(createdTag);
  //   setNewTag('');
  //   setSnackbar({ open: true, message: `태그가 생성되었습니다: ${newTag}` });
  // };

  // const selectTag = (tag: TagDetail | PostTag) => {
  //   setEditingValue((prev) => ({
  //     ...prev,
  //     tagList: [...new Set([...editingValue.tagList, tag.id])],
  //   }));
  // };

  const onChangeEditor = (jsonString: string) => {
    setEditingValue((prev) => ({ ...prev, contents: jsonString }));
  };

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">서류 진단 등록</h1>
      </header>
      <main className="max-w-screen-xl">
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex-no-wrap flex items-center gap-4">
            {/* <FormControl size="small" required>
              <InputLabel id="category-label">카테고리</InputLabel>
              <Select
                className="w-60"
                id="category"
                size="small"
                label="카테고리"
                name="category"
                value={editingValue.category}
                onChange={(e) => {
                  setEditingValue({
                    ...editingValue,
                    category: e.target.value,
                  });
                }}
              >
                {Object.entries(reportCategory).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                카테고리는 하나만 설정할 수 있습니다.
              </FormHelperText>
            </FormControl> */}
          </div>

          <TextField
            value={editingValue.title}
            onChange={onChange}
            variant="outlined"
            name="title"
            label="제목"
            placeholder="서류 진단 제목을 입력하세요"
            fullWidth
            margin="dense"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <FaEdit fontSize="small" />
            //     </InputAdornment>
            //   ),
            //   style: { fontSize: '14px' },
            // }}
            InputLabelProps={{
              shrink: true,
              style: { fontSize: '14px' },
            }}
          />
          {/* <TextFieldLimit
            type="text"
            label="메타 디스크립션"
            placeholder="설명"
            name="description"
            value={editingValue.description}
            onChange={onChange}
            multiline
            minRows={3}
            autoComplete="off"
            fullWidth
            maxLength={maxDescriptionLength}
          /> */}

          <div className="flex gap-4">
            <div className="w-56">
              {/* <ImageUpload
                label="서류 진단 썸네일"
                id="file"
                onChange={async (e) => {
                  const file = e.target.files?.item(0);
                  if (!file) {
                    setSnackbar({ open: true, message: '파일이 없습니다.' });
                    return;
                  }
                  const url = await uploadFile({ file, type: 'REPORT' });

                  setEditingValue({ ...editingValue, thumbnail: url });
                }}
              /> */}
            </div>
            {/* <div className="flex-1">
              <div className="mb-5">
                <TextField
                  type="text"
                  label="CTA 링크"
                  placeholder="CTA 링크"
                  size="small"
                  name="ctaLink"
                  value={editingValue.ctaLink}
                  onChange={onChange}
                  fullWidth
                  autoComplete="off"
                />
                <span className="text-0.875 text-neutral-35">
                  {
                    '*latest:{text}으로 설정하면, 텍스트를 제목에 포함하는 챌린지 상세페이지로 이동합니다. (예시) latest:인턴'
                  }
                </span>
              </div>
              <TextFieldLimit
                type="text"
                label="CTA 텍스트"
                placeholder="CTA 텍스트"
                size="small"
                name="ctaText"
                value={editingValue.ctaText}
                onChange={onChange}
                autoComplete="off"
                fullWidth
                maxLength={maxCtaTextLength}
              />
            </div> */}
          </div>

          {/* <div className="border px-6 py-10">
            <h2 className="mb-2">태그 설정</h2>
            <TagSelector
              selectedTagList={selectedTagList}
              tagList={tags}
              value={newTag}
              deleteSelectedTag={(id) => {
                setEditingValue((prev) => ({
                  ...prev,
                  tagList: prev.tagList.filter((tag) => tag !== id),
                }));
              }}
              deleteTag={async (tagId) => {
                const res = await deleteReportTagMutation.mutateAsync(tagId);
                if (res?.status === 200) {
                  setSnackbar({
                    open: true,
                    message: '태그를 삭제했습니다.',
                  });
                }
              }}
              selectTag={selectTag}
              onChange={onChangeTag}
              onSubmit={onSubmitTag}
            />
          </div> */}

          <div className="border px-6 py-10">
            <h2 className="mb-2">게시 일자</h2>
            <DateTimePicker
              label="게시 일자"
              value={dateTime}
              onChange={setDateTime}
            />
          </div>

          <h2 className="mt-10">콘텐츠 편집</h2>
          <EditorApp onChange={onChangeEditor} />

          <div className="text-right">
            <div className="mb-1 flex items-center justify-end gap-4">
              <Button
                variant="outlined"
                type="button"
                onClick={() => {
                  navgiate('/admin/report/list');
                }}
              >
                취소 (리스트로 돌아가기)
              </Button>
              <Button
                variant="outlined"
                color="primary"
                type="button"
                name="save_temp"
                onClick={postReport}
              >
                임시 저장
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="button"
                name="publish"
                onClick={postReport}
              >
                발행
              </Button>
            </div>
            <span className="text-0.875 text-neutral-35">
              *발행: 서류 진단가 바로 게시됩니다.
            </span>
          </div>
        </div>
      </main>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};

export default AdminReportCreatePage;
