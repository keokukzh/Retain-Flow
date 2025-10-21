'use client';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

interface TemplatesPanelProps {
  templates: Template[];
  onLoadTemplate: (templateId: string) => void; // eslint-disable-line no-unused-vars
  onClose: () => void;
}

export default function TemplatesPanel({
  templates,
  onLoadTemplate,
  onClose,
}: TemplatesPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onLoadTemplate(template.id)}
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {template.name}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
