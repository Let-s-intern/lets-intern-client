import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import useProgramMenuItems from '@/hooks/useProgramMenuItems';
import { ProgramStatusEnum } from '@/schema';
import Heading from '@components/admin/ui/heading/Heading';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

const { PREV } = ProgramStatusEnum.enum;

const NotificationEditPage = () => {
  const navigate = useNavigate();

  const { snackbar } = useAdminSnackbar();
  const programMenuItems = useProgramMenuItems([PREV], false); // 모집 예정 AND 노출된 프로그램

  return (
    <div className="p-5">
      <Heading className="mb-5">출시 알림 신청 등록</Heading>

      <div className="w-1/2 min-w-[37.5rem]">
        <div className="mb-5">
          <span className="mb-3 block text-xsmall14 text-neutral-40">
            모집 예정 AND 노출된 프로그램만 선택할 수 있습니다.
          </span>
          <FormControl required fullWidth>
            <InputLabel>프로그램 선택</InputLabel>
            <Select label="프로그램 선택">{programMenuItems}</Select>
          </FormControl>
        </div>
        <TextField
          className="w-full"
          variant="outlined"
          name="title"
          required
          label="제목"
          placeholder="제목을 입력하세요"
        />

        <div className="my-5">
          <p className="mb-3 text-xsmall14 text-neutral-40">
            * 노출 여부 체크박스를 비활성화(off) 한 경우
            <br />→ 노출 기간과 관계없이 홈 화면에 노출되지 않음
            <br />* 노출 기간이 만료된 경우
            <br />→ 노출 여부와 관계없이 홈 화면에서 비노출 처리
          </p>
          <div className="flex gap-3">
            <DateTimePicker
              className="w-full"
              label="시작 일자"
              name="startDate"
            />
            <DateTimePicker
              className="w-full"
              label="종료 일자"
              name="endDate"
            />
          </div>
        </div>

        <div className="flex w-full justify-end gap-5">
          <Button
            variant="contained"
            onClick={async () => {
              // await post.mutateAsync(reqBody);
              snackbar('등록되었습니다');
            }}
          >
            저장
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/notification/list')}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationEditPage;
