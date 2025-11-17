import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

export type SortOption = 'created_desc' | 'created_asc' | 'target_date_asc' | 'target_date_desc' | 'progress_desc' | 'progress_asc';

interface GoalFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
}

export function GoalFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showArchived,
  onShowArchivedChange,
}: GoalFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="target_date_asc">Deadline (Soonest)</option>
            <option value="target_date_desc">Deadline (Latest)</option>
            <option value="progress_desc">Most Progress</option>
            <option value="progress_asc">Least Progress</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => onShowArchivedChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show archived</span>
        </label>
      </div>
    </div>
  );
}
