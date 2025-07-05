import React, { useState } from 'react';

const TestCharterModal = ({ isOpen, onClose, onConfirm }) => {
    const [formData, setFormData] = useState({
        cos: '',
        persona: '',
        duration: 'Short (30 min)',
        ratio: '90/10',
        bugTime: '',
        environment: '',
        tester: '',
        objectives: '',
        areas: {
            functional: true,
            uiUx: true,
            navigation: true,
            security: true,
            errorHandling: true
        }
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAreaChange = (area, checked) => {
        setFormData(prev => ({
            ...prev,
            areas: {
                ...prev.areas,
                [area]: checked
            }
        }));
    };

    const handleConfirm = () => {
        if (!formData.cos.trim()) {
            alert('Please enter COS for Test Charter');
            return;
        }
        if (!formData.persona.trim()) {
            alert('Please enter Persona for Test Charter');
            return;
        }

        const selectedAreas = Object.entries(formData.areas)
            .filter(([key, value]) => value)
            .map(([key, value]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
            .join(', ');

        const prompt = `Generate a Test Charter in plain text Markdown based on the following Conditions of Scope (COS): 
COS: ${formData.cos} 
PERSONA: ${formData.persona}
DURATION: ${formData.duration}
CHARTER VS. OPPORTUNITY: ${formData.ratio}
BUG INVESTIGATION & REPORTING: ${formData.bugTime || 'To be determined'}
TESTING AREAS: ${selectedAreas}
TEST ENVIRONMENT: ${formData.environment || 'To be specified'}
TESTER: ${formData.tester || 'To be assigned'}
OBJECTIVES: ${formData.objectives || 'To be defined'}

Structure: CHARTER – Define the testing objectives and expected behavior. AREAS – Table of testing areas (Functional, UI/UX, Navigation, Security, Error Handling). TESTER – Placeholder for tester's name. TASK BREAKDOWN – Outline key testing tasks. DURATION – Specify session length (Short (30 min) / Long (1 hour)). BUG INVESTIGATION & REPORTING – Time allocated for defect analysis. CHARTER VS. OPPORTUNITY – Ratio of structured vs. exploratory testing (e.g., 90/10). TEST NOTES – Key scenarios covering Feature validation, Security, Navigation, Error Handling, UI/UX. TEST CASES – Table format with columns: Test Case ID Steps Expected Outcome Actual Outcome Status (Pass/Fail) POTENTIAL RISKS – Identify risks and challenges. BUGS – Table format with columns: Bug ID Severity Description Steps to Reproduce Status (Open, In Progress, Resolved) ISSUES & CLARIFICATIONS – List open questions needing resolution. ENHANCEMENTS – Suggest usability, security, or performance improvements. PERSONA(Describe the assumed user persona for this session), Test Execution Notes(Important notes to be added to another tester), Resources (specifying the type of environment we have tested in).`;

        onConfirm(prompt);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            cos: '',
            persona: '',
            duration: 'Short (30 min)',
            ratio: '90/10',
            bugTime: '',
            environment: '',
            tester: '',
            objectives: '',
            areas: {
                functional: true,
                uiux: true,
                navigation: true,
                security: true,
                errorHandling: true
            }
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-gray-200">
                    <h3 className="text-lg text-gray-700 font-semibold">Test Charter</h3>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 py-4">
                    <div className="space-y-4">
                        {/* COS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conditions of Scope (COS) *
                            </label>
                            <textarea
                                value={formData.cos}
                                onChange={(e) => handleInputChange('cos', e.target.value)}
                                placeholder="Enter your COS here..."
                                rows={3}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Persona */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Persona *
                            </label>
                            <input
                                type="text"
                                value={formData.persona}
                                onChange={(e) => handleInputChange('persona', e.target.value)}
                                placeholder="Specify your persona (e.g., End User, Admin, Developer)..."
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Duration and Ratio Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Short (30 min)">Short (30 min)</option>
                                    <option value="Long (1 hour)">Long (1 hour)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Charter vs. Opportunity
                                </label>
                                <input
                                    type="text"
                                    value={formData.ratio}
                                    onChange={(e) => handleInputChange('ratio', e.target.value)}
                                    placeholder="e.g., 90/10"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bug Investigation Time and Environment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bug Investigation Time
                                </label>
                                <input
                                    type="text"
                                    value={formData.bugTime}
                                    onChange={(e) => handleInputChange('bugTime', e.target.value)}
                                    placeholder="e.g., 15 minutes"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Environment
                                </label>
                                <input
                                    type="text"
                                    value={formData.environment}
                                    onChange={(e) => handleInputChange('environment', e.target.value)}
                                    placeholder="e.g., Staging, Production, Dev"
                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Tester Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tester Name
                            </label>
                            <input
                                type="text"
                                value={formData.tester}
                                onChange={(e) => handleInputChange('tester', e.target.value)}
                                placeholder="Enter tester's name..."
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Objectives */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Charter Objectives
                            </label>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => handleInputChange('objectives', e.target.value)}
                                placeholder="Brief description of testing objectives..."
                                rows={2}
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Testing Areas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Testing Areas
                            </label>
                            <div className="grid grid-cols-2 gap-2 text-gray-700">
                                {Object.entries(formData.areas).map(([key, value]) => (
                                    <label key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => handleAreaChange(key, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 pt-4 border-t border-gray-200">
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
        </div>
    );
};

export default TestCharterModal;