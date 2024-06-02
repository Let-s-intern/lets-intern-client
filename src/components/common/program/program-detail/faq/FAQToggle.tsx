import clsx from 'clsx';
import { useState } from 'react';
import { IoTriangleSharp } from 'react-icons/io5';

const FAQToggle = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <div
        className="flex cursor-pointer items-center gap-4 border-b border-neutral-80 px-2 py-4"
        onClick={handleToggleClick}
      >
        <span
          className={clsx('text-[0.875rem] duration-300', {
            'rotate-90': !isOpen,
            'rotate-180': isOpen,
          })}
        >
          <IoTriangleSharp />
        </span>
        <span>챌린지 대시보드가 무엇인가요?</span>
      </div>
      {isOpen && (
        <div className="px-2 py-4">
          <p>
            렛츠인턴에서 제작한 웹페이지로, 챌린지 전반 사항이 진행될
            공간입니다. 매일 학습 콘텐츠와 데일리 미션을 비롯한 공지 사항을 전달
            드리며, 참여자 분들은 그에 맞춰 미션 제출을 하고 보상을 받으실 수
            있습니다.
          </p>
        </div>
      )}
    </li>
  );
};

export default FAQToggle;
