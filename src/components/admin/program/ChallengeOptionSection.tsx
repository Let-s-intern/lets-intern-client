import {
  useDeleteChallengeOption,
  usePatchChallengeOption,
  usePostChallengeOption,
} from '@/api/challengeOption';
import { ChallengeOption } from '@/api/challengeOptionSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Heading2 from '../ui/heading/Heading2';

const inputLabelProps = {
  shrink: true,
  style: { fontSize: '14px' },
};

interface Props {
  options: ChallengeOption[];
}

function ChallengeOptionSection({ options }: Props) {
  const { snackbar } = useAdminSnackbar();

  const [editingOptions, setEditingOptions] = useState<ChallengeOption[]>(
    options ?? [],
  );

  const { mutateAsync: postChallengeOpt } = usePostChallengeOption();
  const { mutateAsync: deleteChallengeOpt } = useDeleteChallengeOption();
  const { mutateAsync: patchChallengeOpt } = usePatchChallengeOption();

  useEffect(() => {
    // 새 옵션이 추가되면 editingOptions 상태에 저장
    setEditingOptions(options);
  }, [options]);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    const { type, name, value } = e.target;
    setEditingOptions((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [name]: type === 'number' ? Number(value) : value,
          };
        }
        return item;
      }),
    );
  };

  const handleCreate = async () => {
    await postChallengeOpt({
      title: '',
      code: '',
      price: 0,
      discountPrice: 0,
      isFeedback: true,
    });
  };

  const handleDelete = async (optionId: number) => {
    await deleteChallengeOpt(optionId);
  };

  const handleSave = () => {
    Promise.all(editingOptions.map((opt) => patchChallengeOpt(opt))).then(() =>
      snackbar('✅ 옵션 저장 완료'),
    );
  };
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Heading2>옵션 설정</Heading2>
        <div className="flex gap-4">
          <Button variant="contained" onClick={handleSave}>
            옵션 저장
          </Button>
          <Button variant="outlined" onClick={handleCreate}>
            옵션 생성
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        {editingOptions.map((item, index) => {
          return (
            <div className="flex items-center gap-2" key={index}>
              <span className="w-5">{index + 1}</span>
              <OptionTextField
                name="title"
                value={item.title}
                onChange={(e) => handleChange(e, index)}
                label="옵션 제목"
                placeholder="옵션 제목을 입력하세요"
              />
              <OptionTextField
                type="number"
                name="price"
                label="옵션 가격"
                placeholder="옵션 가격을 입력하세요"
                value={item.price}
                onChange={(e) => handleChange(e, index)}
              />
              <OptionTextField
                type="number"
                value={item.discountPrice}
                onChange={(e) => handleChange(e, index)}
                name="discountPrice"
                label="옵션 할인 가격"
                placeholder="할인 가격을 입력하세요"
              />
              <OptionTextField
                name="code"
                value={item.code}
                onChange={(e) => handleChange(e, index)}
                label="옵션 코드"
                placeholder="옵션 코드를 입력하세요"
                InputLabelProps={inputLabelProps}
              />
              {/* 옵션 삭제 with trash icon */}
              <Button
                variant="text"
                onClick={() => handleDelete(item.challengeOptionId)}
                className="min-w-0"
                style={{ minWidth: 0, padding: 12 }}
                color="error"
              >
                <FaTrashCan />
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}

const OptionTextField = memo(
  function OptionTextField(props: TextFieldProps) {
    return (
      <TextField
        variant="outlined"
        size="small"
        InputLabelProps={inputLabelProps}
        {...props}
      />
    );
  },
  (oldProps, newProps) => oldProps.value === newProps.value,
);

export default ChallengeOptionSection;
