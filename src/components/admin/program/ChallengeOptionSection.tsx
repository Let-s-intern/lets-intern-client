import { Button, TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, memo } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import Heading2 from '../ui/heading/Heading2';

const inputLabelProps = {
  shrink: true,
  style: { fontSize: '14px' },
};

interface Option {
  title: string;
  optionPrice: number;
  optionDiscountPrice: number;
  optionCode: string;
}

interface Props {
  options: Option[];
  onClickAdd: () => void;
  onClickDelete: (index: number) => void;
  onChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => void;
}

function ChallengeOptionSection({
  options,
  onClickAdd,
  onClickDelete,
  onChange,
}: Props) {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Heading2>옵션 설정</Heading2>
        <Button variant="outlined" onClick={onClickAdd}>
          옵션 추가
        </Button>
      </div>

      <div className="flex flex-col items-start gap-4">
        {options.map((item, index) => {
          return (
            <div className="flex items-center gap-2" key={index}>
              <span className="w-5">{index + 1}</span>
              <OptionTextField
                name="title"
                value={item.title}
                onChange={(e) => onChange && onChange(e, index)}
                label="옵션 제목"
                placeholder="옵션 제목을 입력하세요"
              />
              <OptionTextField
                type="number"
                name="optionPrice"
                label="옵션 가격"
                placeholder="옵션 가격을 입력하세요"
                value={item.optionPrice}
                onChange={(e) => onChange && onChange(e, index)}
              />
              <OptionTextField
                type="number"
                value={item.optionDiscountPrice}
                onChange={(e) => onChange && onChange(e, index)}
                name="optionDiscountPrice"
                label="옵션 할인 가격"
                placeholder="할인 가격을 입력하세요"
              />
              <OptionTextField
                name="optionCode"
                value={item.optionCode}
                onChange={(e) => onChange && onChange(e, index)}
                label="옵션 코드"
                placeholder="옵션 코드를 입력하세요"
                InputLabelProps={inputLabelProps}
              />
              {/* 옵션 삭제 with trash icon */}
              <Button
                variant="text"
                onClick={() => onClickDelete(index)}
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
