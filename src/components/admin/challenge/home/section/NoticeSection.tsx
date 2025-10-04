'use client';

import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { twMerge } from '@/lib/twMerge';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { useAdminCurrentChallenge } from '../../../../../context/CurrentAdminChallengeProvider';
import {
  challengeNotices,
  CreateChallengeNoticeReq,
  UpdateChallengeNoticeReq,
} from '../../../../../schema';
import axios from '../../../../../utils/axios';
import RoundedBox from '../box/RoundedBox';
import SectionHeading from '../heading/SectionHeading';

const NoticeSection = ({ className }: { className?: string }) => {
  const { currentChallenge } = useAdminCurrentChallenge();
  const { snackbar: setSnackbar } = useAdminSnackbar();
  const [modalStatus, setModalStatus] = useState<
    | {
        open: boolean;
        mode: 'create';
      }
    | {
        open: boolean;
        mode: 'edit';
        noticeId: number;
      }
  >({
    open: false,
    mode: 'create',
  });

  const [pageNum, setPageNum] = useState<number>(1);
  const [editingNotice, setCreatingNotice] = useState<CreateChallengeNoticeReq>(
    {
      title: '',
      link: '',
      type: 'ESSENTIAL',
    },
  );

  const { data, refetch } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: [
      'challenge',
      currentChallenge?.id,
      'notices',
      { page: pageNum, size: 5 },
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${currentChallenge?.id}/notices`,
        { params: { page: pageNum, size: 5 } },
      );
      return challengeNotices.parse(res.data.data);
    },
  });

  const notices = data?.challengeNoticeList ?? [];

  const pageInfo = data?.pageInfo;

  const createNoticeMutation = useMutation({
    mutationFn: (values: CreateChallengeNoticeReq) => {
      return axios.post(`/challenge-notice/${currentChallenge?.id}`, values);
    },
    onSuccess: () => {
      setCreatingNotice({
        title: '',
        link: '',
        type: 'ESSENTIAL',
      });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: (values: UpdateChallengeNoticeReq & { noticeId: number }) => {
      const { noticeId, ...payload } = values;
      return axios.patch(`/challenge-notice/${noticeId}`, payload);
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: (noticeId: number) => {
      return axios.delete(`/challenge-notice/${noticeId}`);
    },
  });

  return (
    <>
      <RoundedBox
        as="section"
        className={twMerge(
          'flex flex-col justify-between px-8 py-6',
          className,
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionHeading>공지사항</SectionHeading>
            <Button
              onClick={() =>
                setModalStatus({
                  mode: 'create',
                  open: true,
                })
              }
            >
              새 공지 등록
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {notices.map((notice) => (
              <li key={notice.id} className="flex items-center">
                <Link href={notice.link ?? ''} className="flex-1">
                  {notice.title}
                </Link>
                <IconButton
                  onClick={() => {
                    setCreatingNotice({
                      link: notice.link ?? '',
                      title: notice.title ?? '',
                      type: notice.type ?? 'ESSENTIAL', // unused
                    });
                    setModalStatus({
                      mode: 'edit',
                      open: true,
                      noticeId: notice.id,
                    });
                  }}
                  sx={{ width: 32, height: 32 }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  sx={{ width: 32, height: 32 }}
                  color="error"
                  onClick={async () => {
                    await deleteNoticeMutation.mutateAsync(notice.id);
                    setSnackbar('공지사항이 성공적으로 삭제되었습니다.');
                    refetch();
                  }}
                >
                  <FaTrashCan />
                </IconButton>
                <span>
                  {notice.createDate?.format('YYYY-MM-DD') ?? '날짜 없음'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <div className="mt-10 flex items-center gap-3 justify-self-center rounded-full border px-3 py-1 text-sm">
            {pageInfo &&
              Array.from(
                { length: pageInfo.totalPages },
                (_, index) => index + 1,
              ).map((pageNum) => (
                <span
                  key={pageNum}
                  className={clsx('cursor-pointer', {
                    'font-medium': pageNum === pageInfo.pageNum,
                  })}
                  onClick={() => {
                    setPageNum(pageNum);
                  }}
                >
                  {pageNum}
                </span>
              ))}
          </div>
        </div>
      </RoundedBox>

      <Dialog
        open={modalStatus.open}
        onClose={() => {
          setModalStatus({ ...modalStatus, open: false });
          setCreatingNotice({
            title: '',
            link: '',
            type: 'ESSENTIAL',
          });
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {modalStatus.mode === 'create' ? '공지사항 등록' : '공지사항 수정'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalStatus.mode === 'create'
              ? '새로운 공지사항을 등록합니다.'
              : '공지사항을 수정합니다.'}
          </DialogContentText>
          <div className="mt-10">
            <label htmlFor="notice-title">제목</label>
            <input
              type="text"
              id="notice"
              className="rounded mb-4 w-full border px-3 py-1"
              placeholder="제목"
              value={editingNotice.title}
              onChange={(e) =>
                setCreatingNotice((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              autoComplete="off"
            />
            <label htmlFor="notice-link">링크</label>
            <input
              type="text"
              id="notice-link"
              className="rounded mb-4 w-full border px-3 py-1"
              placeholder="링크"
              value={editingNotice.link}
              onChange={(e) =>
                setCreatingNotice((prev) => ({
                  ...prev,
                  link: e.target.value,
                }))
              }
              autoComplete="off"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalStatus((prev) => ({ ...prev, open: false }));
              setCreatingNotice({
                title: '',
                link: '',
                type: 'ESSENTIAL',
              });
            }}
            color="inherit"
          >
            취소
          </Button>
          <Button
            onClick={async () => {
              if (modalStatus.mode === 'create') {
                await createNoticeMutation.mutateAsync(editingNotice);
                setSnackbar('공지사항이 성공적으로 등록되었습니다.');
              } else if (modalStatus.mode === 'edit') {
                await updateNoticeMutation.mutateAsync({
                  ...editingNotice,
                  noticeId: modalStatus.noticeId,
                });
                setSnackbar('공지사항이 성공적으로 수정되었습니다.');
              }
              refetch();
              setModalStatus((prev) => ({ ...prev, open: false }));
              setCreatingNotice({
                title: '',
                link: '',
                type: 'ESSENTIAL',
              });
            }}
            autoFocus
          >
            {modalStatus.mode === 'create' ? '등록' : '수정'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoticeSection;
