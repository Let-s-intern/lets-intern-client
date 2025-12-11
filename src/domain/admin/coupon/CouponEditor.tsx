import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import Input from '../../../common/input/Input';
import axios from '../../../utils/axios';
import { couponTypeToText, newProgramTypeToText } from '../../../utils/convert';
import ActionButton from '../ui/button/ActionButton';

interface CouponEditorProps {
  editorMode: 'create' | 'edit';
}

interface CouponInputValue {
  couponType: string;
  programTypeList: string[];
  name: string;
  code: string;
  discount: string;
  time: string;
  startDate: string;
  endDate: string;
}

interface CouponRequestValue {
  couponType: string;
  programTypeList: {
    programType: string;
  }[];
  name: string;
  code: string;
  discount: number;
  time: number;
  startDate: string;
  endDate: string;
}

const CouponEditor = ({ editorMode }: CouponEditorProps) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const [value, setValue] = useState<CouponInputValue>({
    couponType: '',
    programTypeList: [],
    name: '',
    code: '',
    discount: '',
    time: '',
    startDate: '',
    endDate: '',
  });
  const [isAllDiscount, setIsAllDiscount] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const couponId = Number(params.couponId);

  useQuery({
    queryKey: ['coupon', 'admin', couponId],
    queryFn: async () => {
      const res = await axios.get(`/coupon/admin/${couponId}`);
      const data = res.data.data.couponInfo;
      setIsAllDiscount(data.discount === -1);
      setIsUnlimited(data.time === -1);
      setValue({
        couponType: data.couponType,
        programTypeList: data.couponProgramTypeList,
        name: data.name,
        code: data.code,
        discount: data.discount === -1 ? '' : String(data.discount),
        time: data.time === -1 ? '' : String(data.time),
        startDate: data.startDate,
        endDate: data.endDate,
      });
      return res.data;
    },
    enabled: editorMode === 'edit',
  });

  const addCoupon = useMutation({
    mutationFn: async (value: CouponRequestValue) => {
      const res = await axios.post('/coupon', value);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupon'] });
      router.push('/admin/coupons');
    },
    onError: (error) => handleSubmitError(error),
  });

  const editCoupon = useMutation({
    mutationFn: async (value: CouponRequestValue) => {
      const res = await axios.patch(`/coupon/${params.couponId}`, value);
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupon'] });
      router.push('/admin/coupons');
    },
    onError: (error) => handleSubmitError(error),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  ) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleProgramTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    programType: string,
  ) => {
    if (e.target.checked) {
      setValue({
        ...value,
        programTypeList: [...value.programTypeList, programType],
      });
    } else {
      setValue({
        ...value,
        programTypeList: value.programTypeList.filter(
          (type) => type !== programType,
        ),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue: CouponRequestValue = {
      couponType: value.couponType,
      programTypeList: value.programTypeList.map((type) => ({
        programType: type,
      })),
      name: value.name,
      code: value.code,
      discount: isAllDiscount ? -1 : Number(value.discount),
      time: isUnlimited ? -1 : Number(value.time),
      startDate: value.startDate,
      endDate: value.endDate,
    };

    if (editorMode === 'create') {
      addCoupon.mutate(newValue);
    } else if (editorMode === 'edit') {
      editCoupon.mutate(newValue);
    }
  };

  const handleSubmitError = (error: Error) => {
    const errorData = (error as AxiosError).response?.data;
    const errorCode = (errorData as { code: string }).code;
    if (errorCode === 'COUPON_400_2') {
      alert('이미 사용 중인 쿠폰 코드입니다.');
    } else if (errorCode === 'COUPON_400_3') {
      alert('쿠폰 코드는 영문 대문자와 숫자로만 구성되어야 합니다.');
    }
  };

  return (
    <main className="mx-auto mt-12 w-[48rem]">
      <header>
        <h1 className="text-2xl font-semibold">
          {editorMode === 'create' ? '쿠폰 등록' : '쿠폰 수정'}
        </h1>
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
              {Object.keys(couponTypeToText).map((type) => (
                <MenuItem key={type} value={type}>
                  {couponTypeToText[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="ml-4 flex items-center">
            <label htmlFor="program" className="w-[8rem] font-medium">
              프로그램
            </label>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.programTypeList.includes('ALL')}
                  onChange={(e) => handleProgramTypeChange(e, 'ALL')}
                />
              }
              label="전체"
            />
            {Object.keys(newProgramTypeToText).map((programType) => (
              <FormControlLabel
                key={programType}
                value={programType}
                control={
                  <Checkbox
                    checked={value.programTypeList.includes(programType)}
                    onChange={(e) => handleProgramTypeChange(e, programType)}
                  />
                }
                label={newProgramTypeToText[programType]}
              />
            ))}
          </div>
          {/* <div className="ml-4 flex items-center">
            <label className="w-[8rem] font-medium">프로그램 분류</label>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.programTypeList.includes('ALL')}
                  onChange={(e) => handleProgramTypeChange(e, 'ALL')}
                />
              }
              label="전체"
            />
            {Object.keys(newProgramTypeDetailToText).map((programType) => (
              <FormControlLabel
                key={programType}
                value={programType}
                control={
                  <Checkbox
                    checked={value.programTypeList.includes(programType)}
                    onChange={(e) => handleProgramTypeChange(e, programType)}
                  />
                }
                label={newProgramTypeDetailToText[programType]}
              />
            ))}
          </div>
          <div className="ml-4 flex items-center">
            <label className="w-[8rem] font-medium">id</label>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.programTypeList.includes('ALL')}
                  onChange={(e) => handleProgramTypeChange(e, 'ALL')}
                />
              }
              label="전체"
            />
            <Input
              label="id"
              name="id"
              value={''}
              fullWidth={false}
              className="flex-1"
              // onChange={handleChange}
            />
          </div> */}
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
          <div className="flex items-center">
            <FormControlLabel
              control={<Checkbox />}
              label="전액"
              checked={isAllDiscount}
              onChange={() => setIsAllDiscount(!isAllDiscount)}
              className="h-[3.5rem] w-[8rem] pl-4"
            />
            {!isAllDiscount && (
              <Input
                type="number"
                label="쿠폰 금액"
                fullWidth={false}
                className="flex-1"
                name="discount"
                value={value.discount === '-1' ? '' : value.discount}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="flex items-center">
            <FormControlLabel
              control={<Checkbox />}
              label="무제한"
              checked={isUnlimited}
              onChange={() => setIsUnlimited(!isUnlimited)}
              className="h-[3.5rem] w-[8rem] pl-4"
            />
            {!isUnlimited && (
              <Input
                type="number"
                label="사용 가능 횟수"
                fullWidth={false}
                className="flex-1"
                name="time"
                value={value.time === '-1' ? '' : value.time}
                onChange={handleChange}
              />
            )}
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
          <ActionButton type="submit">
            {editorMode === 'create' ? (
              <>등록</>
            ) : (
              editorMode === 'edit' && <>확인</>
            )}
          </ActionButton>
          <ActionButton to="-1" type="button" bgColor="gray">
            취소
          </ActionButton>
        </div>
      </form>
    </main>
  );
};

export default CouponEditor;
