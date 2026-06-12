import { useState } from "react";
import {
  StorageDocument,
  useDocumentsContext,
} from "@context/DocumentsContext/DocumentsContext";
import { Icon } from "@components/shared/Icon/Icon";

export const DocumentsListItem = (props: StorageDocument) => {
  const { onEdit, onDelete, onSelect, selectedId } = useDocumentsContext();
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (props.type === "folder") {
      return "📁";
    }
    return "📄";
  };

  const getColor = () => {
    if (props.type === "folder") {
      return "text-yellow-500";
    }
    return "text-blue-500";
  };

  const handleDelete = () => {
    if (props.type === "folder" && selectedId === props.id) {
      // This will trigger the parent to go back
      onDelete(props.id);
    } else {
      onDelete(props.id);
    }
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-4">
        <div
          onClick={() => {
            if (props.type === "folder") {
              onSelect(props.id);
            }
          }}
          className={`flex items-center gap-3 flex-1 cursor-pointer ${props.type === "folder" ? "hover:opacity-80" : ""}`}
        >
          <div className={`text-2xl ${getColor()}`}>{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 dark:text-white truncate">
              {props.name}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {props.type === "folder" ? "Folder" : "File"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={() => onEdit(props)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
