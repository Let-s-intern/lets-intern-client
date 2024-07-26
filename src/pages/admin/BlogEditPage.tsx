import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useBlogQuery,
  useBlogTagQuery,
  usePatchBlogMutation,
  usePostBlogTagMutation,
} from '../../api/blog';
import { TagDetail } from '../../api/blogSchema';
import { usePostFileMutation } from '../../api/file';
import BlogPostEditor from '../../components/admin/blog/BlogPostEditor';
import TagSelector from '../../components/admin/blog/TagSelector';
import TextFieldLimit from '../../components/admin/blog/TextFieldLimit';
import ImageUpload from '../../components/admin/program/ui/form/ImageUpload';
import ActionButton from '../../components/admin/ui/button/ActionButton';
import { blogCategory } from '../../utils/convert';

const maxCtaTextLength = 23;
const maxTitleLength = 49;
const maxDescriptionLength = 100;
const titleHelperText = '제목을 입력해주세요';
const categoryHelperText = '카테고리를 선택주세요';
const initialBlog = {
  title: '',
  category: '',
  thumbnail: '',
  description: '',
  content: '',
  ctaLink: '',
  ctaText: '',
  // isDisplayed: false,
  tagList: [],
};

interface EditBlog {
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  isDisplayed?: boolean;
  tagList: TagDetail[];
}

