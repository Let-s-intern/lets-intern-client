import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Input from '../../components/Input';
import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import * as React from 'react';
import axios from 'axios';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import dayjs from 'dayjs';

interface ProgramEditorProps {
  mode: 'create' | 'edit';
}

const ProgramEditor = ({ mode = 'create' }: ProgramEditorProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [values, setValues] = useState<any>({
    // type: '',
    // th: 1,
    // title: '',
    // maxHeadcount: 30,
    // dueDate: '',
    // announcementDate: '2023-12-20T19:30:00',
    // startDate: '2023-12-20T19:30:00',
    // contents: '공채 부트캠프 모집합니다',
    // way: 'OFFLINE',
    // location: '강남역',
    // link: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  // form submit 이벤트 핸들러입니다.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 새로고침을 막습니다.
    e.preventDefault();
    // values에서 headcount, status, isApproved, isVisible, faqList를 제외한 나머지 데이터를 data에 담습니다.
    const { headcount, status, isApproved, isVisible, faqList, ...data } =
      values;
    console.log('send submit', data);
    // axios 수정 or 생성 요청을 보내는 부분입니다.
    axios({
      method: mode === 'edit' ? 'patch' : 'post',
      url: mode === 'edit' ? `/program/${params.id}` : `/program`,
      data,
    })
      .then((res) => {
        console.log(res);
        navigate(-1);
      })
      .catch((err) => {
        setError(err);
      });
  };

  // values가 변경될 때마다 콘솔에 출력합니다.
  // useEffect(() => {
  //   console.log('values', values);
  // }, [values]);

  // mode가 변경될 때마다 콘솔에 출력합니다.
  // useEffect(() => {
  //   console.log('mode', mode);
  //   console.log('params', params);
  // }, [mode]);

  // mode가 변경될 때마다 서버에서 데이터를 가져옵니다.
  useEffect(() => {
    setLoading(true);
    if (mode === 'edit') {
      axios({
        headers: {
          Authorization: localStorage.getItem('access-token'),
        },
        method: 'get',
        url: `/program/${params.id}`,
      })
        .then((res) => {
          console.log('res data', res.data);
          const { ...rest } = res.data;
          setValues({ ...rest, th: String(rest.th) });
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [params, mode]);

  // quill editor 옵션입니다.
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 표시할 스타일링 옵션
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // 커스텀 헤더 옵션
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // 서브스크립트/수퍼스크립트
      [{ indent: '-1' }, { indent: '+1' }], // 들여쓰기
      [{ direction: 'rtl' }], // 텍스트 방향

      [{ size: ['small', false, 'large', 'huge'] }], // 폰트 크기
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // 글자색, 배경색
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // 포맷 제거
      ['image'], // 이미지 업로드
    ],
  };

  // 로딩 중이면 로딩중을 출력합니다.
  if (loading) {
    return <div className="mx-auto max-w-xl font-notosans">로딩중</div>;
  }

  // 에러가 발생하면 에러 발생을 출력합니다.
  if (error) {
    return <div className="mx-auto max-w-xl font-notosans">에러 발생</div>;
  }

  // 폼을 출력합니다.
  return (
    <div className="mx-auto max-w-xl font-notosans">
      <header className="my-5 text-2xl font-bold">프로그램 개설</header>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="이름"
          placeholder="프로그램 이름을 입력하세요"
          value={values.title}
          autoComplete="off"
          fullWidth
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="기수"
          type="number"
          value={values.th}
          placeholder="프로그램 기수를 입력하세요"
          autoComplete="off"
          fullWidth
          onChange={(e) => setValues({ ...values, th: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="type">유형</InputLabel>
          <Select
            labelId="type"
            id="type"
            label="유형"
            value={values.type}
            onChange={(e) => {
              setValues({ ...values, type: e.target.value as string });
            }}
          >
            <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
            <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
            <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
            <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="way">방식</InputLabel>
          <Select
            labelId="way"
            id="way"
            label="방식"
            value={values.way}
            onChange={(e) => {
              setValues({ ...values, way: e.target.value as string });
            }}
          >
            <MenuItem value="OFFLINE">오프라인</MenuItem>
            <MenuItem value="ONLINE">온라인</MenuItem>
          </Select>
        </FormControl>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="Basic date time picker"
              value={dayjs(values.startDate)}
              onChange={(value) =>
                setValues({ ...values, startDate: dayjs(value) })
              }
            />
          </DemoContainer>
        </LocalizationProvider> */}
        {/* <input
          type="datetime-local"
          value={values.startDate}
          onChange={(e) => setValues({ ...values, startDate: e.target.value })}
        /> */}
        <Input
          label="시작 기한"
          value={values.startDate}
          onChange={(e) => setValues({ ...values, startDate: e.target.value })}
          placeholder="예) 2023년 9월 30일 01:30"
          autoComplete="off"
          fullWidth
        />
        <Input
          label="마감 기한"
          value={values.dueDate}
          onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
          placeholder="예) 2023년 12월 30일 12:30"
          autoComplete="off"
          fullWidth
        />
        {/* <Input
          label="장소"
          value={values.location}
          onChange={(e) => setVales({ ...values, location: e.target.value })}
          placeholder="프로그램이 진행될 장소를 입력해주세요"
          autoComplete="off"
          fullWidth
        /> */}
        <div id="editor"></div>
        <ReactQuill
          modules={modules}
          value={values.contents}
          onChange={(value: SetStateAction<string>) =>
            setValues({ ...values, contents: value })
          }
        />
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-20 rounded bg-indigo-600 py-2 text-center font-medium text-white"
          >
            등록
          </button>
          <button
            type="button"
            className="w-20 rounded bg-gray-400 py-2 text-center font-medium text-white"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;
