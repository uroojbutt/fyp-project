// Generic search box + optional dropdown filter.
// It only displays inputs and reports changes; the page decides how to filter.
export default function SearchFilter({
  searchLabel = 'Search',
  placeholder = 'Search...',
  search,
  onSearch,
  // Optional dropdown: omit `options` and it won't render
  options,
  filterLabel = 'Filter',
  filterAllLabel = 'All',
  filter = '',
  onFilter,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{searchLabel}</label>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm py-2 outline-none border-b border-transparent
                     focus:border-blue-400 transition bg-transparent"
        />
      </div>

      {options && (
        <div className="sm:w-56">
          <label className="block text-sm font-medium text-gray-700 mb-1">{filterLabel}</label>
          <select
            value={filter}
            onChange={(e) => onFilter(e.target.value)}
            className="w-full text-sm py-2 border-b border-gray-200 outline-none bg-transparent"
          >
            <option value="">{filterAllLabel}</option>
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}