'use client';

interface ExportPanelProps {
  onExport: (format: string) => void; // eslint-disable-line no-unused-vars
  onClose: () => void;
}

export default function ExportPanel({ onExport, onClose }: ExportPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Export Your Design</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => onExport('html')}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-semibold">HTML/CSS</div>
              <div className="text-sm text-gray-600">Complete HTML file with embedded CSS</div>
            </button>
            <button
              onClick={() => onExport('jsx')}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-semibold">React Component (JSX)</div>
              <div className="text-sm text-gray-600">Ready-to-use React component</div>
            </button>
            <button
              onClick={() => onExport('json')}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-semibold">JSON Data</div>
              <div className="text-sm text-gray-600">Structured data for import/export</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
