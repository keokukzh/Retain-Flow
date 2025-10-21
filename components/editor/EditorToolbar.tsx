'use client';

interface EditorToolbarProps {
  onTemplatesClick: () => void;
  onExportClick: () => void;
  onSave: () => void;
  onClear: () => void;
}

export default function EditorToolbar({
  onTemplatesClick,
  onExportClick,
  onSave,
  onClear,
}: EditorToolbarProps) {
  return (
    <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">RetainFlow Visual Editor</h1>
      <div className="flex space-x-4">
        <button
          onClick={onTemplatesClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Templates
        </button>
        <button
          onClick={onExportClick}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Export
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
