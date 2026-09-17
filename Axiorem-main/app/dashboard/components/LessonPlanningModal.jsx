import React from 'react';

const LessonPlanningModal = ({
  isOpen,
  onClose,
  numLectures,
  setNumLectures,
  lectureDuration,
  setLectureDuration,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Set Lesson Plan Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Number of Lectures</label>
          <input
            type="number"
            min="1"
            value={numLectures}
            onChange={(e) => setNumLectures(Math.max(1, parseInt(e.target.value)))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Duration per Lecture (minutes)</label>
          <input
            type="number"
            min="1"
            value={lectureDuration}
            onChange={(e) => setLectureDuration(Math.max(1, parseInt(e.target.value)))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanningModal;