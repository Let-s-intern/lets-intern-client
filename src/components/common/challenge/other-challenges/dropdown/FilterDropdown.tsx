import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import { wishJobToText } from '../../../../../utils/convert';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  wishJobList: any;
}

const FilterDropdown = ({ filter, setFilter, wishJobList }: Props) => {
  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topic, setTopic] = useState<string>();

  const getProgramDetail = useQuery({
    queryKey: [],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}`);
      const data = res.data;
      setTopic(data.programDetailVo.topic);
      return data;
    },
  });

  const handleMenuItemClicked = (wishJob: string) => {
    setFilter(wishJob);
    setIsMenuOpen(false);
  };

  const isLoading = getProgramDetail.isLoading || !topic;

  return (
    <div className="relative">
      <div
        className="flex min-w-[8rem] cursor-pointer items-center justify-between gap-2 rounded border border-[#9D9D9D] py-2 pl-3 pr-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="text-sm font-medium">
          {isLoading ? (
            <span className="opacity-0">전체</span>
          ) : filter === 'DEVELOPMENT_ALL' || filter === 'MARKETING_ALL' ? (
            '전체'
          ) : (
            wishJobToText[filter]
          )}
        </span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuOpen && (
        <div className="absolute left-0 top-10 w-[10rem] rounded border border-[#9D9D9D] bg-white text-sm shadow-lg">
          <ul>
            {wishJobList.map((wishJob: any) => (
              <li
                key={wishJob}
                className="cursor-pointer px-3 py-2 transition-all hover:bg-neutral-200"
                onClick={() => handleMenuItemClicked(wishJob)}
              >
                {topic !== 'ALL' &&
                (wishJob === 'DEVELOPMENT_ALL' || wishJob === 'MARKETING_ALL')
                  ? '전체'
                  : wishJobToText[wishJob]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
