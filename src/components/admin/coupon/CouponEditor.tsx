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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from '../../../utils/axios';
import {
  couponTypeTextFromId,
  couponProgramTypeEnum,
  couponTypeEnum,
} from '../../../utils/convert';
import Input from '../../ui/input/Input';
import ActionButton from '../ui/button/ActionButton';
import { AxiosError } from 'axios';

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
  programTypeList: string[];
  discount: string;
  time: string;
}

interface CouponRequestValue extends CouponCommonValue {
  couponType: number;
  programTypeList: { programType: number }[];
  discount: number;
  time: number;
}

const CouponEditor = ({ editorMode }: CouponEditorProps) => {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAllDiscount, setIsAllDiscount] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const getCoupon = useQuery({
    queryKey: ['coupon', params.couponId],
    queryFn: async () => {
      const res = await axios.get(`/coupon/${params.couponId}`);
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupon'] });
      navigate('/admin/coupons');
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
      navigate('/admin/coupons');
    },
    onError: (error) => handleSubmitError(error),
  });

  useEffect(() => {
    if (getCoupon.isSuccess) {
      const coupon = getCoupon.data;
      setIsAllDiscount(coupon.discount === -1);
      setIsUnlimited(coupon.time === -1);
      setValue({
        couponType:
          couponTypeEnum[
            coupon.couponType as keyof typeof couponTypeEnum
          ].id.toString(),
        programTypeList: coupon.couponProgramList,
        name: coupon.name,
        code: coupon.code,
        discount: String(coupon.discount),
        time: String(coupon.time),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      });
    }
    setIsLoading(false);
    // eslint-disable-next-line
  }, [getCoupon.isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  ) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleProgramTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    programType: string,
  ) => {
    const programTypeList = value.programTypeList;
    if (programTypeList.includes(programType)) {
      setValue({
        ...value,
        programTypeList: programTypeList.filter((type) => type !== programType),
      });
    } else {
      setValue({
        ...value,
        programTypeList: [...programTypeList, programType],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue = {
      ...value,
      couponType: Number(value.couponType),
      discount: isAllDiscount ? -1 : Number(value.discount),
      time: isUnlimited ? -1 : Number(value.time),
      programTypeList: value.programTypeList.map((type) => ({
        programType:
          couponProgramTypeEnum[type as keyof typeof couponProgramTypeEnum].id,
      })),
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

  if (isLoading) return null;

  return (
    <main className="mx-auto mt-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">
          쿠폰{' '}
          {editorMode === 'create' ? (
            <>등록</>
          ) : (
            editorMode === 'edit' && <>수정</>
          )}
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
            </label>{' '}
            {Object.keys(couponProgramTypeEnum).map((key) => (
              <FormControlLabel
                key={key}
                value={key}
                control={
                  <Checkbox
                    checked={value.programTypeList.includes(key)}
                    onChange={(e) => handleProgramTypeChange(e, key)}
                  />
                }
                label={
                  couponProgramTypeEnum[
                    key as keyof typeof couponProgramTypeEnum
                  ].text
                }
              />
            ))}
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
