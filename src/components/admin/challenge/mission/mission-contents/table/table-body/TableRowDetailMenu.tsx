import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { contentsTypeToText } from '../../../../../../../utils/convert';
import Button from '../../../../ui/button/Button';
import axios from '../../../../../../../utils/axios';
import { Link } from 'react-router-dom';

interface Props {
  contents: any;
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowDetailMenu = ({ contents, setMenuShown }: Props) => {
  return (
    <div className="rounded bg-neutral-100 px-4 py-8">
      <div className="mx-auto w-[40rem]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-12">
            <div className="flex items-center">
              <div className="w-24 font-medium">구분</div>
              <span className="w-12">{contentsTypeToText[contents.type]}</span>
            </div>
            <div className="flex items-center">
              <div className="w-20 font-medium">생성일</div>
              <span className="w-48">{contents.createdAt}</span>
            </div>
          </div>
          <div className="flex">
            <div className="w-24 font-medium">콘텐츠명</div>
            <p>{contents.title}</p>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">링크</div>
            <Link
              to={contents.link}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:underline"
              target="_blank"
              rel="noopenner noreferrer"
            >
              {contents.link}
            </Link>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button active disableHover onClick={() => setMenuShown('EDIT')}>
            수정
          </Button>
          <Button disableHover onClick={() => setMenuShown('NONE')}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableRowDetailMenu;
