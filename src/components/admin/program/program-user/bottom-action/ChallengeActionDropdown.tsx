import { ChallengeApplication } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActionButton from '../../../ui/button/ActionButton';

interface ChallengeActionDropdownProps {
  applications: ChallengeApplication['application'][];
}

const ChallengeActionDropdown = ({
  applications,
}: ChallengeActionDropdownProps) => {
  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [downloadMailListType, setDownloadMailListType] = useState<string>('');
  const [emailAddressList, setEmailAddressList] = useState<string[] | null>();
  const [emailContent, setEmailContent] = useState<string>('');

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

  useQuery({
    queryKey: ['challenge', params.programId, 'mail-contents'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      const data = res.data;
      setEmailContent(data.data.title + '\n\n' + data.data.contents);
      return data;
    },
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

  const downloadConfirmedEmailList = () => {
    const subject = '참여 확정 공지 대상자 이메일 내용';
    const emailList = applications.map((application) => application.email);
    const emailContent = emailList.join('\n');
    downloadFile(subject + '.txt', emailContent);
  };

  const handleDownloadMailContent = () => {
    const subject = '참여 확정 공지 대상자 이메일 내용';
    downloadFile(subject + '.txt', emailContent);
    setIsMenuOpen(false);
    setEmailContent('');
  };

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
        <ul className="rounded absolute -top-2 left-1/2 w-56 -translate-x-1/2 -translate-y-full overflow-hidden border border-neutral-300 bg-white shadow-lg">
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={downloadConfirmedEmailList}
          >
            참여 확정 공지 이메일 대상자
          </li>
          <li
            className="cursor-pointer px-3 py-3 text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={handleDownloadMailContent}
          >
            참여 확정 공지 이메일 내용
          </li>
        </ul>
      )}
    </div>
  );
};

export default ChallengeActionDropdown;
