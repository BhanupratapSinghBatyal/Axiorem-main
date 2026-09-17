import React from 'react';
import { Layout, LayoutGrid, Users } from 'lucide-react';

const Sidebar = () => (
  <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <Layout className="w-5 h-5 text-white" />
    </div>
    <button className="p-2 hover:bg-gray-100 rounded-lg">
      <LayoutGrid className="w-5 h-5 text-gray-600" />
    </button>
    <button className="p-2 hover:bg-gray-100 rounded-lg">
      <Users className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

export default Sidebar;