import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Image, Trash2, Eye, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

function PrivacyPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    storePhotosLocally: true,
    autoDeleteOldItems: false,
    autoDeleteDays: 365,
    analyticsEnabled: false,
    shareUsageData: false
  });
  const [cacheSize, setCacheSize] = useState("0 MB");
  useEffect(() => {
    const saved = localStorage.getItem("privacySettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load privacy settings:", error);
      }
    }
    estimateCacheSize();
  }, []);
  const estimateCacheSize = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      setCacheSize(`${sizeInMB} MB`);
    } catch (error) {
      console.error("Failed to estimate cache size:", error);
      setCacheSize("Unknown");
    }
  };
  const updateSetting = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    localStorage.setItem("privacySettings", JSON.stringify(newSettings));
  };
  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear the cache? This will remove temporary data but keep your wardrobe items.")) {
      const keysToKeep = Object.keys(localStorage).filter((key) => key.startsWith("profile_") || key === "activeProfileId" || key === "theme" || key === "privacySettings" || key === "notificationSettings");
      localStorage.clear();
      keysToKeep.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) localStorage.setItem(key, value);
      });
      estimateCacheSize();
      alert("Cache cleared successfully!");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/settings"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Privacy"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Data Storage" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-gray-100 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Store Photos Locally" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Keep item photos in browser storage" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("storePhotosLocally", !settings.storePhotosLocally), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.storePhotosLocally ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.storePhotosLocally ? "translate-x-6" : "translate-x-1"}` }) })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-red-50 dark:bg-red-950 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 text-red-600 dark:text-red-400" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Auto-Delete Old Items" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Automatically remove unused items" })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("autoDeleteOldItems", !settings.autoDeleteOldItems), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoDeleteOldItems ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoDeleteOldItems ? "translate-x-6" : "translate-x-1"}` }) })
              ] }),
              settings.autoDeleteOldItems && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm text-gray-600 dark:text-gray-400 mb-2", children: [
                  "Delete items not used in ",
                  settings.autoDeleteDays,
                  " days"
                ] }),
                /* @__PURE__ */ jsx("input", { type: "range", min: "30", max: "730", step: "30", value: settings.autoDeleteDays, onChange: (e) => updateSetting("autoDeleteDays", parseInt(e.target.value)), className: "w-full" }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "30 days" }),
                  /* @__PURE__ */ jsx("span", { children: "2 years" })
                ] })
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Privacy Controls" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-gray-100 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Analytics" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Help improve the app with usage data" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("analyticsEnabled", !settings.analyticsEnabled), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.analyticsEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.analyticsEnabled ? "translate-x-6" : "translate-x-1"}` }) })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-green-600 dark:text-green-400" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Share Usage Data" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Anonymous data for app improvement" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("shareUsageData", !settings.shareUsageData), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.shareUsageData ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.shareUsageData ? "translate-x-6" : "translate-x-1"}` }) })
            ] }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Cache" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Cache Size" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: cacheSize })
          ] }) }),
          /* @__PURE__ */ jsx("button", { onClick: handleClearCache, className: "w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", children: "Clear Cache" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-800 dark:text-green-200", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Your Privacy Matters:" }),
        " All your data is stored locally on your device. We never send your wardrobe data to external servers."
      ] }) })
    ] })
  ] }) });
}

export { PrivacyPage as component };
//# sourceMappingURL=privacy-DPX4yY0I.mjs.map
