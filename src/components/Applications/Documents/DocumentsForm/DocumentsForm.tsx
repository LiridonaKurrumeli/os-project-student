import { useState } from "react";

import { AddNewDocument } from "../AddNewDocument/AddNewDocument";
import { AddDocumentForm } from "../AddDocumentForm/AddDocumentForm";
import {
  FileType,
  useDocumentsContext,
} from "@context/DocumentsContext/DocumentsContext";

export const DocumentsForm = () => {
  const [formType, setFormType] = useState<FileType | null>(null);
  const { selectedId, editItem, onSubmit, onCancelEdit } =
    useDocumentsContext();

  const handleSubmit = (name: string, body: string) => {
    onSubmit(
      {
        body,
        name,
        type: editItem?.type || formType!,
        parentId: editItem?.parentId || selectedId,
        id: editItem?.id || Math.random().toString(),
      },
      !!editItem,
    );
    setFormType(null);
  };

  const handleCancel = () => {
    setFormType(null);
    onCancelEdit(null);
  };

  return (
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {formType === null && editItem === null ? (
        <AddNewDocument onAddNew={setFormType} />
      ) : (
        <AddDocumentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          type={formType || editItem!.type}
        />
      )}
    </div>
  );
};
