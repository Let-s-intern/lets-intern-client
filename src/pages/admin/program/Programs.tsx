import {
  useDeleteProgramMutation,
  useGetProgramAdminQuery,
  useGetProgramAdminQueryKey,
  usePatchVisibleProgramMutation,
} from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { ProgramAdminListItem } from '@/schema';
import TD from '@components/admin/ui/table/regacy/TD';
import TH from '@components/admin/ui/table/regacy/TH';
import { Button, Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaCopy, FaList, FaPencil, FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../../../components/admin/ui/button/ActionButton';
import Header from '../../../components/admin/ui/header/Header';
import Heading from '../../../components/admin/ui/heading/Heading';
import AdminPagination from '../../../components/admin/ui/pagination/AdminPagination';
import Table from '../../../components/admin/ui/table/regacy/Table';
import {
  newProgramTypeToText,
  programClassificationToText,
  programStatusToText,
} from '../../../utils/convert';

const Programs = () => {
  const [pageNum, setPageNum] = useState<number>(1);

  const sizePerPage = 10;

  const { data, isLoading, error } = useGetProgramAdminQuery({
    pageable: { page: pageNum, size: sizePerPage },
  });

  const programList = data?.programList || [];
  const maxPage = data?.pageInfo?.totalPages || 1;

  return (
    <div className="p-8">
      <Header>
        <Heading>프로그램 관리</Heading>
        <ActionButton to="/admin/programs/create" bgColor="blue">
          등록
        </ActionButton>
      </Header>
      <main>
        {isLoading ? (
          <div className="py-4 text-center">로딩 중...</div>
        ) : error ? (
          <div className="py-4 text-center">에러 발생</div>
        ) : programList.length === 0 ? (
          <div className="py-4 text-center">프로그램이 없습니다.</div>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <TH>프로그램</TH>
                  <TH>프로그램 분류</TH>
                  <TH>프로그램 제목</TH>
                  <TH>모집상태</TH>
                  <TH>신청인원</TH>
                  <TH>모집기간</TH>
                  <TH>프로그램 시작일자</TH>
                  <TH>프로그램 관리</TH>
                  <TH>노출여부</TH>
                  <TH>ZOOM LINK</TH>
                  <TH>ZOOM PW</TH>
                </tr>
              </thead>
              <tbody>
                {programList.map((program) => (
                  <Row key={program.programInfo.id} program={program} />
                ))}
              </tbody>
            </Table>
            {programList.length > 0 && (
              <div className="mt-4">
                <AdminPagination
                  maxPage={maxPage}
                  pageNum={pageNum}
                  setPageNum={setPageNum}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const Row = ({ program }: { program: ProgramAdminListItem }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const deleteProgram = useDeleteProgramMutation({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey: [useGetProgramAdminQueryKey] });
    },
  });
  const editVisible = usePatchVisibleProgramMutation({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey: [useGetProgramAdminQueryKey] });
    },
  });
  const [visibleLoading, setVisibleLoading] = useState(false);

  return (
    <tr key={`${program.programInfo.programType}${program.programInfo.id}`}>
      <TD>
        <span className="flex justify-center">
          {program.classificationList
            .map((type) =>
              type.programClassification
                ? programClassificationToText[type.programClassification]
                : '',
            )
            .join(', ')}
        </span>
      </TD>
      <TD>{newProgramTypeToText[program.programInfo.programType]}</TD>
      <TD>{program.programInfo.title}</TD>
      <TD>{programStatusToText[program.programInfo.programStatusType]}</TD>
      <TD>
        {program.programInfo.programType === 'VOD' ? (
          '온라인'
        ) : (
          <>
            {program.programInfo.currentCount} /{' '}
            {program.programInfo.participationCount}
          </>
        )}
      </TD>
      <TD>
        {program.programInfo.programType === 'VOD'
          ? '온라인'
          : dayjs(program.programInfo.deadline).format(`M/D(dd) HH:mm까지`)}
      </TD>
      <TD>
        {program.programInfo.programType === 'VOD'
          ? '온라인'
          : dayjs(program.programInfo.startDate).format(
              `YYYY/M/D(dd) HH:mm까지`,
            )}
      </TD>
      <TD>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaPencil size={12} />}
            // endIcon={<FaArrowRight size={10} />}
            onClick={() => {
              navigate(
                `/admin/programs/${program.programInfo.id}/edit?programType=${program.programInfo.programType}`,
              );
            }}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="small"
            startIcon={<FaList size={12} />}
            onClick={() => {
              navigate(
                `/admin/programs/${program.programInfo.id}/users?programType=${program.programInfo.programType}`,
              );
            }}
          >
            참여자
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<FaCopy size={12} />}
            onClick={() => {
              snackbar('준비중입니다.');
            }}
            size="small"
          >
            복제
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<FaTrashCan size={12} />}
            onClick={async () => {
              if (window.confirm('정말로 삭제하시겠습니까?')) {
                await deleteProgram({
                  type: program.programInfo.programType,
                  id: program.programInfo.id,
                });
                snackbar('삭제되었습니다.');
              }
            }}
          >
            삭제
          </Button>
        </div>
      </TD>
      <TD>
        <Switch
          checked={program.programInfo.isVisible ?? false}
          disabled={visibleLoading}
          onChange={async (e) => {
            const checked = e.target.checked;
            setVisibleLoading(true);
            await editVisible({
              id: program.programInfo.id,
              type: program.programInfo.programType,
              isVisible: checked,
            });
            snackbar(
              `<${program.programInfo.title}> 노출여부가 "${checked ? '노출' : '비노출'}"로 변경되었습니다.`,
            );
            setVisibleLoading(false);
          }}
        />
      </TD>
      <TD>
        <Button
          className="rounded-xxs border border-gray-300 bg-white px-2 py-1"
          onClick={async () => {
            if (!program.programInfo.zoomLink) {
              snackbar('링크가 없습니다.');
              return;
            }
            await navigator.clipboard.writeText(program.programInfo.zoomLink);
            snackbar('링크가 클립보드에 복사되었습니다.');
          }}
        >
          {program.programInfo.zoomLink ? '복사' : '없음'}
        </Button>
      </TD>
      <TD>{program.programInfo.zoomPassword || '없음'}</TD>
    </tr>
  );
};

export default Programs;
