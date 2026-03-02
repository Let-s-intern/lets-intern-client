import { FormQuestionItem } from '@/domain/admin/blog/magnet/types';
import { generateUUID } from '@/utils/random';
import { Button, Chip, IconButton, TextField } from '@mui/material';
import { Plus, X } from 'lucide-react';

function createEmptyItem(): FormQuestionItem {
  return { itemId: generateUUID(), value: '', isOther: false };
}

function createOtherItem(): FormQuestionItem {
  return {
    itemId: generateUUID(),
    value: '기타(직접입력)',
    isOther: true,
  };
}

interface QuestionItemListProps {
  items: FormQuestionItem[];
  onUpdateItems: (items: FormQuestionItem[]) => void;
}

const QuestionItemList = ({
  items,
  onUpdateItems,
}: QuestionItemListProps) => {
  const hasOtherItem = items.some((item) => item.isOther);

  const handleAddItem = () => {
    onUpdateItems([...items, createEmptyItem()]);
  };

  const handleAddOtherItem = () => {
    if (hasOtherItem) return;
    onUpdateItems([...items, createOtherItem()]);
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdateItems(items.filter((item) => item.itemId !== itemId));
  };

  const handleUpdateItemValue = (itemId: string, value: string) => {
    onUpdateItems(
      items.map((item) =>
        item.itemId === itemId ? { ...item, value } : item,
      ),
    );
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">항목</label>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={item.itemId}
            className="flex items-center gap-2"
          >
            <span className="w-6 shrink-0 text-sm text-neutral-500">
              {index + 1}.
            </span>
            {item.isOther ? (
              <div className="flex min-h-[40px] flex-1 items-center gap-2 rounded border border-neutral-300 px-3">
                <span className="text-sm text-neutral-500">
                  기타(직접입력)
                </span>
                <Chip
                  label="직접입력"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </div>
            ) : (
              <TextField
                size="small"
                fullWidth
                value={item.value}
                placeholder={`항목 ${index + 1}`}
                onChange={(e) =>
                  handleUpdateItemValue(item.itemId, e.target.value)
                }
              />
            )}
            <IconButton
              size="small"
              onClick={() => handleRemoveItem(item.itemId)}
            >
              <X size={16} />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          variant="text"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={handleAddItem}
        >
          항목 추가
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={handleAddOtherItem}
          disabled={hasOtherItem}
        >
          기타(직접입력)
        </Button>
      </div>
    </div>
  );
};

export default QuestionItemList;
