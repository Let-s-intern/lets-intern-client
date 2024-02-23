import FilterDropdown from '../dropdown/FilterDropdown';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
}

const SearchFilter = ({ filter, setFilter }: Props) => {
  return (
    <div className="mt-4 flex items-stretch justify-start gap-4">
      <FilterDropdown filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default SearchFilter;
