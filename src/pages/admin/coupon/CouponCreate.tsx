import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Input from '../../../components/ui/input/Input';
import ActionButton from '../../../components/admin/ui/button/ActionButton';

const CouponCreate = () => {
  return (
    <main className="mx-auto mt-12 w-[36rem]">
      <header>
        <h1 className="text-2xl font-semibold">쿠폰 등록</h1>
      </header>
      <form className="mt-4">
        <div className="flex flex-col gap-4">
          <FormControl fullWidth>
            <InputLabel id="type">구분</InputLabel>
            <Select labelId="type" id="type" label="구분">
              <MenuItem value="OFFLINE">제휴</MenuItem>
              <MenuItem value="ONLINE">이벤트</MenuItem>
              <MenuItem value="ALL">등급별 할인</MenuItem>
            </Select>
          </FormControl>
          <div className="ml-4 flex items-center">
            <label htmlFor="endDate" className="w-[8rem] font-medium">
              프로그램
            </label>
            <div className="flex">
              <FormControlLabel control={<Checkbox />} label="챌린지" />
              <FormControlLabel control={<Checkbox />} label="부트캠프" />
              <FormControlLabel control={<Checkbox />} label="렛츠챗" />
            </div>
          </div>
          <Input label="쿠폰명" />
          <Input label="쿠폰 코드" />
          <div className="flex items-center gap-4">
            <Input
              type="number"
              label="쿠폰 금액"
              fullWidth={false}
              className="flex-1"
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
            <input id="dueDate" type="datetime-local" />
          </div>
          <div className="ml-4 flex items-center gap-4">
            <label htmlFor="endDate" className="w-[8rem] font-medium">
              마감 일자
            </label>
            <input id="dueDate" type="datetime-local" />
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

export default CouponCreate;
