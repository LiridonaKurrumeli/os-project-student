import { FileType } from "@context/DocumentsContext/DocumentsContext";

interface Props {
  onAddNew: (type: FileType) => void;
}

export const AddNewDocument = ({ onAddNew }: Props) => {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">📁</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Create New
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add a folder or file to organize your documents
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onAddNew("folder")}
          className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
        >
          <div className="text-2xl">📁</div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800 dark:text-white group-hover:text-primary transition-colors">
              New Folder
            </p>
            <p className="text-xs text-gray-400">Organize your documents</p>
          </div>
          <span className="text-gray-400 group-hover:text-primary transition-colors">
            →
          </span>
        </button>

        <button
          onClick={() => onAddNew("file")}
          className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
        >
          <div className="text-2xl">📄</div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800 dark:text-white group-hover:text-primary transition-colors">
              New File
            </p>
            <p className="text-xs text-gray-400">Create a document</p>
          </div>
          <span className="text-gray-400 group-hover:text-primary transition-colors">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
