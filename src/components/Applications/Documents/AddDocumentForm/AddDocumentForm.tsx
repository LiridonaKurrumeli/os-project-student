import { useEffect, useState } from "react";
import {
  FileType,
  useDocumentsContext,
} from "@context/DocumentsContext/DocumentsContext";

interface Props {
  type: FileType;
  onCancel: () => void;
  onSubmit: (name: string, body: string) => void;
}

export const AddDocumentForm = ({ type, onCancel, onSubmit }: Props) => {
  const { editItem } = useDocumentsContext();
  const [name, setName] = useState(editItem?.name || "");
  const [body, setBody] = useState(editItem?.body || "");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setName(editItem?.name || "");
    setBody(editItem?.body || "");
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    setNameError("");
    onSubmit(name, body);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">{type === "folder" ? "📁" : "📄"}</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {editItem
            ? `Edit ${type === "folder" ? "Folder" : "File"}`
            : `Create New ${type === "folder" ? "Folder" : "File"}`}
        </h3>
      </div>

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              type === "folder" ? "e.g., My Documents" : "e.g., notes.txt"
            }
            className={`w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
              nameError
                ? "border-red-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
            autoFocus
          />
          {nameError && (
            <p className="mt-1 text-sm text-red-500">{nameError}</p>
          )}
        </div>

        {/* Content Field (only for files) */}
        {type === "file" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your content here..."
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <p className="mt-1 text-xs text-gray-400">
              {body.length} characters
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-primary text-gray-800 rounded-xl font-medium hover:opacity-80 transition-colors"
          >
            {editItem ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
};
