import { useState, useMemo } from "react";
import { useWindowContext } from "@context/WindowContext/WindowContext";
import { Application } from "@components/Applications/Application";
import { applications } from "@pages/MainScreen/lib/applications";

export const ApplicationsSection = () => {
  const { openWindow } = useWindowContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro aplikacionet bazuar në search
  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) {
      return applications;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return applications.filter((app) =>
      app.name.toLowerCase().includes(lowerSearch),
    );
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-primary to-secondary dark:from-gray-800 dark:to-gray-900">
      <div className="w-full px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full px-5 py-3 pl-12 pr-10 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/30 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">
              Found {filteredApps.length} result
              {filteredApps.length !== 1 && "s"} for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Applications Grid */}
        <div className="max-w-5xl mx-auto">
          {filteredApps.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {filteredApps.map((app) => (
                <Application
                  key={app.name}
                  name={app.name}
                  type={app.type}
                  icon={app.icon}
                  onDoubleClick={() => openWindow(app.type)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 dark:text-gray-400">
                No applications found
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
