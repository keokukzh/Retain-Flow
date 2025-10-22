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
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900">RetainFlow Visual Editor</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onTemplatesClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Templates
        </button>
        <button
          onClick={onExportClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Export
        </button>
      </div>
    </div>
  );
}