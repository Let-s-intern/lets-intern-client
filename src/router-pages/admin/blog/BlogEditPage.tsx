import {
  useBlogListQuery,
  useBlogQuery,
  useBlogTagQuery,
  useDeleteBlogTagMutation,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '@/api/blog';
import { PostTag, postTagSchema, TagDetail } from '@/api/blogSchema';
import { uploadFile } from '@/api/file';
import { useGetProgramAdminQuery } from '@/api/program';
import TagSelector from '@/components/admin/blog/TagSelector';
import TextFieldLimit from '@/components/admin/blog/TextFieldLimit';
import EditorApp from '@/components/admin/lexical/EditorApp';
import ImageUpload from '@/components/admin/program/ui/form/ImageUpload';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { ProgramStatusEnum } from '@/schema';
import { blogCategory } from '@/utils/convert';
import Heading2 from '@components/admin/ui/heading/Heading2';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { isAxiosError } from 'axios';
import { Dayjs } from 'dayjs';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const maxCtaTextLength = 23;
const maxTitleLength = 49;
const maxDescriptionLength = 100;
const initialBlog = {
  title: '',
  category: '',
  thumbnail: '',
  description: '',
  content: '',
  ctaLink: '',
  ctaText: '',
  displayDate: null,
  isDisplayed: '',
  tagList: [],
};
const { PROCEEDING, PREV } = ProgramStatusEnum.enum;

interface EditBlog {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  displayDate: Dayjs | null;
  tagList: TagDetail[];
}

const BlogEditPage = () => {
  const navgiate = useNavigate();
  const { id } = useParams();

  const [editingValue, setEditingValue] = useState<EditBlog>(initialBlog);
  const [newTag, setNewTag] = useState('');

  const { snackbar: setSnackbar } = useAdminSnackbar();

  const [dateTime, setDateTime] = useState<Dayjs | null>(null);

  const { data: programData } = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
    status: [PROCEEDING, PREV],
  });
  const { data: blogListData } = useBlogListQuery({
    pageable: { page: 1, size: 10000 },
  });
  const { data: tags = [] } = useBlogTagQuery();
  const { data: blogData, isLoading } = useBlogQuery(id!);
  const createBlogTagMutation = usePostBlogTagMutation();
  const patchBlogMutation = usePatchBlogMutation();
  const deleteBlogTagMutation = useDeleteBlogTagMutation({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        setSnackbar('블로그에 연결된 태그는 삭제할 수 없습니다.');
      }
    },
  });

  const blogMenuItems = useMemo(
    () =>
      blogListData?.blogInfos.map((info) => (
        <MenuItem
          key={info.blogThumbnailInfo.id}
          value={info.blogThumbnailInfo.id}
        >
          {`[${info.blogThumbnailInfo.id}] ${info.blogThumbnailInfo.title}`}
        </MenuItem>
      )),
    [blogListData],
  );
  const programMenuItems = useMemo(
    () =>
      programData?.programList.map((program) => (
        <MenuItem
          key={program.programInfo.programType + program.programInfo.id}
          value={`${program.programInfo.programType}-${program.programInfo.id}`}
        >
          {`[${program.programInfo.programType}] ${program.programInfo.title}`}
        </MenuItem>
      )),
    [programData],
  );

  const initialEditorStateJsonString =
    !blogData?.blogDetailInfo.content || blogData?.blogDetailInfo.content === ''
      ? undefined
      : blogData?.blogDetailInfo.content;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue({
      ...editingValue,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const onSubmitTag = async (event: FormEvent) => {
    event.preventDefault();
    if (newTag.trim() === '') return;

    const isExist = tags?.some((tag) => tag.title === newTag);
    if (isExist) {
      setSnackbar('이미 존재하는 태그입니다.');
      return;
    }

    const res = await createBlogTagMutation.mutateAsync(newTag);
    const createdTag = postTagSchema.parse(res.data.data);
    selectTag(createdTag);
    setNewTag('');
    setSnackbar(`태그가 생성되었습니다: ${newTag}`);
  };

  const selectTag = (tag: TagDetail | PostTag) => {
    const isExist = editingValue.tagList.some((item) => item.id === tag.id);
    if (isExist) return;

    setEditingValue((prev) => ({
      ...prev,
      tagList: [...editingValue.tagList, tag],
    }));
  };

  const onChangeEditor = (jsonString: string) => {
    setEditingValue((prev) => ({ ...prev, content: jsonString }));
  };

  const patchBlog = async (event: MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    await patchBlogMutation.mutateAsync({
      ...editingValue,
      id: Number(id),
      isDisplayed: name === 'publish',
      tagList: editingValue.tagList.map((tag) => tag.id),
      displayDate: dateTime?.format('YYYY-MM-DDTHH:mm'),
    });

    setSnackbar('블로그가 수정되었습니다.');
  };

  useEffect(() => {
    if (isLoading || !blogData) return;
    const displayDate = blogData.blogDetailInfo.displayDate
      ? dayjs(blogData.blogDetailInfo.displayDate)
      : null;
    setEditingValue({
      title: blogData.blogDetailInfo.title!,
      category: blogData.blogDetailInfo.category!,
      thumbnail: blogData.blogDetailInfo.thumbnail || '',
      description: blogData.blogDetailInfo.description || '',
      content: blogData.blogDetailInfo.content || '',
      ctaLink: blogData.blogDetailInfo.ctaLink || '',
      ctaText: blogData.blogDetailInfo.ctaText || '',
      displayDate,
      tagList: blogData.tagDetailInfos,
    });
    setDateTime(displayDate);
  }, [isLoading, blogData]);

  return (
    <div className="mx-3 mb-40 mt-3">
      <header>
        <h1 className="text-2xl font-semibold">블로그 수정</h1>
      </header>
      {isLoading ? (
        <span>로딩 중...</span>
      ) : blogData ? (
        <main className="max-w-screen-xl">
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex-no-wrap flex items-center gap-4">
              <FormControl size="small" required>
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
                  {Object.entries(blogCategory).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  카테고리는 하나만 설정할 수 있습니다.
                </FormHelperText>
              </FormControl>
            </div>

            <TextFieldLimit
              type="text"
              label="제목"
              placeholder="제목"
              name="title"
              required
              value={editingValue.title}
              onChange={onChange}
              autoComplete="off"
              fullWidth
              maxLength={maxTitleLength}
              autoFocus={true}
            />
            <TextFieldLimit
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
            />

            <div className="flex gap-4">
              <div className="w-56">
                <ImageUpload
                  label="블로그 썸네일"
                  id="file"
                  image={editingValue.thumbnail}
                  onChange={async (e) => {
                    const file = e.target.files?.item(0);
                    if (!file) {
                      setSnackbar('파일이 없습니다.');
                      return;
                    }
                    const url = await uploadFile({ file, type: 'BLOG' });

                    setEditingValue({ ...editingValue, thumbnail: url });
                  }}
                />
              </div>
              <div className="flex-1">
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
              </div>
            </div>

            <div className="border px-6 py-10">
              <h2 className="mb-4">태그 설정</h2>
              <TagSelector
                selectedTagList={editingValue.tagList}
                tagList={tags}
                value={newTag}
                deleteSelectedTag={(id) => {
                  setEditingValue((prev) => ({
                    ...prev,
                    tagList: prev.tagList.filter((tag) => tag.id !== id),
                  }));
                }}
                deleteTag={async (tagId) => {
                  const res = await deleteBlogTagMutation.mutateAsync(tagId);
                  if (res?.status === 200) {
                    setSnackbar('태그를 삭제했습니다.');
                  }
                }}
                selectTag={selectTag}
                onChange={onChangeTag}
                onSubmit={onSubmitTag}
              />
            </div>

            <div className="flex gap-5">
              {/* 프로그램 추천 */}
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <Heading2>프로그램 추천</Heading2>
                  <span className="text-xsmall14 text-neutral-40">
                    *모집중, 모집예정인 프로그램만 불러옵니다.
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <FormControl size="small">
                      <InputLabel>프로그램 선택</InputLabel>
                      <Select
                        value=""
                        fullWidth
                        size="small"
                        label="프로그램 선택"
                      >
                        {programMenuItems}
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      label="CTA 소제목1"
                      placeholder="CTA 소제목1"
                      name="ctaTitle1"
                      fullWidth
                    />
                    {/* 선택한 프로그램이 있으면 링크 입력란 숨기기 */}
                    <TextField
                      size="small"
                      label="CTA 링크1"
                      placeholder="CTA 링크1"
                      name="ctaLink1"
                      fullWidth
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormControl size="small">
                      <InputLabel>프로그램 선택</InputLabel>
                      <Select
                        value=""
                        fullWidth
                        size="small"
                        label="프로그램 선택"
                      >
                        {programMenuItems}
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      label="CTA 소제목2"
                      placeholder="CTA 소제목2"
                      name="ctaTitle2"
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="CTA 링크2"
                      placeholder="CTA 링크2"
                      name="ctaLink2"
                      fullWidth
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormControl size="small">
                      <InputLabel>프로그램 선택</InputLabel>
                      <Select
                        value=""
                        fullWidth
                        size="small"
                        label="프로그램 선택"
                      >
                        {programMenuItems}
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      label="CTA 소제목3"
                      placeholder="CTA 소제목3"
                      name="ctaTitle3"
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="CTA 링크3"
                      placeholder="CTA 링크3"
                      name="ctaLink3"
                      fullWidth
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormControl size="small">
                      <InputLabel>프로그램 선택</InputLabel>
                      <Select
                        value=""
                        fullWidth
                        size="small"
                        label="프로그램 선택"
                      >
                        {programMenuItems}
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      label="CTA 소제목4"
                      placeholder="CTA 소제목4"
                      name="ctaTitle4"
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="CTA 링크4"
                      placeholder="CTA 링크4"
                      name="ctaLink4"
                      fullWidth
                    />
                  </div>
                </div>
              </div>
              {/* 블로그 추천 */}
              <div className="flex-1">
                <Heading2 className="mb-3">블로그 추천</Heading2>
                <div className="flex flex-col gap-3">
                  <FormControl size="small">
                    <InputLabel>블로그 ID 1</InputLabel>
                    <Select value="" fullWidth size="small" label="블로그 ID 1">
                      {blogMenuItems}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>블로그 ID 2</InputLabel>
                    <Select value="" fullWidth size="small" label="블로그 ID 2">
                      {blogMenuItems}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>블로그 ID 3</InputLabel>
                    <Select value="" fullWidth size="small" label="블로그 ID 3">
                      {blogMenuItems}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>블로그 ID 4</InputLabel>
                    <Select value="" fullWidth size="small" label="블로그 ID 4">
                      {blogMenuItems}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="border px-6 py-10">
              <h2 className="mb-2">게시 일자</h2>
              <DateTimePicker
                label="게시 일자"
                value={dateTime}
                onChange={setDateTime}
              />
            </div>

            <h2 className="mt-10">콘텐츠 편집</h2>
            <EditorApp
              initialEditorStateJsonString={initialEditorStateJsonString}
              onChange={onChangeEditor}
            />
            <div className="text-right">
              <div className="mb-1 flex items-center justify-end gap-4">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    navgiate('/admin/blog/list');
                  }}
                >
                  취소 (리스트로 돌아가기)
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  type="button"
                  name="save_temp"
                  onClick={patchBlog}
                >
                  임시 저장
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  name="publish"
                  onClick={patchBlog}
                >
                  발행
                </Button>
              </div>
              <span className="text-0.875 text-neutral-35">
                *임시 저장: 블로그가 숨겨집니다.
              </span>
            </div>
          </div>
        </main>
      ) : (
        <span>블로그를 불러오지 못했습니다.</span>
      )}
    </div>
  );
};

export default BlogEditPage;
