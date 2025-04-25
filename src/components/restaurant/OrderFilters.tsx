
import React, { useState } from "react";
import { Search } from "lucide-react";

export const OrderFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      {/* Search Bar */}
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </form>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Filter */}
        <select 
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          defaultValue="today"
        >
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Sort Filter */}
        <select 
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          defaultValue="time-desc"
        >
          <option value="time-desc">Newest First</option>
          <option value="time-asc">Oldest First</option>
          <option value="amount-desc">Amount (High → Low)</option>
          <option value="amount-asc">Amount (Low → High)</option>
        </select>
      </div>
    </div>
  );
};
