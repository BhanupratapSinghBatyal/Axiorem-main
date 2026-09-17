import { useMemo } from 'react';

const workspacesData = [
  {
    id: '1',
    name: 'Grade 5 Science',
    creator: 'Sarah Johnson',
    createdAt: '2024-02-15',
    projects: [
      {
        id: '1',
        name: 'Biology Fundamentals',
        type: 'lesson',
        owner: 'Sarah Johnson',
        lastModified: '2024-03-10 14:30',
      },
      {
        id: '2',
        name: 'Chemistry Basics Assessment',
        type: 'assessment',
        owner: 'Sarah Johnson',
        lastModified: '2024-03-09 11:20',
      },
    ],
  },
  {
    id: '2',
    name: 'Grade 6 Math',
    creator: 'Michael Chen',
    createdAt: '2024-03-01',
    projects: [
      {
        id: '3',
        name: 'Algebra Introduction',
        type: 'lesson',
        owner: 'Sarah Johnson',
        lastModified: '2024-03-08 09:15',
      },
    ],
  },
];

const useWorkspace = (selectedWorkspace) => {
  const workspaces = useMemo(() => workspacesData, []);
  const currentWorkspace = useMemo(
    () => workspaces.find((w) => w.id === selectedWorkspace),
    [workspaces, selectedWorkspace]
  );

  return { workspaces, currentWorkspace };
};

export default useWorkspace;