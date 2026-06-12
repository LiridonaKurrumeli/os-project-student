import { useDocumentsContext } from "@context/DocumentsContext/DocumentsContext";
import { DocumentsListItem } from "./DocumentsListItem";

export const DocumentsList = () => {
  const { activeList } = useDocumentsContext();

  if (!activeList || activeList.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Documents
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first folder or file using the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeList.map((document) => (
          <DocumentsListItem key={document.id} {...document} />
        ))}
      </div>
    </div>
  );
};
