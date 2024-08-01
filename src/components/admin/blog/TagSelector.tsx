import { TextField } from '@mui/material';

import { TagDetail } from '../../../api/blogSchema';
import Tag from './Tag';
import TagDelete from './TagDelete';

interface TagSelectorProps {
  selectedTagList: TagDetail[];
  tagList: TagDetail[];
  value: string;
  deleteTag: (id: number) => void;
  selectTag: (tag: TagDetail) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

const TagSelector = ({
  selectedTagList,
  tagList,
  value,
  deleteTag,
  selectTag,
  onChange,
  onKeyDown,
}: TagSelectorProps) => {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {selectedTagList.map((tag) => (
          <TagDelete
            key={tag.title}
            title={tag.title}
            onClick={() => deleteTag(tag.id)}
          />
        ))}
      </div>
      <div>
        <span className="text-0.875 text-neutral-40">
          자유 태그등록하기 (중복되지 않은 태그만 등록됩니다)
        </span>
        <TextField
          type="text"
          placeholder="등록할 태그를 입력하세요"
          name="tag"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          fullWidth
        />
        <div className="mt-2 flex flex-wrap gap-4">
          {tagList.map((tag: TagDetail) => (
            <Tag
              key={tag.id}
              id={tag.id}
              title={tag.title!}
              onClick={() => selectTag(tag)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TagSelector;
