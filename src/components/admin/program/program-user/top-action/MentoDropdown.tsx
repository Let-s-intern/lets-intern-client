import { useEffect, useRef, useState } from 'react';

interface Props {
  program: any;
}

const MentoDropdown = ({ program }: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    }/program/${program.id}/mento/notification/${
      type === 'BEFORE' ? 'before' : 'after'
    }`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
        setIsMenuOpen(false);
      })
      .catch(() => {
        alert('복사에 실패했습니다');
      });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-[5rem] rounded bg-[#E4D065] py-2 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        강연자
      </button>
      {isMenuOpen && (
        <ul className="absolute -bottom-2 left-1/2 z-20 w-[10rem] -translate-x-1/2 translate-y-full overflow-hidden rounded border border-neutral-300 bg-white shadow-lg">
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
            암호 : 0000
          </li>
        </ul>
      )}
    </div>
  );
};

export default MentoDropdown;
