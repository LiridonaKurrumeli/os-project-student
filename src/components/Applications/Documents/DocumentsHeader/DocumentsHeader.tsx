import { useState } from "react";
import { Icon } from "@components/shared/Icon/Icon";
import { Input } from "@components/shared/Input/Input";
import { useDocumentsContext } from "@context/DocumentsContext/DocumentsContext";

export const DocumentsHeader = () => {
  const { selectedId, onPrevious } = useDocumentsContext();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "type" | "date">("name");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (selectedId) {
                onPrevious(selectedId);
              }
            }}
            disabled={selectedId === null}
            className={`p-2 rounded-lg transition-colors ${
              selectedId !== null
                ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                : "opacity-50 cursor-not-allowed text-gray-400"
            }`}
            title="Go Back"
          >
            <Icon icon="arrow-left" className="w-4 h-4" />
          </button>
          <button
            disabled={true}
            className="p-2 rounded-lg opacity-50 cursor-not-allowed text-gray-400"
            title="Go Forward"
          >
            <Icon icon="arrow-right" className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Icon
              icon="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer text-sm"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>
    </div>
  );
};
