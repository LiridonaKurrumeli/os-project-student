// src/components/Applications/Browser/Browser.tsx
import { useState, useEffect } from "react";
import { Input } from "@components/shared/Input/Input";
import { Button } from "@components/shared/Button/Button";
import { Icon } from "@components/shared/Icon/Icon";
import { toast } from "react-toastify";

export const Browser = () => {
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("browserBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    const savedHistory = localStorage.getItem("browserHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      setHistoryIndex(parsedHistory.length - 1);
    }
  }, []);

  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem("browserBookmarks", JSON.stringify(newBookmarks));
  };

  const addToHistory = (urlToAdd: string) => {
    // Don't add duplicates
    if (history[history.length - 1] === urlToAdd) return;

    const newHistory = [...history, urlToAdd];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    // Keep only last 50 history items
    localStorage.setItem(
      "browserHistory",
      JSON.stringify(newHistory.slice(-50)),
    );
  };

  const navigateTo = (urlToGo: string) => {
    let finalUrl = urlToGo;

    // Add https if no protocol
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    setCurrentUrl(finalUrl);
    addToHistory(finalUrl);
    setIsLoading(true);
    setShowBookmarks(false);
    setShowHistory(false);

    // Open in new tab/window
    window.open(finalUrl, "_blank");

    setTimeout(() => {
      setIsLoading(false);
      toast.success(`🌐 Opened: ${finalUrl}`);
    }, 500);
  };

  const handleSearch = () => {
    if (!search.trim()) {
      toast.warning("Please enter a search term or URL");
      return;
    }

    let searchTerm = search.trim();
    const urlPattern =
      /^([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

    if (urlPattern.test(searchTerm) || searchTerm.includes(".")) {
      // It's a URL
      if (!searchTerm.startsWith("http")) {
        searchTerm = "https://" + searchTerm;
      }
      navigateTo(searchTerm);
    } else {
      // It's a search query
      navigateTo(
        `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
      );
    }

    setSearch("");
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) {
      toast.warning("Please enter a URL");
      return;
    }

    let newUrl = url.trim();
    if (!newUrl.startsWith("http")) {
      newUrl = "https://" + newUrl;
    }

    navigateTo(newUrl);
    setUrl("");
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousUrl = history[newIndex];
      setCurrentUrl(previousUrl);
      window.open(previousUrl, "_blank");
      toast.info(`◀ Going back to: ${previousUrl}`);
    } else {
      toast.warning("No previous page in history");
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setCurrentUrl(nextUrl);
      window.open(nextUrl, "_blank");
      toast.info(`▶ Going forward to: ${nextUrl}`);
    } else {
      toast.warning("No next page in history");
    }
  };

  const refreshPage = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank");
      toast.success("🔄 Page refreshed");
    }
  };

  const addBookmark = () => {
    if (!bookmarks.includes(currentUrl)) {
      const newBookmarks = [...bookmarks, currentUrl];
      saveBookmarks(newBookmarks);
      toast.success(`⭐ Added to bookmarks: ${currentUrl}`);
    } else {
      toast.info("📍 This page is already in bookmarks");
    }
  };

  const removeBookmark = (bookmarkUrl: string) => {
    const newBookmarks = bookmarks.filter((b) => b !== bookmarkUrl);
    saveBookmarks(newBookmarks);
    toast.success(`🗑️ Removed bookmark`);
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem("browserHistory");
    toast.success("🧹 Browser history cleared");
    setShowHistory(false);
  };

  const clearBookmarks = () => {
    saveBookmarks([]);
    toast.success("⭐ All bookmarks cleared");
    setShowBookmarks(false);
  };

  const goToBookmark = (bookmarkUrl: string) => {
    navigateTo(bookmarkUrl);
  };

  const quickLinks = [
    { name: "Google", url: "https://www.google.com", icon: "🔍" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "📺" },
    { name: "GitHub", url: "https://github.com", icon: "🐙" },
    { name: "Reddit", url: "https://www.reddit.com", icon: "🤖" },
    { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
    { name: "Amazon", url: "https://www.amazon.com", icon: "🛒" },
    { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
    { name: "Facebook", url: "https://www.facebook.com", icon: "👥" },
    { name: "Instagram", url: "https://www.instagram.com", icon: "📸" },
    { name: "LinkedIn", url: "https://www.linkedin.com", icon: "💼" },
    { name: "Netflix", url: "https://www.netflix.com", icon: "🎬" },
    { name: "Spotify", url: "https://www.spotify.com", icon: "🎵" },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUrlSubmit();
    }
  };

  const getDisplayUrl = (fullUrl: string) => {
    return fullUrl
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-gray-900">
      {/* Browser Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Top Navigation Bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
          {/* Navigation Buttons */}
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-lg transition-colors ${historyIndex > 0 ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200" : "opacity-50 cursor-not-allowed text-gray-400"}`}
            title="Go Back"
          >
            ◀
          </button>

          <button
            onClick={goForward}
            disabled={
              historyIndex >= history.length - 1 || history.length === 0
            }
            className={`p-2 rounded-lg transition-colors ${historyIndex < history.length - 1 && history.length > 0 ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200" : "opacity-50 cursor-not-allowed text-gray-400"}`}
            title="Go Forward"
          >
            ▶
          </button>

          <button
            onClick={refreshPage}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh / Open in New Tab"
          >
            🔄
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* URL Input */}
          <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5">
            <span className="text-gray-500 dark:text-gray-400 text-sm">🔒</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleUrlKeyPress}
              placeholder="Enter URL (e.g., google.com)"
              className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 text-sm"
            />
            <button
              onClick={handleUrlSubmit}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Go
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* Action Buttons */}
          <button
            onClick={addBookmark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Add Bookmark"
          >
            ⭐
          </button>

          <button
            onClick={() => {
              setShowBookmarks(!showBookmarks);
              setShowHistory(false);
            }}
            className={`p-2 rounded-lg transition-colors ${showBookmarks ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            title="Bookmarks"
          >
            📚
          </button>

          <button
            onClick={() => {
              setShowHistory(!showHistory);
              setShowBookmarks(false);
            }}
            className={`p-2 rounded-lg transition-colors ${showHistory ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            title="History"
          >
            📜
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search Google or type a URL..."
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
              >
                <Icon icon="search" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current URL Display */}
      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📍 Current:</span>
          <span className="text-primary font-mono text-sm truncate">
            {currentUrl}
          </span>
        </div>
      </div>

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-10 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                ⭐ Bookmarks ({bookmarks.length})
              </h3>
              {bookmarks.length > 0 && (
                <button
                  onClick={clearBookmarks}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              )}
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No bookmarks yet. Click ⭐ to add bookmarks
              </p>
            ) : (
              <div className="space-y-1">
                {bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <button
                      onClick={() => goToBookmark(bookmark)}
                      className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300 truncate"
                      title={bookmark}
                    >
                      {getDisplayUrl(bookmark)}
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark)}
                      className="text-red-500 hover:text-red-600 text-sm px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-10 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                📜 History ({history.length})
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No history yet. Start browsing!
              </p>
            ) : (
              <div className="space-y-1">
                {[...history].reverse().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => navigateTo(item)}
                  >
                    <span className="text-sm">🌐</span>
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {getDisplayUrl(item)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Links Grid */}
      {!showBookmarks && !showHistory && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🌐</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                OS Browser
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Quick access to your favorite websites
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigateTo(link.url)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {link.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Tips:</strong> Click any link to open in a new tab •
                Use ◀ ▶ to navigate history • Click ⭐ to bookmark
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <div className="flex gap-4">
          <span>🔒 Secure Connection</span>
          <span>⭐ {bookmarks.length} Bookmarks</span>
          <span>📜 {history.length} History </span>
        </div>
        <div className="truncate max-w-md">
          <span>🌐 {getDisplayUrl(currentUrl)}</span>
        </div>
      </div>
    </div>
  );
};
