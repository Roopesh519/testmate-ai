import React, { useState } from 'react';

const GherkinModal = ({ isOpen, onClose, onConfirm }) => {
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!acceptanceCriteria.trim()) {
      setError('Please enter Acceptance Criteria');
      return;
    }

    setError('');

    const prompt = `Generate Gherkin scenarios based on the following acceptance criteria. Follow the standard Given-When-Then format and create comprehensive test scenarios covering both happy and unhappy paths.

**Structure your response as follows:**

**Feature:** [Feature name based on the acceptance criteria]

**Scenario 1: [Happy Path Scenario Name]**
Given [precondition]
When [action]
Then [expected result]

**Scenario 2: [Another Happy Path if applicable]**
Given [precondition]
When [action]
Then [expected result]

**Scenario 3: [Unhappy Path Scenario Name]**
Given [precondition]
When [action]
Then [expected result/error handling]

**Scenario 4: [Another Unhappy Path if applicable]**
Given [precondition]
When [action]
Then [expected result/error handling]

---

**Acceptance Criteria:**
${acceptanceCriteria}${additionalNotes ? `\n\n**Additional Notes:**\n${additionalNotes}` : ''}

Generate clear, specific, and testable Gherkin scenarios that cover the main functionality and edge cases.`;

    onConfirm(prompt);
    setAcceptanceCriteria('');
    setAdditionalNotes('');
  };

  const handleClose = () => {
    setAcceptanceCriteria('');
    setAdditionalNotes('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Generate Gherkin Scenarios</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acceptance Criteria <span className="text-red-500">*</span>
          </label>
          <textarea
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            placeholder="Enter acceptance criteria here..."
            rows={5}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any additional context, business rules, or specific requirements..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Generate Gherkin
          </button>
        </div>
      </div>
    </div>
  );
};

export default GherkinModal;