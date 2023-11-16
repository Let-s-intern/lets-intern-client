import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Input from '../../components/Input';
import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

interface ProgramEditorProps {
  mode: 'create' | 'edit';
}

const ProgramEditor = ({ mode = 'create' }: ProgramEditorProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [values, setValues] = useState<any>({
    type: '',
    th: '',
    title: '',
    dueDate: '2023-12-27',
    announcementDate: '2023-12-30',
    startDate: '2023-12-30T19:30:00',
    contents: '',
    way: '',
    link: 'https://www.google.com',
    // faqDTOList: [
    //   {
    //     question: '첫번째 질문입니까?',
    //     answer: '첫번째 대답입니다!',
    //   },
    //   {
    //     question: '두번째 질문입니까?',
    //     answer: '두번째 대답입니다!',
    //   },
    // ],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { ...values, th: Number(values.th) };
    console.log('send', data);
    axios({
      method: mode === 'edit' ? 'patch' : 'post',
      url:
        mode === 'edit'
          ? `${process.env.REACT_APP_SERVER_API}/program/${params.id}`
          : `${process.env.REACT_APP_SERVER_API}/program`,
      data,
    })
      .then((res) => {
        console.log('send', values);
        console.log(res);
        navigate(-1);
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    console.log('values', values);
  }, [values]);

  useEffect(() => {
    console.log('mode', mode);
    console.log('params', params);
  }, [mode]);

  useEffect(() => {
    setLoading(true);
    if (mode === 'edit') {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_SERVER_API}/program/${params.id}`,
        params: {
          isAdmin: true,
        },
      })
        .then((res) => {
          console.log('data', res.data);
          const { faqList, ...rest } = res.data;
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

  if (loading) {
    return <div className="mx-auto max-w-xl font-notosans">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl font-notosans">에러 발생</div>;
  }

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="Basic date time picker"
              value={dayjs(values.startDate)}
              onChange={(value) =>
                setValues({ ...values, startDate: dayjs(value) })
              }
            />
          </DemoContainer>
        </LocalizationProvider>
        {/* <input
          type="datetime-local"
          value={values.startDate}
          onChange={(e) => setValues({ ...values, startDate: e.target.value })}
        /> */}
        {/* <Input
          label="시작 기한"
          value={values.startDate}
          onChange={(e) => setValues({ ...values, startDate: e.target.value })}
          placeholder="예) 2023년 9월 30일 01:30"
          autoComplete="off"
          fullWidth
        /> */}
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
