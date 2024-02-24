import FilterDropdown from '../dropdown/FilterDropdown';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
  wishJobList: any;
}

const SearchFilter = ({ filter, setFilter, wishJobList }: Props) => {
  return (
    <div className="mt-4 flex items-stretch justify-start gap-4">
      <FilterDropdown
        filter={filter}
        setFilter={setFilter}
        wishJobList={wishJobList}
      />
    </div>
  );
};

export default SearchFilter;
