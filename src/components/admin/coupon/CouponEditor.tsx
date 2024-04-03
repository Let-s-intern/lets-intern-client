import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import {
  idTocouponProgramTypeText,
  couponTypeTextFromId,
  couponProgramTypeEnum,
  couponTypeEnum,
} from '../../../utils/convert';
import Input from '../../ui/input/Input';
import ActionButton from '../ui/button/ActionButton';

interface CouponEditorProps {
  editorMode: 'create' | 'edit';
}

interface CouponCommonValue {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
}

interface CouponInputValue extends CouponCommonValue {
  couponType: string;
  programType: string;
  discount: string;
  time: string;
}

interface CouponRequestValue extends CouponCommonValue {
  couponType: number;
  programType: number;
  discount: number;
  time: number;
}

const CouponEditor = ({ editorMode }: CouponEditorProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const [value, setValue] = useState<CouponInputValue>({
    couponType: '',
    programType: '',
    name: '',
    code: '',
    discount: '',
    time: '',
    startDate: '',
    endDate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const getCouponList = useQuery({
    queryKey: ['coupon'],
    queryFn: async () => {
      const res = await axios.get('/coupon', {
        params: {
          page: 1,
          size: 10000,
        },
      });
      return res.data;
    },
    enabled: editorMode === 'edit',
  });

  const addCoupon = useMutation({
    mutationFn: async (value: CouponRequestValue) => {
      const res = await axios.post('/coupon', value);
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      navigate('/admin/coupon');
    },
  });

  const editCoupon = useMutation({
    mutationFn: async (value: CouponRequestValue) => {
      const res = await axios.patch('/coupon', value);
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      navigate('/admin/coupon');
    },
  });

  useEffect(() => {
    if (getCouponList.isSuccess) {
      const couponList = getCouponList.data.couponList;
      const coupon =
        params.couponIndex !== undefined && couponList[params.couponIndex];
      if (coupon) {
        setValue({
          couponType:
            couponTypeEnum[
              coupon.couponType as keyof typeof couponTypeEnum
            ].id.toString(),
          programType:
            couponProgramTypeEnum[
              coupon.couponProgramType as keyof typeof couponProgramTypeEnum
            ].id.toString(),
          name: coupon.name,
          code: coupon.code,
          discount: String(coupon.discount),
          time: String(coupon.time),
          startDate: coupon.startDate,
          endDate: coupon.endDate,
        });
      }
    }
    setIsLoading(false);
  }, [getCouponList.isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  ) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue = {
      ...value,
      couponType: Number(value.couponType),
      programType: Number(value.programType),
      discount: Number(value.discount),
      time: Number(value.time),
    };
    if (editorMode === 'create') {
      addCoupon.mutate(newValue);
    } else if (editorMode === 'edit') {
      editCoupon.mutate(newValue);
    }
  };

  if (isLoading) return null;

  return (
    <main className="mx-auto mt-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">쿠폰 등록</h1>
      </header>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl fullWidth>
            <InputLabel id="couponType">구분</InputLabel>
            <Select
              labelId="couponType"
              id="couponType"
              label="구분"
              name="couponType"
              value={value.couponType}
              onChange={handleChange}
            >
              {Object.keys(couponTypeTextFromId).map((id) => (
                <MenuItem key={id} value={id}>
                  {couponTypeTextFromId[id]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="ml-4 flex items-center">
            <label htmlFor="program" className="w-[8rem] font-medium">
              프로그램
            </label>
            <RadioGroup
              row
              name="programType"
              value={value.programType}
              onChange={handleChange}
            >
              {Object.keys(idTocouponProgramTypeText).map((id) => (
                <FormControlLabel
                  key={id}
                  value={id}
                  control={<Radio />}
                  label={idTocouponProgramTypeText[id]}
                />
              ))}
            </RadioGroup>
          </div>
          <Input
            label="쿠폰명"
            name="name"
            value={value.name}
            onChange={handleChange}
          />
          <Input
            label="쿠폰 코드"
            name="code"
            value={value.code}
            onChange={handleChange}
          />
          <div className="flex items-center gap-4">
            <Input
              type="number"
              label="쿠폰 금액"
              fullWidth={false}
              className="flex-1"
              name="discount"
              value={value.discount}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="전액"
              className="w-[6rem]"
            />
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              label="사용 가능 횟수"
              fullWidth={false}
              className="flex-1"
              name="time"
              value={value.time}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="무제한"
              className="w-[6rem]"
            />
          </div>
          <div className="ml-4 flex items-center gap-4">
            <label htmlFor="startDate" className="w-[8rem] font-medium">
              시작 일자
            </label>
            <input
              id="startDate"
              type="datetime-local"
              name="startDate"
              value={value.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="ml-4 flex items-center gap-4">
            <label htmlFor="endDate" className="w-[8rem] font-medium">
              마감 일자
            </label>
            <input
              id="endDate"
              type="datetime-local"
              name="endDate"
              value={value.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <ActionButton type="submit">등록</ActionButton>
          <ActionButton to="-1" type="button" bgColor="gray">
            취소
          </ActionButton>
        </div>
      </form>
    </main>
  );
};

export default CouponEditor;
