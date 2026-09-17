import React from 'react';
import { Plus } from 'lucide-react';

const WorkspaceGrid = ({ workspaces, onSelect }) => (
  <div className="grid grid-cols-3 gap-6">
    {workspaces.map((workspace) => (
      <button
        key={workspace.id}
        onClick={() => onSelect(workspace.id)}
        className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors text-left"
      >
        <h3 className="text-lg font-medium text-gray-800">{workspace.name}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-500">{workspace.projects.length} projects</p>
          <p className="text-sm text-gray-500">Created by {workspace.creator}</p>
          <p className="text-sm text-gray-500">Created on {workspace.createdAt}</p>
        </div>
      </button>
    ))}
    <button className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center">
      <Plus className="w-6 h-6 text-gray-400" />
      <span className="ml-2 text-gray-600">New Workspace</span>
    </button>
  </div>
);

export default WorkspaceGrid;