export default function BlogEditPage() {
  const navgiate = useNavigate();
  const { id } = useParams();

  const [value, setValue] = useState<EditBlog>(initialBlog);
  const [newTag, setNewTag] = useState('');
  const [selectedTagList, setSelectedTagList] = useState<TagDetail[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);

  const { data: blogTagData } = useBlogTagQuery();
  const { data: blogData, isLoading } = useBlogQuery(id!);
  const blogTagMutation = usePostBlogTagMutation(function resetTag() {
    setNewTag('');
  });
  const fileMutation = usePostFileMutation();
  const patchBlogMutation = usePatchBlogMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const saveBlog = async () => {
    if (!validate()) return;

    const thumbnail = await convertFiletoUrl(file);
    const reqBody = {
      ...value,
      id: Number(id),
      thumbnail,
      isDisplayed: false,
      tagList: selectedTagList.map((tag) => tag.id),
    };
    patchBlogMutation.mutate(reqBody);

    navgiate('/admin/blog/list');
  };

  const submitBlog = async () => {
    if (!validate()) return;

    const thumbnail = await convertFiletoUrl(file);
    const reqBody = {
      ...value,
      id: Number(id),
      thumbnail,
      isDisplayed: true,
      tagList: selectedTagList.map((tag) => tag.id),
    };
    patchBlogMutation.mutate(reqBody);

    navgiate('/admin/blog/list');
  };

  const convertFiletoUrl = async (file: File | null) => {
    if (!file) return value.thumbnail;
    const res = await fileMutation.mutateAsync({ type: 'BLOG', file });
    return res.data.data.fileUrl;
  };

  const validate = () => {
    // 제목, 카테고리는 필수값
    let isValid = true;

    if (value.category === '') {
      setIsCategoryValid(false);
      isValid = false;
    }
    if (value.title === '') {
      setIsTitleValid(false);
      isValid = false;
    }
    if (!isValid) scrollTo(0, 0);

    return isValid;
  };

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      setFile(target.files[0]);
      return;
    }
    setValue({ ...value, [event.target.name]: event.target.value });
  };

  const deleteTag = useCallback((id: number) => {
    const i = selectedTagList.findIndex((tag) => tag.id === id);
    setSelectedTagList((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
    const j = value.tagList.findIndex((tag) => tag.id === id);
    setValue((prev) => ({
      ...prev,
      tagList: [...prev.tagList.slice(0, j), ...prev.tagList.slice(j + 1)],
    }));
  }, []);

  const handleChangeTag = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setNewTag(event.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const isEmpty = newTag === '';
      const isExist = blogTagData?.tagDetailInfos.some(
        (tag) => tag.title === newTag,
      );

      if (event.key !== 'Enter' || isEmpty) return;
      if (isExist) {
        alert('이미 존재하는 태그입니다.');
      } else blogTagMutation.mutate(newTag);
    },
    [blogTagData?.tagDetailInfos],
  );

  const getJSONFromLexical = (jsonString: string) => {
    setValue((prev) => ({ ...prev, content: jsonString }));
  };

  const selectTag = useCallback(
    (tag: TagDetail) => {
      if (value.tagList.some((item) => item.id === tag.id)) return;

      setSelectedTagList((prev) => [...prev, { id: tag.id, title: tag.title }]);
      setValue((prev) => ({
        ...prev,
        tagList: [...prev.tagList, tag],
      }));
    },
    [value.tagList],
  );

  useEffect(() => {
    if (isLoading || !blogData) return;
    setValue({
      title: blogData.blogDetailInfo.title!,
      category: blogData.blogDetailInfo.category!,
      thumbnail: blogData.blogDetailInfo.thumbnail || '',
      description: blogData.blogDetailInfo.description || '',
      content: blogData.blogDetailInfo.content || '',
      ctaLink: blogData.blogDetailInfo.ctaLink || '',
      ctaText: blogData.blogDetailInfo.ctaText || '',
      // isDisplayed: blogData.blogDetailInfo.isDisplayed!,
      tagList: blogData.tagDetailInfos!,
    });
    console.log('받은 콘텐츠:', blogData.blogDetailInfo.content);
    setSelectedTagList(blogData.tagDetailInfos!);
  }, [isLoading, blogData]);

  return (
    <div className="mx-auto my-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">블로그 등록</h1>
      </header>
      {isLoading ? (
        <span>로딩 중...</span>
      ) : (
        <>
          <main>
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
              <FormControl
                focused={!isCategoryValid}
                error={!isCategoryValid}
                fullWidth
              >
                <InputLabel id="category">카테고리</InputLabel>
                <Select
                  labelId="category"
                  id="category"
                  label="구분"
                  name="category"
                  value={value.category}
                  onChange={handleChange}
                >
                  {Object.entries(blogCategory).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!isCategoryValid ? categoryHelperText : ''}
                </FormHelperText>
              </FormControl>
              <TextFieldLimit
                type="text"
                label="제목"
                placeholder="제목"
                name="title"
                value={value.title}
                onChange={handleChange}
                autoComplete="off"
                fullWidth
                maxLength={maxTitleLength}
                focused={!isTitleValid}
                error={!isTitleValid}
                helperText={!isTitleValid ? titleHelperText : ''}
              />
              <TextFieldLimit
                type="text"
                label="메타 디스크립션"
                placeholder="설명"
                name="description"
                value={value.description}
                onChange={handleChange}
                multiline
                minRows={3}
                autoComplete="off"
                fullWidth
                maxLength={maxDescriptionLength}
              />
              <ImageUpload
                label="블로그 썸네일"
                id="file"
                name="file"
                image={value.thumbnail}
                onChange={handleChange}
              />
              <BlogPostEditor
                jsonString={value.content}
                getJSONFromLexical={getJSONFromLexical}
              />
              <TextField
                type="text"
                label="CTA 링크"
                placeholder="CTA 링크"
                name="ctaLink"
                value={value.ctaLink}
                onChange={handleChange}
                autoComplete="off"
                fullWidth
              />
              <TextFieldLimit
                type="text"
                label="CTA 텍스트"
                placeholder="CTA 텍스트"
                name="ctaText"
                value={value.ctaText}
                onChange={handleChange}
                autoComplete="off"
                fullWidth
                maxLength={maxCtaTextLength}
              />
              <TagSelector
                selectedTagList={selectedTagList}
                tagList={blogTagData?.tagDetailInfos || []}
                value={newTag}
                deleteTag={deleteTag}
                selectTag={selectTag}
                onChange={handleChangeTag}
                onKeyDown={handleKeyDown}
              />
            </form>
          </main>
          {/* 버튼 */}
          <footer>
            <div className="flex items-center justify-end gap-4">
              {/* 노출된 블로그는 임시 저장 불가능 */}
              {!value.isDisplayed && (
                <ActionButton
                  onClick={saveBlog}
                  type="button"
                  bgColor="gray"
                  width="6rem"
                >
                  임시 저장
                </ActionButton>
              )}
              <ActionButton onClick={submitBlog} type="button">
                발행
              </ActionButton>
              <ActionButton type="button" to="/admin/blog/list" bgColor="gray">
                취소
              </ActionButton>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
