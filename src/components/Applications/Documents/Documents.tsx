import { DocumentsContextProvider } from "@context/DocumentsContext/DocumentsContextProvider";

import { DocumentsList } from "./DocumentsList/DocumentsList";
import { DocumentsForm } from "./DocumentsForm/DocumentsForm";
import { DocumentsHeader } from "./DocumentsHeader/DocumentsHeader";
export const Documents = () => {
  return (
    <DocumentsContextProvider>
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        <DocumentsHeader />
        <div className="flex flex-1 overflow-hidden">
          <DocumentsList />
          <DocumentsForm />
        </div>
      </div>
    </DocumentsContextProvider>
  );
};
