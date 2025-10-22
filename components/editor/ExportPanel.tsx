/* eslint-disable no-unused-vars */
interface ExportPanelProps {
  onExport: (formatId: string) => void;
  onClose: () => void;
}

export default function ExportPanel({ onExport, onClose }: ExportPanelProps) {
  const exportFormats = [
    {
      id: 'html',
      name: 'HTML/CSS',
      description: 'Export as static HTML and CSS files',
      icon: '🌐',
    },
    {
      id: 'jsx',
      name: 'React Component',
      description: 'Export as a React JSX component',
      icon: '⚛️',
    },
    {
      id: 'database',
      name: 'Save to Database',
      description: 'Save project to RetainFlow database',
      icon: '💾',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Export Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
                onClick={() => onExport(format.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{format.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{format.name}</h3>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                  <div className="text-primary-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Export Tips</h4>
                <p className="text-sm text-blue-800">
                  Choose the format that best fits your needs. HTML/CSS for static sites, 
                  React components for dynamic apps, or save to database for future editing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}