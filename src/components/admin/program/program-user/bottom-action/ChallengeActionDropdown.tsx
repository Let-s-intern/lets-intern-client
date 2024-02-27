import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import ActionButton from '../../../ui/button/ActionButton';
import axios from '../../../../../utils/axios';

const ChallengeActionDropdown = () => {
  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloadMailListType, setDownloadMailListType] = useState<string>('');
  const [downloadMailContentType, setDownloadMailContentType] =
    useState<string>('');
  const [emailAddressList, setEmailAddressList] = useState<string[] | null>();
  const [emailContent, setEmailContent] = useState<string>('');

  const confirmHeadCount = useMutation({
    mutationFn: async () => {
      const res = await axios.get(
        `/program/admin/${params.programId}/headcount`,
      );
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      alert('참여인원이 확정되었습니다.');
      setIsMenuOpen(false);
    },
    onError: () => {
      alert('참여인원 확정에 실패했습니다.');
    },
  });

  const getMailAddressList = useQuery({
    queryKey: ['program', 'admin', params.programId, 'email', 'address'],
    queryFn: async () => {
      if (!downloadMailListType) return {};
      const res = await axios.get(`/program/admin/${params.programId}/email`, {
        params: {
          mailType: downloadMailListType,
        },
      });
      const data = res.data;
      setEmailAddressList(data.emailAddressList);
      return data;
    },
    enabled: !downloadMailListType,
  });

  const getMailContent = useQuery({
    queryKey: ['program', 'admin', params.programId, 'email', 'content'],
    queryFn: async () => {
      if (!downloadMailContentType) return {};
      const res = await axios.get(`/program/admin/${params.programId}/email`, {
        params: {
          mailType: downloadMailContentType,
        },
      });
      const data = res.data;
      setEmailContent(data.emailContents);
      return data;
    },
    enabled: !downloadMailContentType,
  });

  const downloadFile = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (downloadMailListType) {
      getMailAddressList.refetch();
    }
  }, [downloadMailListType]);

  useEffect(() => {
    if (downloadMailContentType) {
      getMailContent.refetch();
    }
  }, [downloadMailContentType]);

  useEffect(() => {
    if (emailAddressList) {
      const subject =
        downloadMailListType === 'APPROVED'
          ? '선발 및 입금 안내 대상자 이메일 목록'
          : downloadMailListType === 'FEE_CONFIRMED' &&
            '참여 확정 공지 대상자 이메일 목록';
      downloadFile(subject + '.txt', emailAddressList.join('\n'));
      setIsMenuOpen(false);
      setDownloadMailListType('');
      setEmailAddressList(null);
    }
  }, [emailAddressList]);

  useEffect(() => {
    if (emailContent) {
      const subject =
        downloadMailContentType === 'APPROVED'
          ? '선발 및 입금 안내 대상자 이메일 내용'
          : downloadMailContentType === 'FEE_CONFIRMED' &&
            '참여 확정 공지 대상자 이메일 내용';
      downloadFile(subject + '.txt', emailContent);
      setIsMenuOpen(false);
      setDownloadMailContentType('');
      setEmailContent('');
    }
  }, [getMailContent]);

  return (
    <div className="relative">
      <ActionButton
        width="6rem"
        bgColor="blue"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        챌린지
      </ActionButton>
      {isMenuOpen && (
        <ul className="absolute -top-2 left-1/2 w-56 -translate-x-1/2 -translate-y-full overflow-hidden rounded border border-neutral-300 bg-white shadow-lg">
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => confirmHeadCount.mutate()}
          >
            참가인원 확정
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => setDownloadMailListType('APPROVED')}
          >
            선발 및 입금 안내 이메일 대상자
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => setDownloadMailContentType('APPROVED')}
          >
            선발 및 입금 안내 이메일 내용
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => setDownloadMailListType('FEE_CONFIRMED')}
          >
            참여 확정 공지 이메일 대상자
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => setDownloadMailContentType('FEE_CONFIRMED')}
          >
            참여 확정 공지 이메일 내용
          </li>
        </ul>
      )}
    </div>
  );
};

export default ChallengeActionDropdown;
