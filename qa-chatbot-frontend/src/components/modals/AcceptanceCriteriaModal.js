import React, { useState } from 'react';

const AcceptanceCriteriaModal = ({ isOpen, onClose, onConfirm }) => {
  const [cos, setCos] = useState('');

  const handleConfirm = () => {
    if (!cos.trim()) {
      alert('Please enter COS for Acceptance Criteria');
      return;
    }
    
    const prompt = `Write the happy paths and unhappy paths for the following scenarios step by step. Just include the paths without headings and subheadings. Start with "Acceptance Criteria" heading, then list the happy and unhappy paths.

The format is Acceptance Criteria (nothing under acceptance criteria) Happy Paths: (All the happy paths with number bullets ) Unhappy Paths: (All the unhappy paths with number bullets )

COS: ${cos}`;
    
    onConfirm(prompt);
    setCos('');
  };

  const handleClose = () => {
    setCos('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">Acceptance Criteria</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conditions of Scope (COS)
          </label>
          <textarea
            value={cos}
            onChange={(e) => setCos(e.target.value)}
            placeholder="Enter your COS here..."
            rows={4}
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceCriteriaModal;