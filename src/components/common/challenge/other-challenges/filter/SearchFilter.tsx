import { IoMdArrowDropdown } from 'react-icons/io';

const SearchFilter = () => {
  return (
    <div>
      <div>
        <span>직무</span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      <ul>
        <li>프론트엔드</li>
        <li>백엔드</li>
      </ul>
      <button>구경하기</button>
    </div>
  );
};

export default SearchFilter;
