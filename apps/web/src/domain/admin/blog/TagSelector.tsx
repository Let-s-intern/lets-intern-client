import { TextField } from '@mui/material';
import { ChangeEventHandler, FormEventHandler } from 'react';

import { TagDetail } from '../../../api/blog/blogSchema';
import Tag from './Tag';
import TagDelete from './TagDelete';

interface TagSelectorProps {
  selectedTagList: TagDetail[];
  tagList: TagDetail[];
  value: string;
  deleteSelectedTag: (id: number) => void;
  deleteTag: (id: number) => void;
  selectTag: (tag: TagDetail) => void;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const TagSelector = ({
  selectedTagList,
  tagList,
  value,
  deleteSelectedTag,
  deleteTag,
  selectTag,
  onChange,
  onSubmit,
}: TagSelectorProps) => {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {selectedTagList.map((tag) => (
          <TagDelete
            key={tag.title}
            title={tag.title}
            onClick={() => deleteSelectedTag(tag.id)}
          />
        ))}
      </div>
      <div>
        <span className="text-0.875 text-neutral-40">
          자유 태그등록하기 (중복되지 않은 태그만 등록됩니다)
        </span>
        <form onSubmit={onSubmit}>
          <TextField
            type="text"
            placeholder="# 없이 입력 후 엔터"
            name="tag"
            value={value}
            onChange={onChange}
            fullWidth
          />
        </form>
        <div className="mt-2 flex flex-wrap gap-4">
          {tagList.map((tag: TagDetail) => (
            <Tag
              key={tag.id}
              id={tag.id}
              title={tag.title!}
              onClick={() => selectTag(tag)}
              onDelete={() => deleteTag(tag.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TagSelector;
