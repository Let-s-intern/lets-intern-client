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
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { useAdminCurrentChallenge } from '../../../../../context/CurrentAdminChallengeProvider';
import {
  challengeGuides,
  CreateChallengeGuideReq,
  UpdateChallengeGuideReq,
} from '../../../../../schema';
import axios from '../../../../../utils/axios';
import RoundedBox from '../box/RoundedBox';
import SectionHeading from '../heading/SectionHeading';

const GuideSection = ({ className }: { className?: string }) => {
  const { snackbar } = useAdminSnackbar();
  const { currentChallenge } = useAdminCurrentChallenge();
  const [modalStatus, setModalStatus] = useState<
    | {
        open: boolean;
        mode: 'create';
      }
    | {
        open: boolean;
        mode: 'edit';
        guideId: number;
      }
  >({
    open: false,
    mode: 'create',
  });

  // const [pageNum, setPageNum] = useState<number>(1);
  const [editingGuide, setCreatingGuide] = useState<CreateChallengeGuideReq>({
    title: '',
    link: '',
  });

  const { data, refetch } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: [
      'challenge',
      currentChallenge?.id,
      'guides',
      // { page: pageNum, size: 5 },
    ],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/guides`, {
        // params: { page: pageNum, size: 5 },
      });
      return challengeGuides.parse(res.data.data);
    },
  });

  const guides = data?.challengeGuideList ?? [];

  const createGuideMutation = useMutation({
    mutationFn: (values: CreateChallengeGuideReq) => {
      return axios.post(`/challenge-guide/${currentChallenge?.id}`, values);
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: (values: UpdateChallengeGuideReq & { guideId: number }) => {
      const { guideId, ...payload } = values;
      return axios.patch(`/challenge-guide/${guideId}`, payload);
    },
  });

  const deleteGuideMutation = useMutation({
    mutationFn: (guideId: number) => {
      return axios.delete(`/challenge-guide/${guideId}`);
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
            <SectionHeading>챌린지 가이드</SectionHeading>
            <Button
              onClick={() =>
                setModalStatus({
                  mode: 'create',
                  open: true,
                })
              }
            >
              새 가이드 등록
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {guides.map((guide) => (
              <li key={guide.id} className="flex items-center">
                <Link href={guide.link ?? ''} className="flex-1">
                  {guide.title}
                </Link>
                <IconButton
                  onClick={() => {
                    setCreatingGuide({
                      link: guide.link ?? '',
                      title: guide.title ?? '',
                    });
                    setModalStatus({
                      mode: 'edit',
                      open: true,
                      guideId: guide.id,
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
                    await deleteGuideMutation.mutateAsync(guide.id);
                    snackbar('가이드가 성공적으로 삭제되었습니다.');
                    refetch();
                  }}
                >
                  <FaTrashCan />
                </IconButton>
                <span>
                  {guide.createDate?.format('YYYY-MM-DD') ?? '날짜 없음'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 px-3 py-1 mt-10 text-sm border rounded-full justify-self-center">
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
        </div> */}
      </RoundedBox>

      <Dialog
        open={modalStatus.open}
        onClose={() => {
          setModalStatus({ ...modalStatus, open: false });
          setCreatingGuide({
            title: '',
            link: '',
          });
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {modalStatus.mode === 'create' ? '가이드 등록' : '가이드 수정'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalStatus.mode === 'create'
              ? '새로운 가이드를 등록합니다.'
              : '가이드를 수정합니다.'}
          </DialogContentText>
          <div className="mt-10">
            <label htmlFor="guide-title">제목</label>
            <input
              type="text"
              id="guide"
              className="rounded mb-4 w-full border px-3 py-1"
              placeholder="제목"
              value={editingGuide.title}
              onChange={(e) =>
                setCreatingGuide((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              autoComplete="off"
            />
            <label htmlFor="guide-link">링크</label>
            <input
              type="text"
              id="guide-link"
              className="rounded mb-4 w-full border px-3 py-1"
              placeholder="링크"
              value={editingGuide.link}
              onChange={(e) =>
                setCreatingGuide((prev) => ({
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
              setCreatingGuide({
                title: '',
                link: '',
              });
            }}
            color="inherit"
          >
            취소
          </Button>
          <Button
            onClick={async () => {
              if (modalStatus.mode === 'create') {
                await createGuideMutation.mutateAsync(editingGuide);
                snackbar('가이드가 성공적으로 등록되었습니다.');
              } else if (modalStatus.mode === 'edit') {
                await updateGuideMutation.mutateAsync({
                  ...editingGuide,
                  guideId: modalStatus.guideId,
                });
                snackbar('가이드가 성공적으로 수정되었습니다.');
              }
              refetch();
              setModalStatus((prev) => ({ ...prev, open: false }));
              setCreatingGuide({
                title: '',
                link: '',
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

export default GuideSection;
