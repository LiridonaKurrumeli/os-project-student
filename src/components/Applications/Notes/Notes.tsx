import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

const noteColors = [
  "bg-yellow-50 dark:bg-yellow-900/20",
  "bg-green-50 dark:bg-green-900/20",
  "bg-blue-50 dark:bg-blue-900/20",
  "bg-purple-50 dark:bg-purple-900/20",
  "bg-pink-50 dark:bg-pink-900/20",
];

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.warning("Please enter a title");
      return;
    }

    if (isEditing && selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: title.trim(),
              content: content.trim(),
              date: new Date().toISOString(),
            }
          : note,
      );
      saveNotes(updatedNotes);
      toast.success("Note updated successfully!");
      resetForm();
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        color: noteColors[Math.floor(Math.random() * noteColors.length)],
      };
      saveNotes([newNote, ...notes]);
      toast.success("Note created successfully!");
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
    if (selectedNote?.id === id) resetForm();
    toast.success("Note deleted!");
  };

  const resetForm = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setTitle("");
    setContent("");
  };

  const createNewNote = () => {
    resetForm();
  };

  const editNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col flex-1 max-h-full overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto w-full p-6">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Notes List */}
          <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">📝 Notes</h2>
              <span className="text-sm text-gray-500">
                {notes.length} total
              </span>
            </div>
            <button
              onClick={createNewNote}
              className="w-full mb-4 px-4 py-2 bg-primary text-gray-800 rounded-lg font-medium hover:opacity-80 transition-colors"
            >
              + New Note
            </button>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500">No notes yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click "New Note" to create one
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => editNote(note)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedNote?.id === note.id && isEditing
                        ? "bg-primary/20 border-l-4 border-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <h3 className="font-semibold dark:text-white truncate">
                      {note.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {formatDate(note.date)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Note Editor */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-2xl font-bold mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 pb-2 outline-none focus:border-primary dark:text-white"
              autoFocus
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={14}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary dark:text-gray-200"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-gray-800 rounded-lg font-medium hover:opacity-80 transition-colors"
              >
                {isEditing ? "Update Note" : "Save Note"}
              </button>
              {selectedNote && isEditing && (
                <button
                  onClick={() => handleDelete(selectedNote.id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
              {(title || content) && (
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:opacity-80 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Status indicator */}
            {isEditing && selectedNote && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                ✏️ Editing: {selectedNote.title}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
