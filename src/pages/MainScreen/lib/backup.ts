export const createBackup = () => {
  const documents = localStorage.getItem("documents");
  if (documents) {
    localStorage.setItem("documents_backup", documents);
    localStorage.setItem("documents_backup_time", new Date().toISOString());
  }
};

export const restoreFromBackup = () => {
  const backup = localStorage.getItem("documents_backup");
  if (backup) {
    localStorage.setItem("documents", backup);
    return true;
  }
  return false;
};

export const getBackupInfo = () => {
  const backupTime = localStorage.getItem("documents_backup_time");
  return {
    exists: !!localStorage.getItem("documents_backup"),
    lastBackup: backupTime ? new Date(backupTime) : null,
  };
};
