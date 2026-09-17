import React from 'react';
import { ChevronLeft, Search, Settings } from 'lucide-react';

const Header = ({ selectedWorkspace, setSelectedWorkspace, currentWorkspace }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {selectedWorkspace && (
          <button
            onClick={() => setSelectedWorkspace(null)}
            className="p-1 hover:bg-gray-100 rounded-lg mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">
          {currentWorkspace ? currentWorkspace.name : 'All Workspaces'}
        </h1>
        <button className="px-3 py-1.5 bg-yellow-400 text-sm font-medium rounded-md hover:bg-yellow-500">
          Update
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    <div className="flex space-x-6 mt-6">
      <button className="text-gray-800 border-b-2 border-gray-800 px-1 py-2">All</button>
      <button className="text-gray-500 px-1 py-2">Content</button>
      <button className="text-gray-500 px-1 py-2">Datasets</button>
    </div>
  </header>
);

export default Header;