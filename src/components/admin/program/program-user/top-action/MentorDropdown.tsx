import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from '../../../../../utils/axios';

interface Props {
  program: any;
}

const MentorDropdown = ({ program }: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [password, setPassword] = useState('0000');

  const getMentorPassword = useQuery({
    queryKey: ['program', 'admin', params.programId, 'mentor'],
    queryFn: async () => {
      const res = await axios.get(`/program/admin/${params.programId}/mentor`);
      const data = res.data; 
      setPassword(data.mentorPassword);
      return res.data;
    },
  });

  useEffect(() => {
    if (isMenuOpen) {
      const handleClick = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [isMenuOpen]);

  const copyLink = (type: 'BEFORE' | 'AFTER') => {
    const url = `${window.location.protocol}//${window.location.hostname}:${
      window.location.port
    }/program/${program.id}/mentor/notification/${
      type === 'BEFORE' ? 'before' : 'after'
    }`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch(() => {
        alert('복사에 실패했습니다');
      });
  };

  const copyPassword = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        alert('암호가 클립보드에 복사되었습니다.');
      })
      .catch(() => {
        alert('복사에 실패했습니다');
      });
  };

  const isLoading = getMentorPassword.isLoading;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-[5rem] rounded-xxs bg-[#E4D065] py-2 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        강연자
      </button>
      {isMenuOpen && (
        <ul className="rounded absolute -bottom-2 left-1/2 z-20 w-[10rem] -translate-x-1/2 translate-y-full overflow-hidden border border-neutral-300 bg-white shadow-lg">
          <li
            className="cursor-pointer px-4 py-3 text-center text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => copyLink('BEFORE')}
          >
            세션 전 안내사항
          </li>
          <li
            className="cursor-pointer px-4 py-3 text-center text-sm font-medium duration-200 hover:bg-neutral-200"
            onClick={() => copyLink('AFTER')}
          >
            세션 후 안내사항
          </li>
          <li className="px-4 py-3 text-center text-sm font-medium">
            암호 :{' '}
            <span
              className="text-neutral-grey cursor-pointer underline"
              onClick={copyPassword}
            >
              {isLoading ? '0000' : password}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MentorDropdown;
