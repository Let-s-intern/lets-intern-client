import {
  useBlogTagQuery,
  useDeleteBlogTagMutation,
  usePostBlogTagMutation,
} from '@/api/blog/blog';
import { PostTag, postTagSchema, TagDetail } from '@/api/blog/blogSchema';
import TagSelector from '@/domain/admin/blog/TagSelector';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isAxiosError } from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';

interface BlogTagSectionProps {
  tagList: TagDetail[];
  onChangeTagList: (tagList: TagDetail[]) => void;
}

const BlogTagSection = ({ tagList, onChangeTagList }: BlogTagSectionProps) => {
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const { data: tags = [] } = useBlogTagQuery();
  const createBlogTagMutation = usePostBlogTagMutation();
  const deleteBlogTagMutation = useDeleteBlogTagMutation({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        setSnackbar('블로그에 연결된 태그는 삭제할 수 없습니다.');
      }
    },
  });

  const [newTag, setNewTag] = useState('');

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const selectTag = (tag: TagDetail | PostTag) => {
    const isExist = tagList.some((item) => item.id === tag.id);
    if (isExist) return;
    onChangeTagList([...tagList, tag]);
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

  const deleteSelectedTag = (id: number) => {
    onChangeTagList(tagList.filter((tag) => tag.id !== id));
  };

  const deleteTag = async (tagId: number) => {
    const res = await deleteBlogTagMutation.mutateAsync(tagId);
    if (res?.status === 200) {
      setSnackbar('태그를 삭제했습니다.');
    }
  };

  return (
    <div className="border px-6 py-10">
      <h2 className="mb-4">태그 설정</h2>
      <TagSelector
        selectedTagList={tagList}
        tagList={tags}
        value={newTag}
        deleteSelectedTag={deleteSelectedTag}
        deleteTag={deleteTag}
        selectTag={selectTag}
        onChange={onChangeTag}
        onSubmit={onSubmitTag}
      />
    </div>
  );
};

export default BlogTagSection;
