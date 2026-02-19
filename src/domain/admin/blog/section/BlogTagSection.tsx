import { PostTag, TagDetail } from '@/api/blog/blogSchema';
import TagSelector from '@/domain/admin/blog/TagSelector';
import { ChangeEvent, FormEvent } from 'react';

interface BlogTagSectionProps {
  selectedTagList: TagDetail[];
  tags: TagDetail[];
  newTag: string;
  onChangeTag: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitTag: (e: FormEvent) => void;
  onSelectTag: (tag: TagDetail | PostTag) => void;
  onDeleteSelectedTag: (id: number) => void;
  onDeleteTag: (tagId: number) => Promise<void>;
}

const BlogTagSection = ({
  selectedTagList,
  tags,
  newTag,
  onChangeTag,
  onSubmitTag,
  onSelectTag,
  onDeleteSelectedTag,
  onDeleteTag,
}: BlogTagSectionProps) => {
  return (
    <div className="border px-6 py-10">
      <h2 className="mb-4">태그 설정</h2>
      <TagSelector
        selectedTagList={selectedTagList}
        tagList={tags}
        value={newTag}
        deleteSelectedTag={onDeleteSelectedTag}
        deleteTag={onDeleteTag}
        selectTag={onSelectTag}
        onChange={onChangeTag}
        onSubmit={onSubmitTag}
      />
    </div>
  );
};

export default BlogTagSection;
