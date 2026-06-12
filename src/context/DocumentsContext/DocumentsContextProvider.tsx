import { useEffect, useState } from "react";
import {
  StorageDocument,
  DocumentsContext,
  DocumentsContextValues,
} from "./DocumentsContext";
import {
  addToStorage,
  editStorage,
  getStorageData,
  removeFromStorage,
} from "./lib/helpers";
import { toast } from "react-toastify";

interface Props {
  children: React.ReactNode;
}

export const DocumentsContextProvider = (props: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<StorageDocument | null>(null);
  const [activeList, setActiveList] = useState<StorageDocument[] | null>(() => {
    const data = getStorageData();
    return !data ? null : data.filter((item) => item.parentId === null);
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedAutoSave = localStorage.getItem("autoSave");
    setAutoSaveEnabled(savedAutoSave === "true");
  }, []);

  useEffect(() => {
    const handleAutoSaveToggle = (event: CustomEvent) => {
      setAutoSaveEnabled(event.detail.enabled);
      if (event.detail.enabled) {
        toast.info("Documents auto-save has been activated");
      } else {
        toast.info("Documents auto-save has been deactivated");
      }
    };

    window.addEventListener("autoSaveToggle" as any, handleAutoSaveToggle);

    return () => {
      window.removeEventListener("autoSaveToggle" as any, handleAutoSaveToggle);
    };
  }, []);

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      const documents = getStorageData();
      if (documents && documents.length > 0) {
        localStorage.setItem("documents_backup", JSON.stringify(documents));
        setLastSaved(new Date());

        if (!sessionStorage.getItem("autoSaveNotified")) {
          toast.success("Documents auto-saved successfully");
          sessionStorage.setItem("autoSaveNotified", "true");

          const notificationsEnabled =
            localStorage.getItem("notifications") === "true";
          if (
            notificationsEnabled &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("OS Project", {
              body: "Your documents have been auto-saved!",
              icon: "/src/favicon.svg",
            });
          }
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled]);

  useEffect(() => {
    const mainData = getStorageData();
    if (!mainData || mainData.length === 0) {
      const backupData = localStorage.getItem("documents_backup");
      if (backupData) {
        try {
          const parsed = JSON.parse(backupData);
          if (parsed && parsed.length > 0) {
            localStorage.setItem("documents", backupData);
            console.log("Restored documents from backup");
          }
        } catch (e) {
          console.error("Failed to restore backup", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const storageData = getStorageData();
    const newList = storageData?.filter((item) => item.parentId === selectedId);
    setActiveList(newList || null);
  }, [selectedId]);

  const handleEdit = (value: StorageDocument | null) => {
    setEditItem(value);
  };

  const handleSelect = (id: string) => {
    setNavigationHistory((prev) => [...prev, selectedId || "root"]);
    setSelectedId(id);

    const notificationsEnabled =
      localStorage.getItem("notifications") === "true";
    if (
      notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const folder = getStorageData()?.find((item) => item.id === id);
      if (folder && folder.type === "folder") {
        new Notification("OS Project", {
          body: `Opening folder: ${folder.name}`,
          icon: "/src/favicon.svg",
        });
      }
    }
  };

  const handlePrevious = (id: string) => {
    const storageData = getStorageData();
    const currentFolder = storageData?.find((item) => item.id === id);

    if (currentFolder) {
      setSelectedId(currentFolder.parentId);
      setNavigationHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (item: StorageDocument, isEdit: boolean) => {
    if (!isEdit) {
      addToStorage(item);
      setActiveList((prev) => (prev === null ? [item] : [...prev, item]));

      toast.success(
        `✅ ${item.type === "folder" ? "Folder" : "File"} "${item.name}" created successfully`,
      );

      const notificationsEnabled =
        localStorage.getItem("notifications") === "true";
      if (
        notificationsEnabled &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("OS Project", {
          body: `${item.type === "folder" ? "Folder" : "File"} "${item.name}" has been created`,
          icon: "/src/favicon.svg",
        });
      }
      return;
    }

    editStorage(item);

    setActiveList((prev) => {
      if (prev === null) {
        return null;
      }
      return prev.map((el) => (el.id === item.id ? item : el));
    });

    setEditItem(null);
    toast.success(`✏️ "${item.name}" updated successfully`);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = getStorageData()?.find((item) => item.id === id);
    const itemName = itemToDelete?.name || "Item";
    const itemType = itemToDelete?.type === "folder" ? "Folder" : "File";

    const isCurrentFolder = selectedId === id;

    removeFromStorage(id);

    setActiveList((prev) =>
      prev === null ? null : prev.filter((item) => item.id !== id),
    );

    if (isCurrentFolder) {
      const parentId = itemToDelete?.parentId || null;
      setSelectedId(parentId);
      toast.info(`📍 Returned to parent folder`);
    }

    toast.success(`🗑️ ${itemType} "${itemName}" has been deleted`);

    const notificationsEnabled =
      localStorage.getItem("notifications") === "true";
    if (
      notificationsEnabled &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("OS Project", {
        body: `${itemType} "${itemName}" has been deleted`,
        icon: "/src/favicon.svg",
      });
    }
  };

  const context: DocumentsContextValues = {
    editItem,
    selectedId,
    activeList,
    onEdit: handleEdit,
    onSelect: handleSelect,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onCancelEdit: handleEdit,
    onPrevious: handlePrevious,
  };

  return (
    <DocumentsContext.Provider value={context}>
      {props.children}
    </DocumentsContext.Provider>
  );
};
