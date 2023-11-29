import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';

import axios from '../../../libs/axios';
import ProgramEditor from '../../../components/ProgramEditor';

const ProgramCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [values, setValues] = useState<any>({});
  const [content, setContent] = useState<any>('');
  const [faqList, setFaqList] = useState<any>([]);
  const [faqIdList, setFaqIdList] = useState<any>([]);

  useEffect(() => {
    if (!values.type) return;
    const fetchFaqList = async () => {
      try {
        const res = await axios.get(`/faq/${values.type}`);
        setFaqList(res.data.faqList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqList();
  }, [values.type]);

  const handleFAQChange = (e: any, faqId: number) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFaqList(
      faqList.map((faq: any) => {
        if (faq.id === faqId) {
          return {
            ...faq,
            [name]: value,
          };
        }
        return faq;
      }),
    );
  };

  const handleFAQAdd = async () => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      const res = await axios.post(`/faq/${values.type}`, {
        question: '',
        answer: '',
      });
      setFaqList([...faqList, res.data]);
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQDelete = async (faqId: number) => {
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    try {
      await axios.delete(`/faq/${faqId}`);
      setFaqList(faqList.filter((faq: any) => faq.id !== faqId));
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    } catch (err) {
      setError(err);
    }
  };

  const handleFAQCheckChange = (e: any, faqId: number) => {
    if (e.target.checked) {
      setFaqIdList([...faqIdList, faqId]);
    } else {
      setFaqIdList(faqIdList.filter((id: number) => id !== faqId));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.type) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }
    setValues({
      ...values,
      contents: content,
      th: Number(values.th),
      headcount: Number(values.headcount),
      faqIdList: faqIdList.sort(),
    });
    try {
      await axios.post('/program', values);
      for (let faq of faqList) {
        await axios.patch(`/faq/${faq.id}`, {
          programType: values.type,
          question: faq.question,
          answer: faq.answer,
        });
      }
      navigate('/admin/programs');
    } catch (err) {
      alert('프로그램 생성에 실패했습니다.');
    }
  };

  const handleFAQIdListReset = () => {
    setFaqIdList([]);
  };

  if (loading) {
    return <div className="mx-auto max-w-xl font-notosans">로딩중</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-xl font-notosans">에러 발생</div>;
  }

  return (
    <ProgramEditor
      values={values}
      content={content}
      faqList={faqList}
      faqIdList={faqIdList}
      setValues={setValues}
      setContent={setContent}
      handleSubmit={handleSubmit}
      handleFAQAdd={handleFAQAdd}
      handleFAQDelete={handleFAQDelete}
      handleFAQChange={handleFAQChange}
      handleFAQCheckChange={handleFAQCheckChange}
      handleFAQIdListReset={handleFAQIdListReset}
    />
  );
};

export default ProgramCreate;
