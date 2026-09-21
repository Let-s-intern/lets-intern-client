import { useGetAllInOnePassDetailQuery } from '@/api/all-in-one-pass/usePassDetail';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import PassForm from '@/domain/all-in-one-pass/section/PassForm';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
import ImportExportBar from '@/domain/all-in-one-pass/ui/ImportExportBar';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

/** A-2 올인원패스 수정 */
export default function AllInOnePassEdit() {
  const { passId } = useParams();
  const numericPassId = passId ? Number(passId) : undefined;
  const navigate = useNavigate();

  const { data, isLoading, error } =
    useGetAllInOnePassDetailQuery(numericPassId);

  const [input, setInput] = useState<PassFormInput | null>(null);
  useEffect(() => {
    if (data) setInput((prev) => prev ?? data);
  }, [data]);

  const patch = (partial: Partial<PassFormInput>) =>
    setInput((prev) => (prev ? { ...prev, ...partial } : prev));

  const handleSave = () => {
    // TODO: 수정 submit 단계에서 수정 뮤테이션 연결 (API 연결 전까지 보류)
    // eslint-disable-next-line no-console
    console.log('[올인원패스 수정 입력값]', input);
  };

  return (
    <main className="flex flex-col p-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/all-in-one-pass"
          className="text-xsmall14 text-neutral-40 hover:text-neutral-0 flex w-fit items-center gap-1"
        >
          <IoArrowBack />
          올인원패스 개설
        </Link>
        <Header>
          <Heading>올인원패스 수정</Heading>
          {input && <ImportExportBar mode="export" input={input} />}
        </Header>
      </div>

      {isLoading || (!input && !error) ? (
        <LoadingContainer />
      ) : error || !input ? (
        <div className="py-4 text-center">
          존재하지 않거나 불러올 수 없는 패스입니다.
        </div>
      ) : (
        <>
          <PassForm input={input} patch={patch} />
          <div className="border-neutral-80 sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-2 border-t bg-neutral-100 px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => navigate('/all-in-one-pass')}
            >
              취소
            </Button>
            <Button variant="contained" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
