import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';

const AdminReportFeedback = ({
  initialValue,
  onChange,
}: {
  initialValue: {
    price: number;
    discount: number;
  };
  onChange: (value: { price: number; discount: number }) => void;
}) => {
  const [editingValue, setEditingValue] = useState<{
    price: number;
    discount: number;
  }>({
    price: initialValue.price,
    discount: initialValue.discount,
  });

  const [selectedValue, setSelectedValue] = useState<'basic' | 'none'>(
    initialValue.price !== -1 ? 'basic' : 'none',
  );

  return (
    <div className="flex gap-4">
      <FormControl size="small" className="w-48">
        <InputLabel id="feedback-price-type-label">
          1:1 온라인 상담 설정
        </InputLabel>
        <Select<'basic' | 'none'>
          className="w-48"
          label="1:1 온라인 상담 설정"
          labelId="feedback-price-type-label"
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value as 'basic' | 'none');
            if (e.target.value === 'basic') {
              setEditingValue({
                price: 0,
                discount: 0,
              });
              onChange({
                price: 0,
                discount: 0,
              });
            } else if (e.target.value === 'none') {
              setEditingValue({
                price: -1,
                discount: 0,
              });
              onChange({
                price: -1,
                discount: 0,
              });
            }
          }}
        >
          <MenuItem value="none">없음</MenuItem>
          <MenuItem value="basic">기본</MenuItem>
        </Select>
      </FormControl>
      {selectedValue === 'basic' ? (
        <div className="flex flex-col items-start gap-2">
          <TextField
            value={editingValue.price}
            onChange={(e) => {
              setEditingValue((prev) => {
                return {
                  ...prev,
                  price: Number(e.target.value),
                };
              });
              onChange({
                price: Number(e.target.value),
                discount: editingValue.discount,
              });
            }}
            variant="outlined"
            name="feedbackPrice"
            size="small"
            label="피드백 가격"
            placeholder="가격을 입력하세요"
            InputLabelProps={{
              shrink: true,
              style: { fontSize: '14px' },
            }}
          />
          <TextField
            value={editingValue.discount}
            onChange={(e) => {
              setEditingValue((prev) => {
                return {
                  ...prev,
                  discount: Number(e.target.value),
                };
              });
              onChange({
                price: editingValue.price,
                discount: Number(e.target.value),
              });
            }}
            variant="outlined"
            name="feedbackDiscountPrice"
            size="small"
            label="피드백 할인 가격"
            placeholder="할인 가격을 입력하세요"
            InputLabelProps={{
              shrink: true,
              style: { fontSize: '14px' },
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AdminReportFeedback;
