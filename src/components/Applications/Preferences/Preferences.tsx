import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const Preferences = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("medium");
  const [translatedText, setTranslatedText] = useState({
    welcome: "Welcome to OS Project!",
    settings: "Settings saved successfully",
    notification: "You have a new notification",
  });

  let autoSaveInterval: ReturnType<typeof setInterval> | null = null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }

    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null)
      setNotifications(savedNotifications === "true");

    const savedAutoSave = localStorage.getItem("autoSave");
    if (savedAutoSave !== null) setAutoSave(savedAutoSave === "true");

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      applyLanguage(savedLanguage);
    }

    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }

    if (savedAutoSave === "true") {
      startAutoSaveInterval();
    }

    return () => {
      stopAutoSaveInterval();
    };
  }, []);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");
    if (size === "small") root.classList.add("text-sm");
    else if (size === "large") root.classList.add("text-lg");
    else root.classList.add("text-base");
  };

  const applyLanguage = (lang: string) => {
    document.documentElement.lang = lang === "en" ? "en" : "sq";

    if (lang === "sq") {
      setTranslatedText({
        welcome: "Mirë se vini në OS Project!",
        settings: "Cilësimet u ruajtën me sukses",
        notification: "Keni një njoftim të ri",
      });
    } else {
      setTranslatedText({
        welcome: "Welcome to OS Project!",
        settings: "Settings saved successfully",
        notification: "You have a new notification",
      });
    }

    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: { language: lang } }),
    );
  };

  const startAutoSaveInterval = () => {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
      // Simulate auto-save
      const lastSaveTime = localStorage.getItem("lastAutoSave");
      const now = new Date().toISOString();
      localStorage.setItem("lastAutoSave", now);

      const documents = localStorage.getItem("documents");
      if (documents) {
        localStorage.setItem("documents_backup", documents);
        console.log("Auto-saved documents at:", now);
      }

      const notificationsEnabled =
        localStorage.getItem("notifications") === "true";
      if (notificationsEnabled && Notification.permission === "granted") {
        new Notification("OS Project", {
          body:
            language === "en"
              ? "Documents auto-saved"
              : "Dokumentet u ruajtën automatikisht",
          icon: "/src/favicon.svg",
        });
      }
    }, 30000);
  };

  const stopAutoSaveInterval = () => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      autoSaveInterval = null;
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      toast.success("🌙 Dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      toast.success("☀️ Light mode enabled");
    }
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", String(newValue));

    if (newValue) {
      toast.info("🔔 Notifications enabled");
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("OS Project", {
                body:
                  language === "en"
                    ? "Notifications are now enabled!"
                    : "Njoftimet janë aktivizuar!",
                icon: "/src/favicon.svg",
              });
            }
          });
        } else if (Notification.permission === "granted") {
          new Notification("OS Project", {
            body:
              language === "en"
                ? "Notifications are now enabled!"
                : "Njoftimet janë aktivizuar!",
            icon: "/src/favicon.svg",
          });
        }
      }
    } else {
      toast.info("🔕 Notifications disabled");
    }
  };

  const handleAutoSaveToggle = () => {
    const newValue = !autoSave;
    setAutoSave(newValue);
    localStorage.setItem("autoSave", String(newValue));

    if (newValue) {
      startAutoSaveInterval();
      toast.info(
        "💾 Auto-save enabled - Your work will be saved automatically every 30 seconds",
      );

      setTimeout(() => {
        if (localStorage.getItem("notifications") === "true") {
          toast.success("💾 Test auto-save completed!");
        }
      }, 1000);
    } else {
      stopAutoSaveInterval();
      toast.info("📁 Auto-save disabled - Remember to save manually");
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    applyLanguage(lang);

    toast.success(
      `🌐 ${lang === "en" ? "Language changed to English" : "Gjuha u ndryshua në Shqip"}`,
    );

    document.title = lang === "en" ? "OS Project" : "Projekti OS";
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);

    const sizeLabel =
      size === "small"
        ? language === "en"
          ? "Small"
          : "E Vogël"
        : size === "large"
          ? language === "en"
            ? "Large"
            : "E Madhe"
          : language === "en"
            ? "Medium"
            : "E Mesme";

    toast.success(
      `🔤 ${language === "en" ? "Font size changed to" : "Madhësia e fontit u ndryshua në"} ${sizeLabel}`,
    );
  };

  const handleTestNotification = () => {
    if (notifications) {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("OS Project", {
            body:
              language === "en"
                ? "This is a test notification!"
                : "Ky është një njoftim testues!",
            icon: "/src/favicon.svg",
          });
          toast.success(
            language === "en"
              ? "📨 Test notification sent!"
              : "📨 Njoftimi testues u dërgua!",
          );
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              handleTestNotification();
            }
          });
        } else {
          toast.error(
            language === "en"
              ? "❌ Notifications are blocked"
              : "❌ Njoftimet janë të bllokuara",
          );
        }
      } else {
        toast.warning(
          language === "en"
            ? "⚠️ Notifications not supported"
            : "⚠️ Njoftimet nuk mbështeten",
        );
      }
    } else {
      toast.warning(
        language === "en"
          ? "🔕 Please enable notifications first"
          : "🔕 Ju lutem aktivizoni njoftimet fillimisht",
      );
    }
  };

  const sendDemoNotification = () => {
    if (notifications && Notification.permission === "granted") {
      new Notification("OS Project", {
        body: translatedText.notification,
        icon: "/src/favicon.svg",
      });
      toast.success(
        language === "en"
          ? "📨 Demo notification sent!"
          : "📨 Njoftimi demo u dërgua!",
      );
    } else if (notifications && Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      toast.warning(
        language === "en"
          ? "🔕 Please enable notifications first"
          : "🔕 Ju lutem aktivizoni njoftimet fillimisht",
      );
    }
  };

  const handleResetAll = () => {
    setTheme("light");
    setNotifications(true);
    setAutoSave(true);
    setLanguage("en");
    setFontSize("medium");

    localStorage.setItem("theme", "light");
    localStorage.setItem("notifications", "true");
    localStorage.setItem("autoSave", "true");
    localStorage.setItem("language", "en");
    localStorage.setItem("fontSize", "medium");

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("text-sm", "text-lg");
    document.documentElement.classList.add("text-base");
    document.documentElement.lang = "en";

    stopAutoSaveInterval();
    startAutoSaveInterval();

    toast.success(
      language === "en"
        ? "✓ All settings reset"
        : "✓ Të gjitha cilësimet u rivendosën",
    );
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="flex flex-col flex-1 max-h-full px-6 overflow-y-auto pb-8">
      <h1 className="w-full text-4xl font-bold text-left dark:text-white mb-8">
        {language === "en" ? "Preferences" : "Cilësimet"}
      </h1>

      <div className="mb-6 p-4 bg-primary/20 dark:bg-primary/10 rounded-xl text-center">
        <p className="text-gray-700 dark:text-gray-300">
          {translatedText.welcome}
        </p>
      </div>

      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          🎨 {language === "en" ? "Appearance" : "Pamja"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {language === "en" ? "Dark Mode" : "Modaliteti i Errët"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "en"
                  ? "Switch between light and dark theme"
                  : "Ndrysho midis temës së hapët dhe të errët"}
              </p>
            </div>
            <button
              onClick={handleThemeToggle}
              className="px-4 py-2 bg-primary text-gray-800 rounded-lg hover:opacity-80"
            >
              {theme === "light"
                ? language === "en"
                  ? "🌙 Enable Dark Mode"
                  : "🌙 Aktivizo Modalitetin e Errët"
                : language === "en"
                  ? "☀️ Enable Light Mode"
                  : "☀️ Aktivizo Modalitetin e Hapët"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {language === "en" ? "Font Size" : "Madhësia e Fontit"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "en"
                  ? "Adjust text size"
                  : "Rregulloni madhësinë e tekstit"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFontSizeChange("small")}
                className={`px-3 py-1 rounded-lg ${fontSize === "small" ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                {language === "en" ? "Small" : "E Vogël"}
              </button>
              <button
                onClick={() => handleFontSizeChange("medium")}
                className={`px-3 py-1 rounded-lg ${fontSize === "medium" ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                {language === "en" ? "Medium" : "E Mesme"}
              </button>
              <button
                onClick={() => handleFontSizeChange("large")}
                className={`px-3 py-1 rounded-lg ${fontSize === "large" ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                {language === "en" ? "Large" : "E Madhe"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* General Section */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          ⚙️ {language === "en" ? "General" : "Të Përgjithshme"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {language === "en" ? "Notifications" : "Njoftimet"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "en"
                  ? "Receive notifications from apps"
                  : "Merrni njoftime nga aplikacionet"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={sendDemoNotification}
                className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                {language === "en" ? "Send Demo" : "Dërgo Demo"}
              </button>
              <button
                onClick={handleTestNotification}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                {language === "en" ? "Test" : "Testo"}
              </button>
              <button
                onClick={handleNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? "bg-primary" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {language === "en" ? "Auto-Save" : "Ruajtja Automatike"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "en"
                  ? "Save work every 30 seconds"
                  : "Ruani punën çdo 30 sekonda"}
              </p>
            </div>
            <button
              onClick={handleAutoSaveToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSave ? "bg-primary" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSave ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          🌐 {language === "en" ? "Language" : "Gjuha"}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${language === "en" ? "bg-primary text-gray-800 scale-105" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => handleLanguageChange("sq")}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${language === "sq" ? "bg-primary text-gray-800 scale-105" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            🇦🇱 Shqip
          </button>
        </div>
      </div>

      {/* Auto-Save Status */}
      {autoSave && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
          <p className="text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
            💾{" "}
            {language === "en"
              ? "Auto-save is active - Documents saved every 30 seconds"
              : "Ruajtja automatike është aktive - Dokumentet ruhen çdo 30 sekonda"}
          </p>
        </div>
      )}

      {/* About Section */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          ℹ️ {language === "en" ? "About" : "Rreth Nesh"}
        </h2>
        <p>OS Project - Version 2.0.0</p>
        <p className="text-sm text-gray-500">
          {language === "en"
            ? "Built with React, TypeScript, Tailwind CSS"
            : "Ndërtuar me React, TypeScript, Tailwind CSS"}
        </p>
        <p className="text-xs text-gray-400 mt-2">© 2024 OS Project</p>
      </div>

      {/* Reset Button */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <button
          onClick={handleResetAll}
          className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-105"
        >
          🔄{" "}
          {language === "en"
            ? "Reset All Settings"
            : "Rivendos të Gjitha Cilësimet"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          {language === "en"
            ? "This will reset all preferences and refresh the page"
            : "Kjo do të rivendosë të gjitha preferencat dhe do të rifreskojë faqen"}
        </p>
      </div>

      {/* Status Bar */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {language === "en" ? "Theme" : "Tema"}:{" "}
        <span className="font-semibold capitalize">{theme}</span>
        {" • "}
        {language === "en" ? "Font" : "Fonti"}:{" "}
        <span className="font-semibold capitalize">{fontSize}</span>
        {" • "}
        {notifications ? "🔔" : "🔕"}{" "}
        {language === "en" ? "Notifications" : "Njoftimet"}:{" "}
        {notifications ? "ON" : "OFF"}
        {" • "}
        {language === "en" ? "Auto-save" : "Ruajtja auto"}:{" "}
        <span className="font-semibold">{autoSave ? "ON" : "OFF"}</span>
      </div>
    </div>
  );
};
