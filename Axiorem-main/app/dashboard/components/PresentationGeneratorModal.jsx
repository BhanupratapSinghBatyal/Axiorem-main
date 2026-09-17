import React, { useState } from "react";

const PresentationGeneratorModal = ({
  isOpen,
  onClose,
  generationType,
  setGenerationType,
  numSlides,
  setNumSlides,
  slides,
  setSlides,
  presentationInstructions,
  setPresentationInstructions,
  onSubmit,
}) => {
  const [currentSlideTitle, setCurrentSlideTitle] = useState(""); // Internal state for input

  if (!isOpen) return null;

  const handleAddSlide = () => {
    if (currentSlideTitle.trim()) {
      setSlides([...slides, { title: currentSlideTitle }]);
      setCurrentSlideTitle(""); // Reset input
    }
  };

  const handleDeleteSlide = (indexToDelete) => {
    setSlides(slides.filter((_, index) => index !== indexToDelete));
  };

  const handleSubmit = () => {
    const data = {
      generationType,
      ...(generationType === "custom" && {
        numSlides,
        slides,
        instructions: presentationInstructions,
      }),
    };
    onSubmit(data); // Pass data to parent component
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Presentation Generator</h2>

        {/* Radio Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generation Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="generationType"
                value="standard"
                checked={generationType === "standard"}
                onChange={() => setGenerationType("standard")}
                className="mr-2"
              />
              Standard
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="generationType"
                value="custom"
                checked={generationType === "custom"}
                onChange={() => setGenerationType("custom")}
                className="mr-2"
              />
              Custom
            </label>
          </div>
        </div>

        {/* Custom Generation Fields */}
        {generationType === "custom" && (
          <div className="mb-4">
            {/* Number of Slides */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Number of Slides
              </label>
              <input
                type="number"
                min="1"
                value={numSlides}
                onChange={(e) => setNumSlides(Math.max(1, parseInt(e.target.value)))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Slide Content Structure */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slide Content
              </label>
              {/* Render Existing Slides as Cards */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-md mb-2 shadow-sm flex justify-between items-center"
                >
                  <p className="text-sm font-medium">{slide.title}</p>
                  <button
                    onClick={() => handleDeleteSlide(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Slide"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Input for New Slide */}
              <input
                type="text"
                value={currentSlideTitle}
                onChange={(e) => setCurrentSlideTitle(e.target.value)}
                placeholder="Enter slide title"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <button
                onClick={handleAddSlide}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Add Slide
              </button>
            </div>

            {/* Additional Instructions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Additional Instructions
              </label>
              <textarea
                value={presentationInstructions}
                onChange={(e) => setPresentationInstructions(e.target.value)}
                placeholder="E.g., 'Use simple language' or 'Include examples'"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationGeneratorModal;