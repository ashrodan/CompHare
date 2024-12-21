import React from 'react';

interface WebLinkModalProps {
  link: string;
  onClose: () => void;
}

export default function WebLinkModal({ link, onClose }: WebLinkModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl relative flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Product Website</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg mb-4">Unable to load website directly in modal.</p>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Open Website in New Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
