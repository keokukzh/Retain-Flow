/* eslint-disable no-unused-vars */
interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

interface TemplatesPanelProps {
  templates: Template[];
  onLoadTemplate: (id: string) => void;
  onClose: () => void;
}

export default function TemplatesPanel({
  templates,
  onLoadTemplate,
  onClose,
}: TemplatesPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onLoadTemplate(template.id)}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RF</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {template.category}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Load Template
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {templates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-500 text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Available</h3>
              <p className="text-gray-600">Templates will appear here once they&apos;re loaded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}