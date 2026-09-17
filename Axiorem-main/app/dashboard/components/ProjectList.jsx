import React from 'react';
import { FileText, Database, Layout, MoreHorizontal, Plus } from 'lucide-react';

const ProjectList = ({ projects, onNewProject }) => (
  <div className="space-y-4">
    {projects.map((project) => (
      <div
        key={project.id}
        className="bg-white p-4 rounded-lg border border-gray-200 flex items-center"
      >
        <div className="p-2 bg-blue-50 rounded-lg">
          {project.type === 'lesson' ? (
            <FileText className="w-6 h-6 text-blue-600" />
          ) : project.type === 'assignment' ? (
            <Database className="w-6 h-6 text-blue-600" />
          ) : (
            <Layout className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
          <p className="text-sm text-gray-500">Last modified: {project.lastModified}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{project.owner}</span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    ))}
    <button
      onClick={onNewProject}
      className="w-full bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center"
    >
      <Plus className="w-6 h-6 text-gray-400" />
      <span className="ml-2 text-gray-600">New Project</span>
    </button>
  </div>
);

export default ProjectList;